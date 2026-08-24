const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const colorMap = {
  // Backgrounds
  'bg-slate-950': 'bg-background',
  'bg-slate-900': 'bg-card',
  'bg-slate-800': 'bg-muted',
  'bg-slate-700': 'bg-muted',
  'bg-slate-900/40': 'bg-card',
  'bg-slate-900/50': 'bg-card',
  'bg-slate-900/60': 'bg-card',
  'bg-slate-900/70': 'bg-card',
  'bg-slate-900/80': 'bg-card',
  'bg-slate-900/90': 'bg-card',
  'bg-slate-950/80': 'bg-background/80',
  'bg-slate-950/90': 'bg-background/90',
  'bg-slate-950/95': 'bg-background/95',
  
  // Hover Backgrounds
  'hover:bg-slate-900': 'hover:bg-accent',
  'hover:bg-slate-800': 'hover:bg-accent',
  'hover:bg-slate-700': 'hover:bg-accent',
  
  // Borders
  'border-slate-900': 'border-border',
  'border-slate-800': 'border-border',
  'border-slate-700': 'border-border',
  'border-slate-600': 'border-border',
  
  'divide-slate-800': 'divide-border',
  'divide-slate-700': 'divide-border',

  // Text colors
  'text-white': 'text-foreground',
  'text-slate-50': 'text-foreground',
  'text-slate-100': 'text-foreground',
  'text-slate-200': 'text-foreground',
  'text-slate-300': 'text-muted-foreground',
  'text-slate-400': 'text-muted-foreground',
  'text-slate-500': 'text-muted-foreground',
  
  'hover:text-white': 'hover:text-foreground',
  'hover:text-slate-100': 'hover:text-foreground',
  'hover:text-slate-200': 'hover:text-foreground',
  'hover:text-slate-300': 'hover:text-foreground',
  
  // Violet / Primary
  'bg-violet-600': 'bg-primary',
  'bg-violet-500': 'bg-primary',
  'bg-violet-500/10': 'bg-primary/10',
  'bg-violet-500/20': 'bg-primary/20',
  'hover:bg-violet-600': 'hover:bg-primary/90',
  'hover:bg-violet-500': 'hover:bg-primary/90',
  'hover:bg-violet-400': 'hover:bg-primary/90',
  
  'text-violet-500': 'text-primary',
  'text-violet-400': 'text-primary',
  'border-violet-500': 'border-primary',
  
  'ring-slate-700': 'ring-border',
  'ring-slate-800': 'ring-border',
  
  // Specific fix for "text-white" in buttons which now should be text-primary-foreground
  // But regex might be tricky. We'll rely on text-foreground which handles light/dark mostly well,
  // except for primary buttons which should be text-primary-foreground. We can fix primary buttons later if they look wrong.
};

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Use a regex to match whole words/classes.
  for (const [key, value] of Object.entries(colorMap)) {
    // Escape special characters in key
    const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(?<![a-zA-Z0-9-])` + escapedKey + `(?![a-zA-Z0-9-])`, 'g');
    content = content.replace(regex, value);
  }

  // A couple special tweaks for primary buttons and text
  // if something is bg-primary text-foreground, we probably want text-primary-foreground
  content = content.replace(/bg-primary([^"']*)text-foreground/g, 'bg-primary$1text-primary-foreground');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
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
      processFile(fullPath);
    }
  }
}

walkDir(srcDir);
console.log("Done updating colors.");
