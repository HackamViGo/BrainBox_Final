/**
 * BrainBox Phase Logging Script
 * Manages ops/logs/INDEX.json for project status tracking.
 */
import fs from 'fs';
import path from 'path';

const LOG_FILE = path.join(process.cwd(), 'ops/logs/INDEX.json');

function ensureDir(filePath) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

const args = process.argv.slice(2);
const command = args[0];

if (command === 'start') {
  const [_, id, name, phase] = args;
  const log = { id, name, phase, status: 'IN_PROGRESS', startedAt: new Date().toISOString() };
  appendLog(log);
} else if (command === 'finish') {
  const [_, id, summary] = args;
  updateLog(id, { status: 'COMPLETED', finishedAt: new Date().toISOString(), summary });
}

function appendLog(entry) {
  ensureDir(LOG_FILE);
  let logs = [];
  if (fs.existsSync(LOG_FILE)) {
    logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
  }
  logs.push(entry);
  fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
}

function updateLog(id, updates) {
  if (fs.existsSync(LOG_FILE)) {
    const logs = JSON.parse(fs.readFileSync(LOG_FILE, 'utf8'));
    const index = logs.findIndex(l => l.id === id);
    if (index !== -1) {
      logs[index] = { ...logs[index], ...updates };
      fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));
    }
  }
}
