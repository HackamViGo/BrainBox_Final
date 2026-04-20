import { ExtensionChatPayload } from '@brainbox/types';
import { decryptData, logger } from '@brainbox/utils';

/**
 * SyncManager
 * Manages the offline queue and synchronization of captures with the BrainBox Web App.
 */
export class SyncManager {
  private queue: ExtensionChatPayload[] = [];
  private isSyncing = false;
  private readonly DASHBOARD_URL = 'http://localhost:3000';
  private readonly INTERNAL_SECRET = 'brainbox-secure-bridge-2026';

  constructor() {
    this.loadQueue();
    // Setup background check every 5 minutes if there are items in queue
    chrome.alarms.create('sync-check', { periodInMinutes: 5 });
    chrome.alarms.onAlarm.addListener((alarm) => {
      if (alarm.name === 'sync-check') {
        this.processQueue();
      }
    });
  }

  /**
   * Adds a capture to the queue and attempts synchronization.
   */
  async addToQueue(data: ExtensionChatPayload): Promise<{ success: boolean; queued: boolean }> {
    this.queue.push(data);
    await this.persistQueue();
    
    const wasProcessed = await this.processQueue();
    return { 
      success: wasProcessed, 
      queued: !wasProcessed 
    };
  }

  private async persistQueue(): Promise<void> {
    await chrome.storage.local.set({ sync_queue: this.queue });
  }

  private async loadQueue(): Promise<void> {
    const { sync_queue } = await chrome.storage.local.get('sync_queue');
    if (sync_queue) {
      this.queue = sync_queue;
    }
  }

  /**
   * Attempts to sync all items in the queue.
   * Returns true if at least the current item was synced.
   */
  async processQueue(): Promise<boolean> {
    if (this.isSyncing || this.queue.length === 0) return false;
    this.isSyncing = true;
    let syncedAny = false;

    try {
      while (this.queue.length > 0) {
        const item = this.queue[0];
        if (!item) {
          this.queue.shift();
          continue;
        }

        const success = await this.performSync(item);
        
        if (success) {
          this.queue.shift();
          await this.persistQueue();
          syncedAny = true;
          logger.info('SyncManager', `Item synced: ${item.id}`);
        } else {
          logger.warn('SyncManager', `Sync failed for: ${item.id}`);
          break; // Stop processing if sync fails (usually network/auth issues)
        }
      }
    } finally {
      this.isSyncing = false;
    }

    return syncedAny;
  }

  private async performSync(data: ExtensionChatPayload): Promise<boolean> {
    const { auth_secure } = (await chrome.storage.local.get('auth_secure')) as { 
      auth_secure?: { ciphertext: string; iv: string; salt: string } 
    };
    
    if (!auth_secure) return false;

    try {
      const decryptedAuth = await decryptData(
        auth_secure.ciphertext,
        auth_secure.iv,
        auth_secure.salt,
        this.INTERNAL_SECRET
      );
      const auth = JSON.parse(decryptedAuth) as { token?: string };

      if (!auth?.token) return false;

      const response = await fetch(`${this.DASHBOARD_URL}/api/chats/extension`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify(data)
      });

      return response.ok;
    } catch {
      return false;
    }
  }
}
