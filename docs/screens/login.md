# Login

**File:** `apps/web-app/screens/Login.tsx`  
**Route:** `activeScreen === 'login'`  
**NeuralField mode:** wander  
**Store dependencies:** useAppStore

## Purpose

Входна точка за приложението — аутентикация чрез имейл или социални мрежи.

## UI Structure

Централизирана "стъклена" форма със силни визуални ефекти (NeuralField), предразполагаща към сигурност и технологичност.

## State

| Variable   | Source      | Description                                                                       |
| ---------- | ----------- | --------------------------------------------------------------------------------- |
| isLoggedIn | useAppStore | Променя се при успешна аутентикация, отключвайки останалата част от приложението. |

## User Flows

1. Потребителят въвежда данни и влиза → Пренасочване към Dashboard.

## Known Issues

- [ ] Все още се разчита на стандартните Supabase UI съобщения за грешка.

## Placeholders

- [ ] Bio-metric login — за поддържани устройства.

## Last Updated

2026-04-16
