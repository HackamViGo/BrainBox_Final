const fs = require('fs');
const path = require('path');

const SKILLS_DIR = '.agents/skills';
const REQUIRED_SKILLS = [
  'ai-pipeline', 'brainbox-ui', 'context-rules', 'error-handling',
  'extension-bridge', 'extension-mv3', 'logging', 'monitoring',
  'monorepo', 'nextjs-api', 'platform-adapters', 'security',
  'supabase-rls', 'testing', 'typescript', 'zustand'
];

function checkSkills() {
  console.log('--- BrainBox Skills Integrity Check ---');
  let missing = 0;
  
  REQUIRED_SKILLS.forEach(skill => {
    const skillPath = path.join(SKILLS_DIR, skill, 'SKILL.md');
    if (fs.existsSync(skillPath)) {
      console.log(`✅ [${skill}] found.`);
    } else {
      console.log(`❌ [${skill}] MISSING!`);
      missing++;
    }
  });

  if (missing === 0) {
    console.log('\n✅ All 16 skills are present and indexed.');
    process.exit(0);
  } else {
    console.log(`\n❌ Total missing skills: ${missing}`);
    process.exit(1);
  }
}

checkSkills();
