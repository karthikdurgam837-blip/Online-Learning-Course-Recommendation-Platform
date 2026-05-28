const fs = require('fs');
const path = require('path');

const panelPath = path.join(__dirname, 'src', 'components', 'InfoPanel.tsx');
let panelContent = fs.readFileSync(panelPath, 'utf8');

panelContent = panelContent
  .replace(/teal-600/g, 'emerald-600')
  .replace(/teal-500/g, 'emerald-500')
  .replace(/teal-400/g, 'emerald-400')
  .replace(/teal-300/g, 'emerald-300')
  .replace(/teal-200/g, 'emerald-200')
  .replace(/teal-100/g, 'emerald-100')
  .replace(/teal-50/g, 'emerald-50')
  .replace(/teal-900/g, 'emerald-900')
  .replace(/teal-950/g, 'emerald-950')
  .replace(/teal-/g, 'emerald-')
  .replace(/shadow-teal/g, 'shadow-emerald')
  .replace(/border-teal/g, 'border-emerald')
  .replace(/bg-teal/g, 'bg-emerald')
  .replace(/text-teal/g, 'text-emerald')
  .replace(/Aurora Learning Systems/g, 'EdEasy Learning Systems');

fs.writeFileSync(panelPath, panelContent, 'utf8');
console.log('InfoPanel.tsx colors updated!');
