const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function replaceInFile(filePath) {
  // Skip global css as it defines the variables
  if(filePath.includes('globals.css')) return;
  const content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  const replaceMap = {
    // Specific compound classes (handle these first before raw ones)
    'bg-slate-50/50': 'bg-background hover:bg-linear-surface/50',
    'bg-white/80': 'bg-linear-surface/80',
    'bg-white/50': 'bg-linear-surface/50',
    
    // Structural backgrounds
    'bg-slate-50': 'bg-background',
    'bg-white': 'bg-linear-surface',
    'dark:bg-slate-950/50': '',
    'dark:bg-slate-950': '',
    'dark:bg-slate-900/80': '',
    'dark:bg-slate-900/50': '',
    'dark:bg-slate-900/40': '',
    'dark:bg-slate-900': '',
    'dark:bg-slate-800/80': '',
    'dark:bg-slate-800/50': '',
    'dark:bg-slate-800': '',
    'dark:bg-slate-700': '',
    
    // Borders
    'border-slate-200': 'border-linear-border',
    'border-slate-300': 'border-linear-border',
    'dark:border-slate-800/80': '',
    'dark:border-slate-800/50': '',
    'dark:border-slate-800': '',
    'dark:border-slate-700': '',

    // Text
    'text-slate-900': 'text-foreground',
    'text-slate-800': 'text-foreground',
    'text-slate-700': 'text-foreground',
    'text-slate-600': 'text-linear-text-muted',
    'text-slate-500': 'text-linear-text-muted',
    'text-slate-400': 'text-linear-text-muted',
    'dark:text-white': '',
    'dark:text-slate-100': '',
    'dark:text-slate-200': '',
    'dark:text-slate-300': '',
    'dark:text-slate-400': '',
    'dark:text-slate-500': '',
    
    // Emerald -> Cyan
    'emerald': 'cyan',
    'Emerald': 'Cyan'
  };

  for (const [key, value] of Object.entries(replaceMap)) {
    const escapedKey = key.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
    // Match the class accurately without catching prefixes/suffixes. 
    // Using negative lookahead/lookbehind for -, :, /, and alphanumeric.
    const regex = new RegExp(`(?<![a-zA-Z0-9:-])${escapedKey}(?![a-zA-Z0-9:-])`, 'g');
    newContent = newContent.replace(regex, value);
  }
  
  // Clean up double spaces
  newContent = newContent.replace(/  +/g, ' ');
  // Clean up empty className props if any
  newContent = newContent.replace(/className="\s+"/g, 'className=""');

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

walkDir(directoryPath);
console.log('Replacement complete.');
