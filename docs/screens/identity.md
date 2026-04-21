# Identity

**File:** `apps/web-app/screens/Identity.tsx`  
**Route:** `activeScreen === 'identity'`  
**NeuralField mode:** wander  
**Store dependencies:** useAppStore

## Purpose

Управление на цифровата идентичност и персоналните настройки на профила.

## UI Structure

Минималистичен интерфейс с акцент върху сигурността и персоналните био данни (име, аватар, био).

## State

| Variable | Source      | Description                                |
| -------- | ----------- | ------------------------------------------ |
| user     | useAppStore | Текущо логнат потребител от Supabase Auth. |

## User Flows

1. Потребителят редактира своя профил → Промените се синхронизират със Supabase profiles таблицата.

## Known Issues

- [ ] Ограничена функционалност за промяна на аватари в момента.

## Placeholders

- [ ] Wallet connection — за Web3-базирани идентичности.

## Last Updated

2026-04-16
