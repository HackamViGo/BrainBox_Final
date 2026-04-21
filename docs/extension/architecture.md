# Extension Architecture

**Module:** `apps/extension`  
**Powered by:** Vite 8 + CRXJS + TypeScript  
**Standard:** Chrome Manifest V3 (MV3)

## Components

### 1. Service Worker (`src/background/index.ts`)

- **Lifecycle:** Активира се при събития, заспива след ~30 секунди неактивност.
- **Background Tasks:** Управлява контекстното меню и входящите съобщения (`onMessage`).
- **Storage:** Използва единствено `chrome.storage.local` за съхранение на Auth токени и настройки.
- **Strict Rule:** НЯМА право на пряк достъп до DOM.

### 2. Content Scripts (`src/content/index.ts`)

- **Isolation:** Работи в контекста на външни сайтове (ChatGPT, Gemini).
- **Read-Only DOM Policy:** Забранено е инжектирането на бутони, плаващи ленти или промяна на UI на платформата.
- **Extraction:** Използва специализирани адаптери за четене на текущия чат.
- **Safe Write:** Единствената позволена промяна в DOM е инжектиране на текст директно в основната `textarea`.

### 3. Adapters

- **BaseAdapter:** Абстрактен клас, дефиниращ интерфейса за извличане на информация.
- **ChatGPT/Gemini Adapters:** Платформено-специфична логика за парсване на DOM дървото и извличане на историята (роли и съдържание).

## Security

- **Auth Handshake:** Използва `postMessage` за сигурно получаване на Auth токен от основния уеб-ап (`dashboard`).
- **No Direct DB:** Разширението никога не вика Supabase директно. Всички данни минават през Proxy API на Dashboard.

## Last Updated

2026-04-16
