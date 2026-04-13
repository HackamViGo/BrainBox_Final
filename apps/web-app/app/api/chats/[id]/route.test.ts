import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('GET /api/chats/[id]', () => {
  it('should handle async params correctly', async () => {
    const params = Promise.resolve({ id: '123' });
    const response = await GET(new Request('...'), { params });
    expect(response.status).toBe(200);
  });
});
