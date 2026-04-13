const fs = require('fs');
const path = require('path');

const planningDir = path.join(__dirname, 'src', 'app', 'planning');

const replacements = {
  // Hero overview colors
  'bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl p-8 text-white shadow-md': 'bg-gradient-to-r from-background to-linear-surface border-b border-linear-border rounded-xl p-8 text-cyan-400 shadow-lg',
  'bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl p-8 text-white shadow-md': 'bg-gradient-to-r from-background to-linear-surface border-b border-linear-border rounded-xl p-8 text-blue-400 shadow-lg',
  'bg-gradient-to-br from-fuchsia-600 to-purple-700 rounded-xl p-8 text-white shadow-md': 'bg-gradient-to-r from-background to-linear-surface border-b border-linear-border rounded-xl p-8 text-indigo-400 shadow-lg',
  
  // Hero text elements
  'text-emerald-50': 'text-linear-text-muted',
  'text-indigo-50': 'text-linear-text-muted',
  'text-fuchsia-50': 'text-linear-text-muted',
  'bg-white/10': 'bg-cyan-500/5',
  
  // Input focuses
  'focus:border-emerald-500': 'focus:border-cyan-500',
  'focus:ring-emerald-500/20': 'focus:ring-cyan-500/20',
  'focus:bg-white': 'focus:bg-linear-surface',
  'bg-slate-50 text-foreground border border-slate-200': 'bg-linear-surface/50 text-foreground border border-linear-border',
  
  // Hardcoded table/badge styles
  'bg-emerald-100 text-emerald-900': 'bg-cyan-500/10 text-cyan-400',
  'bg-emerald-200 text-emerald-900': 'bg-cyan-500/20 text-cyan-400',
  'text-emerald-800': 'text-cyan-400',
  'bg-[#e6fcf2]': 'bg-cyan-500/10',
  '!border-cyan-500': 'border-cyan-500', // normalize
  '!text-emerald-800': 'text-cyan-400',
  'bg-emerald-400': 'bg-cyan-500',
  'border-white bg-slate-50': 'border-linear-border bg-linear-surface',
  'border-dashed border-emerald-200': 'border-dashed border-cyan-500/30'
};

function walkDir(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walkDir(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const filesToProcess = walkDir(planningDir);
let changedFiles = 0;

filesToProcess.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  Object.entries(replacements).forEach(([oldStr, newStr]) => {
    newContent = newContent.split(oldStr).join(newStr);
  });

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
    console.log(`Deep Refactored: ${file}`);
  }
});

console.log(`Successfully deep refactored ${changedFiles} files with Tech Lab classes.`);
