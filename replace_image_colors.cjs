const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.tsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// Perform vibrant palette modifications to match the exact Amber-to-Green gradient and dashboard assets of the uploaded image
appContent = appContent
  // 1. Change the main system text brand gradient
  .replace(/from-teal-400 to-cyan-400/g, 'from-amber-500 via-emerald-400 to-emerald-500')
  .replace(/from-teal-400 to-emerald-400/g, 'from-amber-500 via-emerald-400 to-emerald-500')
  .replace(/from-teal-500 to-purple-400/g, 'from-amber-600 to-emerald-600')
  .replace(/from-teal-500 to-cyan-550/g, 'from-amber-600 to-emerald-700')
  .replace(/from-teal-500 to-cyan-500/g, 'from-amber-600 to-emerald-600')
  .replace(/from-teal-950\/80 to-cyan-950\/80/g, 'from-amber-950/60 to-emerald-950/80')
  
  // 2. Change general single color anchors (Teal -> Emerald/Forest Green for layout, Amber for primary warnings/decorations)
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
  .replace(/focus:ring-teal/g, 'focus:ring-emerald')
  
  // 3. Set the simulated demo platform to display the beautiful dual-accent header (Amber/Green gradient)
  .replace(/bg-emerald-950\/30 border-blue-900\/40/g, 'bg-gradient-to-r from-amber-950/40 to-emerald-950/40 border-emerald-800/40')
  .replace(/text-emerald-300 font-display/g, 'text-transparent bg-gradient-to-r from-amber-400 to-emerald-400 bg-clip-text font-display')
  
  // 4. Update core site brand names to EdEasy to feel identical to the reference image logo
  .replace(/Aurora Learning Systems/g, 'EdEasy Learning Systems');

fs.writeFileSync(appPath, appContent, 'utf8');
console.log('App.tsx extracted image-palette updated!');
