# Testing Rules

Приложимо за: **всички проекти**

## Кога се пишат тестове

| Какво | Кога | Тип |
|-------|------|-----|
| Store action | Веднага при създаване | Unit |
| Validation schema | Веднага при създаване | Unit |
| API/Server функция | Веднага при създаване | Unit + integration |
| Utility функция | Веднага при създаване | Unit |
| UI компонент с логика | При PR | Component |
| Критичен user flow | При PR за тази feature | E2E |
| Pure presentational компонент | По избор | Пропусни |

**Правило:** Ако пишеш функция с повече от 1 branch (if/else, switch) → пиши тест.

## Структура на тестовете

```text
__tests__/
├── unit/
│   ├── store/
│   ├── actions/
│   └── utils/
├── components/
└── integration/

e2e/
├── critical-flows.spec.ts
└── ...
```

## Правила за писане на тестове

- **Arrange → Act → Assert** структура в всеки тест
- Mock external dependencies в unit тестове
- E2E тестове използват test environment
- Описателни имена: `it('should redirect to login when user is not authenticated')`
- Не тествай implementation details — тествай behaviour
