-- ADR-012: Extension Architecture - Data Schema Updates
-- Adds support for isolated platform tracking and external resource linking.

ALTER TABLE public.items
ADD COLUMN IF NOT EXISTS source_id  text,               -- Unique ID from the platform (e.g. ChatGPT chat ID)
ADD COLUMN IF NOT EXISTS platform   text check (platform in (
  'chatgpt','gemini','claude','grok',
  'perplexity','lmarena','deepseek','qwen'
)),
ADD COLUMN IF NOT EXISTS url        text,               -- Link back to original chat
ADD COLUMN IF NOT EXISTS messages   jsonb default '[]'; -- Full conversation sync (optional)

-- INDEXES FOR EXTENSION SYNC
-- source_id should be unique PER user PER platform to prevent duplicates
CREATE UNIQUE INDEX IF NOT EXISTS idx_items_source_platform ON public.items (user_id, source_id, platform) 
WHERE source_id IS NOT NULL;

-- COMMENTS
COMMENT ON COLUMN public.items.source_id IS 'Internal ID from the AI service (ChatGPT, Claude, etc)';
COMMENT ON COLUMN public.items.platform IS 'AI Platform name for adapter routing';
COMMENT ON COLUMN public.items.url IS 'Direct link back to the source AI platform';
COMMENT ON COLUMN public.items.messages IS 'Synchronized message history in JSONB format';
