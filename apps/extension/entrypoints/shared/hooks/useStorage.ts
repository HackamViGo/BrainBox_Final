import { useState, useEffect } from 'react';
import { storage } from '../utils/storage';

/**
 * Hook for reactive access to chrome.storage.local
 */
export function useStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    // Initial fetch
    storage.get<T>(key).then((val) => {
      if (val !== null) setValue(val);
    });

    // Listen for changes
    const listener = (changes: { [key: string]: chrome.storage.StorageChange }, areaName: string) => {
      if (areaName === 'local' && changes[key]) {
        setValue(changes[key].newValue as T);
      }
    };

    chrome.storage.onChanged.addListener(listener);
    return () => chrome.storage.onChanged.removeListener(listener);
  }, [key]);

  const updateValue = async (newValue: T) => {
    await storage.set(key, newValue);
    setValue(newValue);
  };

  return [value, updateValue] as const;
}
