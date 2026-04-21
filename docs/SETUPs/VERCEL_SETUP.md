# Vercel Deployment & Environment Configuration

Този документ описва как да конфигурирате BrainBox в Vercel Dashboard, като използвате централизирания подход за управление на променливи на средата.

## 🔑 Разлика между Local и Cloud конфигурация

| Среда            | Как се управлява? | Файл / Местоположение                    |
| ---------------- | ----------------- | ---------------------------------------- |
| **Local Dev**    | `dotenv-cli`      | `/.env.local` (root)                     |
| **Vercel Cloud** | Vercel Dashboard  | Project Settings → Environment Variables |

## 🚀 Настройка стъпка по стъпка

### 1. Добавяне на променливи в Vercel

Отидете в [Vercel Dashboard](https://vercel.com), изберете вашия проект и навигирайте до **Settings > Environment Variables**.

Добавете следните ключове (от `.env.example`):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_GEMINI_API_KEY`

### 2. Environment Scoping

В Vercel можете да зададете различни стойности за:

- **Production**: Вашият реален Supabase проект.
- **Preview**: Тестови Supabase проект (за PRs).
- **Development**: Local development (обикновено съвпада с Production или отделен dev проект).

### 3. Защо не ползваме .env файлове в GitHub?

`.env.local` файловете са игнорирани от Git от съображения за сигурност. Vercel НЕ чете тези файлове по време на build процеса в облака. Той инжектира променливите директно от своя Dashboard в Runtime средата.

## ⚠️ Важно за Local Development

Когато добавяте нов ключ в Dashboard, не забравяйте да го добавите и в:

1. `/.env.local` (за да работи локално)
2. `/.env.example` (за да знаят другите dev-ове за него)

## 🛠️ Debugging

Ако приложението не вижда някоя променлива в облака:

1. Проверете дали ключът започва с `NEXT_PUBLIC_` (ако се ползва в Client Components).
2. Направете нов **Redeploy** в Vercel, за да се инжектират новите стойности.
