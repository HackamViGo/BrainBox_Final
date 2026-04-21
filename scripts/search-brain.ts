import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { logger } from '../packages/utils/src/logger';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, '..');
const DOCS_DIR = join(ROOT, 'docs');

const query = process.argv.slice(2).join(' ');

if (!query) {
    logger.error('SEARCH_BRAIN', 'Usage: npx tsx scripts/search-brain.ts <query>');
    process.exit(1);
}

logger.info('SEARCH_BRAIN', `🔍 Searching BrainBox Knowledge for: "${query}"...\n`);

interface SearchResult {
    file: string;
    line: number;
    content: string;
}

const results: SearchResult[] = [];

function searchDir(dir: string) {
    const files = readdirSync(dir);
    for (const file of files) {
        const fullPath = join(dir, file);
        if (statSync(fullPath).isDirectory()) {
            searchDir(fullPath);
        } else if (file.endsWith('.md') || file.endsWith('.json')) {
            const content = readFileSync(fullPath, 'utf-8');
            const lines = content.split('\n');
            lines.forEach((line, index) => {
                if (line.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        file: relative(ROOT, fullPath),
                        line: index + 1,
                        content: line.trim()
                    });
                }
            });
        }
    }
}

searchDir(DOCS_DIR);

if (results.length === 0) {
    logger.info('SEARCH_BRAIN', '❌ No matches found.');
} else {
    // Group by file
    const grouped = results.reduce((acc, curr) => {
        if (!acc[curr.file]) acc[curr.file] = [];
        acc[curr.file].push(curr);
        return acc;
    }, {} as Record<string, SearchResult[]>);

    Object.entries(grouped).forEach(([file, matches]) => {
        logger.info('SEARCH_BRAIN', `\x1b[1m\x1b[36m${file}\x1b[0m (${matches.length} matches)`);
        matches.slice(0, 5).forEach(m => {
            logger.info('SEARCH_BRAIN', `  \x1b[90mL${m.line}:\x1b[0m ${m.content.slice(0, 120)}${m.content.length > 120 ? '...' : ''}`);
        });
        if (matches.length > 5) {
            logger.info('SEARCH_BRAIN', `  \x1b[90m... and ${matches.length - 5} more\x1b[0m`);
        }
        logger.info('SEARCH_BRAIN', '');
    });
}
