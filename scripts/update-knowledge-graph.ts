import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, '..');
const KNOWLEDGE_PATH = join(ROOT, 'docs/JSONs/KNOWLEDGE_GRAPH.json');
const GRAPH_PATH = join(ROOT, 'docs/JSONs/GRAPH.json');
const SCREENS_DIR = join(ROOT, 'docs/screens');

function readJson(path: string) {
    if (!existsSync(path)) return null;
    const raw = readFileSync(path, 'utf-8');
    const clean = raw.replace(/\/\/.*$/gm, '').replace(/,(\s*[}\]])/g, '$1');
    return JSON.parse(clean);
}

async function main() {
    console.log('🧠 BrainBox Knowledge Graph Updater\n');

    const kg = readJson(KNOWLEDGE_PATH);
    const g = readJson(GRAPH_PATH);

    if (!kg) {
        console.error('❌ docs/KNOWLEDGE_GRAPH.json not found!');
        process.exit(1);
    }

    // Update Metadata
    kg.metadata.last_updated = new Date().toISOString();
    
    // Check Consistency with GRAPH.json (Technical Sync)
    if (g && g.nodes) {
        const technicalIds = new Set(g.nodes.map((n: any) => n.id));
        
        kg.concepts.forEach((concept: any) => {
            concept.related_code.forEach((path: string) => {
                const normalizedPath = path.replace(/^\//, '');
                if (!technicalIds.has(normalizedPath)) {
                    // Check if is actually a directory (regex mapping)
                    if (!normalizedPath.includes('*')) {
                         console.warn(`⚠️  Concept "${concept.label}" references missing file: ${path}`);
                    }
                }
            });
        });
    }

    // Screen Discovery Sync
    const screenFiles = readdirSync(SCREENS_DIR).filter(f => f.endsWith('.md') && f !== '_TEMPLATE.md');
    const documentedScreens = new Set(screenFiles.map(f => f.replace('.md', '')));
    
    // Heuristic Check: Are all screens in user_flows or related_code?
    const usedInKg = new Set();
    kg.concepts.forEach((c: any) => c.related_code.forEach((p: string) => usedInKg.add(p)));
    kg.relationships.forEach((r: any) => {
        usedInKg.add(r.from);
        usedInKg.add(r.to);
    });

    console.log(`📊 Found ${documentedScreens.size} documented screens.`);

    // Final Write
    writeFileSync(KNOWLEDGE_PATH, JSON.stringify(kg, null, 2), 'utf-8');
    console.log('\n✅ KNOWLEDGE_GRAPH.json updated successfully.');
}

main().catch(console.error);
