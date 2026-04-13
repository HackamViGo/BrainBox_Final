import type { UserConfig } from '@commitlint/types'

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Типове — точно тези от GEMINI.md
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'docs', 'test', 'refactor', 'style'],
    ],
    // Scope е незадължителен, но ако е — lowercase
    'scope-case': [2, 'always', 'lower-case'],
    // Subject: не завършва с точка
    'subject-full-stop': [2, 'never', '.'],
    // Subject: sentence case (не ALL CAPS)
    'subject-case': [2, 'never', ['upper-case', 'pascal-case', 'start-case']],
    // Максимална дължина на header
    'header-max-length': [2, 'always', 100],
  },
}

export default config
