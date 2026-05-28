const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'components', 'InfoPanel.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Replacement mappings
const replacements = [
  // 1. Typos or custom fractions
  { search: /indigo-950/g, replace: 'teal-950' },
  { search: /indigo-900/g, replace: 'teal-900' },
  { search: /indigo-800/g, replace: 'teal-800' },
  { search: /indigo-600/g, replace: 'teal-600' },
  { search: /indigo-500/g, replace: 'teal-500' },
  { search: /indigo-400/g, replace: 'teal-400' },
  { search: /indigo-300/g, replace: 'teal-300' },
  { search: /indigo-200/g, replace: 'teal-200' },
  { search: /indigo-100/g, replace: 'teal-100' },
  
  // 2. Main color families
  { search: /indigo-/g, replace: 'teal-' },
  { search: /purple-/g, replace: 'cyan-' },
  { search: /violet-/g, replace: 'emerald-' },
  
  // 3. Brand text changes
  { search: /Apex Learning Systems/g, replace: 'Aurora Learning Systems' },
];

for (const rep of replacements) {
  content = content.replace(rep.search, rep.replace);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('InfoPanel.tsx colors modified successfully!');
