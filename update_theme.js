const fs = require('fs');
const path = require('path');

const files = [
  'src/features/admin/components/adminPage.tsx',
  'src/features/admin/components/frameFormModal.tsx',
  'src/features/admin/components/lensMatrixTab.tsx',
  'src/features/admin/components/masterLookupTab.tsx',
];

const replacements = [
  { from: /bg-slate-900/g, to: 'bg-cream-50' },
  { from: /bg-slate-950/g, to: 'bg-cream-100' },
  { from: /bg-slate-800\/30/g, to: 'bg-cream-200/50' },
  { from: /bg-slate-800/g, to: 'bg-cream-200' },
  { from: /border-slate-800\/60/g, to: 'border-cream-300' },
  { from: /border-slate-800\/80/g, to: 'border-cream-300' },
  { from: /border-slate-800/g, to: 'border-cream-300' },
  { from: /border-slate-700/g, to: 'border-cream-400' },
  { from: /text-white/g, to: 'text-charcoal-900' },
  { from: /text-slate-400/g, to: 'text-stone-500' },
  { from: /text-slate-500/g, to: 'text-stone-400' },
  { from: /text-slate-300/g, to: 'text-stone-600' },
  { from: /text-slate-200/g, to: 'text-stone-700' },
  { from: /bg-blue-600\/10/g, to: 'bg-stone-200' },
  { from: /bg-blue-600/g, to: 'bg-charcoal-900' },
  { from: /hover:bg-blue-500/g, to: 'hover:bg-stone-800' },
  { from: /text-blue-500/g, to: 'text-stone-500' },
  { from: /text-blue-400/g, to: 'text-charcoal-900' },
  { from: /border-blue-500/g, to: 'border-charcoal-900' },
  { from: /bg-emerald-600\/20/g, to: 'bg-emerald-100' },
  { from: /hover:bg-emerald-600\/30/g, to: 'hover:bg-emerald-200' },
  { from: /border-emerald-500\/30/g, to: 'border-emerald-200' },
  { from: /text-emerald-400/g, to: 'text-emerald-700' },
  { from: /bg-rose-600\/20/g, to: 'bg-rose-100' },
  { from: /hover:bg-rose-600\/30/g, to: 'hover:bg-rose-200' },
  { from: /border-rose-500\/30/g, to: 'border-rose-200' },
  { from: /text-rose-400/g, to: 'text-rose-700' },
  { from: /hover:bg-rose-500\/10/g, to: 'hover:bg-rose-100' },
  { from: /bg-emerald-500\/10/g, to: 'bg-emerald-50' },
  { from: /border-emerald-500\/20/g, to: 'border-emerald-200' },
  { from: /bg-rose-500\/10/g, to: 'bg-rose-50' },
  { from: /border-rose-500\/20/g, to: 'border-rose-200' },
  { from: /bg-amber-500\/10/g, to: 'bg-amber-50' },
  { from: /border-amber-500\/20/g, to: 'border-amber-200' },
  { from: /text-amber-400/g, to: 'text-amber-700' },
  { from: /divide-slate-800\/60/g, to: 'divide-cream-300' },
  { from: /bg-emerald-600/g, to: 'bg-emerald-700' },
  { from: /hover:bg-emerald-500/g, to: 'hover:bg-emerald-600' },
  { from: /shadow-blue-600\/20/g, to: 'shadow-stone-900/10' },
  { from: /hover:bg-slate-800/g, to: 'hover:bg-cream-200' },
  { from: /hover:bg-slate-700/g, to: 'hover:bg-cream-300' },
  { from: /hover:text-white/g, to: 'hover:text-charcoal-900' },
  { from: /text-white shadow-lg/g, to: 'text-cream-50 shadow-md' },
  { from: /bg-charcoal-900 text-charcoal-900/g, to: 'bg-charcoal-900 text-cream-50' }, // fix for button text
  { from: /text-charcoal-900 font-semibold text-xs px-4/g, to: 'text-cream-50 font-semibold text-xs px-4' }, // fix for Add Frame text
  { from: /hover:bg-stone-800 text-charcoal-900 font-semibold py-2\.5/g, to: 'hover:bg-stone-800 text-cream-50 font-semibold py-2.5' },
  { from: /bg-charcoal-900 hover:bg-stone-800 text-charcoal-900/g, to: 'bg-charcoal-900 hover:bg-stone-800 text-cream-50' },
  { from: /bg-charcoal-900 px-3 py-2 rounded-xl text-charcoal-900/g, to: 'bg-charcoal-900 px-3 py-2 rounded-xl text-cream-50' },
];

files.forEach(file => {
  const filePath = path.join('/home/toji/Documents/optikintercontinental', file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  replacements.forEach(r => {
    content = content.replace(r.from, r.to);
  });
  
  // Specific tweaks
  // In adminPage.tsx, the active tab should be bg-charcoal-900 text-cream-50
  content = content.replace(/bg-charcoal-900 text-charcoal-900/g, 'bg-charcoal-900 text-cream-50');
  
  // Change rounded corners
  content = content.replace(/rounded-2xl/g, 'rounded-sm');
  content = content.replace(/rounded-xl/g, 'rounded-sm');
  
  // Typography tweaks
  content = content.replace(/font-bold/g, 'font-serif font-normal');
  content = content.replace(/Dashboard Kelola Optik/, 'Dashboard Kelola Optik');
  
  fs.writeFileSync(filePath, content, 'utf8');
});

console.log('Theme updated successfully.');
