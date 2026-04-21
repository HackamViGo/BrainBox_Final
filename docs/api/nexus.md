# AI Nexus API (Proxying)

**Files:** `apps/web-app/lib/gemini.ts`, `apps/web-app/screens/AINexus.tsx`  
**Integration:** Google Gemini SDK, Direct API Calls.

## Overview

AI Nexus не използва класически Server Actions за своите чат функции, а разчита на директна комуникация със SDK (за Gemini) или проксиране на заявки през браузъра за по-ниска латентност.

## Integration Methods

### 1. Basic Response (Internal)

Използва `generateBasicResponse` за операции, които не изискват API ключ от потребителя (често за демонстрация или системни функции).

### 2. User-Provided Keys

Ако потребителят е предоставил собствен API ключ в Settings, приложението го извлича от `useAppStore` и го инжектира в заглавията (headers) на заявката към съответния AI провайдър.

## Security

- API ключовете се съхраняват **криптирано** (в Zustand/LocalStorage) и се подават към бекенда само при нужда.
- Всички AI заявки минават през проверка за аутентикация на потребителя.

## Last Updated

2026-04-16
