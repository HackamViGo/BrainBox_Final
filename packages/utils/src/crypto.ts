/**
 * BrainBox Cryptography (AES-GCM)
 * Standards defined in .agent/skills/aes-gcm-crypto/SKILL.md
 */

const ALGORITHM = 'AES-GCM';
const PBKDF2_ITERATIONS = 100000;
const SALT_BYTE_LENGTH = 16;
const IV_BYTE_LENGTH = 12;

/**
 * Derives a CryptoKey from a secret passphrase using PBKDF2.
 */
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const baseKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(passphrase),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as unknown as ArrayBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: 'SHA-256',
    },
    baseKey,
    { name: ALGORITHM, length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

function bufferToBase64(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  const CHUNK_SIZE = 8192;
  for (let i = 0; i < bytes.length; i += CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK_SIZE));
  }
  return btoa(binary);
}

/**
 * Encrypts a string using AES-GCM.
 */
export async function encryptData(
  plainText: string,
  passphrase: string
): Promise<{ ciphertext: string; iv: string; salt: string }> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTE_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTE_LENGTH));
  const key = await deriveKey(passphrase, salt);

  const ciphertextBuffer = await crypto.subtle.encrypt(
    { name: ALGORITHM, iv },
    key,
    encoder.encode(plainText)
  );

  return {
    ciphertext: bufferToBase64(ciphertextBuffer),
    iv: bufferToBase64(iv),
    salt: bufferToBase64(salt),
  };
}

/**
 * Decrypts an AES-GCM encrypted payload.
 */
export async function decryptData(
  ciphertext: string,
  iv: string,
  salt: string,
  passphrase: string
): Promise<string> {
  const decoder = new TextDecoder();
  const saltBuffer = Uint8Array.from(atob(salt), (c) => c.charCodeAt(0));
  const ivBuffer = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
  const ciphertextBuffer = Uint8Array.from(atob(ciphertext), (c) => c.charCodeAt(0));

  const key = await deriveKey(passphrase, saltBuffer);

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: ALGORITHM, iv: ivBuffer },
    key,
    ciphertextBuffer
  );

  return decoder.decode(decryptedBuffer);
}
