import { vi } from 'vitest';

const mockStorage = {
  local: {
    get: vi.fn(),
    set: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  },
};

vi.stubGlobal('chrome', {
  storage: mockStorage,
  runtime: {
    onMessage: {
      addListener: vi.fn(),
    },
    sendMessage: vi.fn(),
  },
  tabs: {
    create: vi.fn(),
  },
});
