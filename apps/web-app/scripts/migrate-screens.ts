/* eslint-disable no-console */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import path from 'path'

const replacements = [
  [/from ['"]\.\.\/types['"]/g, "from '@brainbox/types'"],
  [/from ['"]\.\.\/constants['"]/g, "from '@brainbox/types'"],
  [/from ['"]\.\.\/components\/NeuralField['"]/g, "from '@brainbox/ui'"],
  [/from ['"]\.\.\/components\/AmbientLight['"]/g, "from '@brainbox/ui'"],
  [/from ['"]\.\.\/services\/gemini['"]/g, "from '@/lib/gemini'"],
  [/process\.env\.GEMINI_API_KEY/g, "process.env.NEXT_PUBLIC_GEMINI_API_KEY"],
  [/import \{ cn \} from ['"]\.\.\/utils['"]/g, "import { cn } from '@brainbox/utils'"],
  [/import Sidebar from ['"]\.\/Sidebar['"]/g, "import { Sidebar } from '@/components/Sidebar'"],
]

const screensToMigrate = [
  'Login',
  'Settings',
  'Archive',
  'Identity',
  'AINexus',
  'Dashboard',
  'Extension'
]

const sourceDir = path.join(process.cwd(), '../../brainbox/src/screens')
const targetDir = path.join(process.cwd(), 'screens')

if (!existsSync(targetDir)) {
  mkdirSync(targetDir, { recursive: true })
}

screensToMigrate.forEach(screenName => {
  const fileName = `${screenName}.tsx`
  const sourcePath = path.join(sourceDir, fileName)
  const targetPath = path.join(targetDir, fileName)

  if (!existsSync(sourcePath)) {
    console.warn(`⚠️ Source not found: ${sourcePath}`)
    return
  }

  let content = `'use client'\n\n` + readFileSync(sourcePath, 'utf-8')
  
  replacements.forEach(([from, to]) => {
    content = content.replace(from as RegExp, to as string)
  })

  writeFileSync(targetPath, content)
  console.log(`✅ Migrated: ${targetPath}`)
})
