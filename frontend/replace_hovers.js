const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const replacements = {
  'hover:bg-slate-50': 'hover:bg-linear-surface/80',
  'hover:bg-slate-100': 'hover:bg-linear-surface/80',
  'hover:text-slate-800': 'hover:text-foreground',
  'hover:text-slate-900': 'hover:text-foreground',
  'hover:text-slate-700': 'hover:text-foreground',
  'hover:text-slate-600': 'hover:text-linear-text-muted',
  'hover:border-slate-300': 'hover:border-cyan-500/30',
  'hover:border-slate-400': 'hover:border-cyan-500/50',
  'bg-slate-100': 'bg-linear-surface/50 border border-linear-border',
  'group-hover:border-slate-300': 'group-hover:border-cyan-500/30',
  'group-hover:bg-slate-100': 'group-hover:bg-linear-surface/80',
  'group-hover:bg-slate-200': 'group-hover:bg-linear-surface',
  'border-slate-100': 'border-linear-border',
  'border-slate-200': 'border-linear-border'
};

function walkDir(dir) {
  let results = [];
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

const files = walkDir(srcDir);
let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content;

  Object.entries(replacements).forEach(([oldStr, newStr]) => {
    newContent = newContent.split(oldStr).join(newStr);
  });

  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    changedFiles++;
    console.log(`Updated hovers in: ${file}`);
  }
});

console.log(`Successfully updated hover states in ${changedFiles} files.`);
