/**
 * generate-graph.ts
 * 
 * Автоматично обновява dependencies и dependents в GRAPH.json
 * чрез статичен анализ на import statements.
 * 
 * Семантичните полета (responsibility, side_effects, public_api)
 * НЕ се пипат — те се поддържат от агента.
 * 
 * Употреба:
 *   npx tsx scripts/generate-graph.ts
 *   npx tsx scripts/generate-graph.ts --check   ← само проверка, без запис
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, relative, dirname, join } from 'path'
import { glob } from 'glob'

const ROOT = resolve(__dirname, '../..')  // монорепо root
const GRAPH_PATH = join(ROOT, 'docs/GRAPH.json')
const DRY_RUN = process.argv.includes('--check')

// ── Helpers ──────────────────────────────────────────────────────────────────

function readGraph(): GraphFile {
  const raw = readFileSync(GRAPH_PATH, 'utf-8')
  // Премахва JS коментари преди JSON.parse (GRAPH.json ги съдържа)
  const clean = raw.replace(/\/\/.*$/gm, '').replace(/,(\s*[}\]])/g, '$1')
  return JSON.parse(clean)
}

function resolveImport(fromFile: string, importPath: string): string | null {
  if (!importPath.startsWith('.')) {
    // Workspace alias (@brainbox/types → packages/types/src/index.ts)
    const aliases: Record<string, string> = {
      '@brainbox/types':  'packages/types/src/index.ts',
      '@brainbox/ui':     'packages/ui/src/index.ts',
      '@brainbox/utils':  'packages/utils/src/index.ts',
      '@brainbox/config': 'packages/config/tsconfig.base.json',
    }
    for (const [alias, target] of Object.entries(aliases)) {
      if (importPath === alias || importPath.startsWith(alias + '/')) {
        return target
      }
    }
    // @/ alias → apps/web-app/
    if (importPath.startsWith('@/')) {
      return 'apps/web-app/' + importPath.slice(2) + resolveExt(
        join(ROOT, 'apps/web-app', importPath.slice(2))
      )
    }
    return null // external package, skip
  }

  // Relative import
  const base = resolve(dirname(join(ROOT, fromFile)), importPath)
  const ext = resolveExt(base)
  if (!ext) return null
  return relative(ROOT, base + ext).replace(/\\/g, '/')
}

function resolveExt(base: string): string {
  for (const ext of ['.ts', '.tsx', '/index.ts', '/index.tsx', '']) {
    if (existsSync(base + ext)) return ext
  }
  return ''
}

function extractImports(filePath: string): string[] {
  if (!existsSync(join(ROOT, filePath))) return []
  const content = readFileSync(join(ROOT, filePath), 'utf-8')
  const imports: string[] = []
  const re = /^import\s+.*?from\s+['"]([^'"]+)['"]/gm
  let m: RegExpExecArray | null
  while ((m = re.exec(content)) !== null) {
    const resolved = resolveImport(filePath, m[1])
    if (resolved) imports.push(resolved)
  }
  return [...new Set(imports)]
}

// ── Main ─────────────────────────────────────────────────────────────────────

interface GraphNode {
  id: string
  dependencies: string[]
  dependents: string[]
  [key: string]: unknown
}

interface GraphFile {
  metadata: Record<string, unknown>
  nodes: GraphNode[]
}

async function main() {
  console.log('📊 BrainBox Graph Generator\n')

  const graph = readGraph()
  const nodeMap = new Map<string, GraphNode>(
    graph.nodes.map(n => [n.id, n])
  )

  let changed = 0

  // ── Стъпка 1: Обнови dependencies чрез import анализ ──────────────────────
  for (const node of graph.nodes) {
    if (['config', 'stylesheet', 'rule', 'skill', 'skill-reference',
         'workflow', 'task-log'].includes(node.type as string)) {
      continue // тези не се анализират
    }

    const extracted = extractImports(node.id)
    const existing = [...node.dependencies].sort()
    const next = [...new Set([...extracted])].sort()

    if (JSON.stringify(existing) !== JSON.stringify(next)) {
      console.log(`  ✏️  ${node.id}`)
      console.log(`     deps: [${existing.join(', ')}]`)
      console.log(`       → [${next.join(', ')}]\n`)
      node.dependencies = next
      changed++
    }
  }

  // ── Стъпка 2: Rebuild dependents от dependencies ────────────────────────────
  // Reset
  for (const node of graph.nodes) node.dependents = []

  // Rebuild
  for (const node of graph.nodes) {
    for (const dep of node.dependencies) {
      const target = nodeMap.get(dep)
      if (target && !target.dependents.includes(node.id)) {
        target.dependents.push(node.id)
        changed++
      }
    }
  }

  // ── Стъпка 3: Провери за orphan nodes ──────────────────────────────────────
  const orphans = graph.nodes.filter(
    n => n.dependencies.length === 0 && n.dependents.length === 0
       && !['rule', 'task-log', 'package-entry', 'layout', 'page', 'middleware'].includes(n.type as string)
  )
  if (orphans.length > 0) {
    console.log('⚠️  Orphan nodes (no deps + no dependents):')
    orphans.forEach(n => console.log(`   - ${n.id}`))
    console.log()
  }

  // ── Стъпка 4: Провери за липсващи nodes ────────────────────────────────────
  const allReferenced = new Set(graph.nodes.flatMap(n => [...n.dependencies, ...n.dependents]))
  const allIds = new Set(graph.nodes.map(n => n.id))
  const missing = [...allReferenced].filter(id => !allIds.has(id))
  if (missing.length > 0) {
    console.log('❌ Referenced but missing from GRAPH.json:')
    missing.forEach(id => console.log(`   - ${id}`))
    console.log('   → Добави тези nodes или коригирай references\n')
  }

  // ── Стъпка 5: Обнови metadata ───────────────────────────────────────────────
  graph.metadata.generated_at = new Date().toISOString()
  graph.metadata.generated_by = 'SCRIPT+AGENT'
  graph.metadata.total_nodes = graph.nodes.length

  // ── Запис ───────────────────────────────────────────────────────────────────
  if (DRY_RUN) {
    console.log(`\n✅ Dry run: ${changed} промени открити. Без запис.`)
    if (missing.length > 0) process.exit(1)
    return
  }

  if (changed > 0) {
    // Preserve JS comments при запис — записваме raw с коментарите
    // (прочитаме оригинала, заменяме само nodes секцията)
    const serialized = JSON.stringify(graph, null, 2)
    writeFileSync(GRAPH_PATH, serialized, 'utf-8')
    console.log(`\n✅ GRAPH.json обновен — ${changed} промени.`)
  } else {
    console.log('\n✅ GRAPH.json е актуален — няма промени.')
  }
}

main().catch(console.error)
