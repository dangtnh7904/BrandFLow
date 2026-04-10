import os
import re

mapping = {
    "bg-[#111C44]": "bg-white dark:bg-zinc-900",
    "bg-[#0B1437]": "bg-slate-50 dark:bg-zinc-950",
    "border-[#1B254B]/50": "border-slate-100 dark:border-zinc-800/50",
    "border-[#1B254B]": "border-slate-200 dark:border-zinc-800",
    "text-white": "text-slate-800 dark:text-white",
    "text-[#A0AEC0]": "text-slate-500 dark:text-zinc-400",
    "focus:ring-[#0075FF]": "focus:ring-indigo-500 dark:focus:ring-indigo-400",
    "focus:border-[#0075FF]": "focus:border-indigo-500 dark:focus:border-indigo-400",
    "bg-[#0075FF]": "bg-indigo-600 shadow-[0_4px_15px_rgba(79,70,229,0.3)]",
    "hover:bg-[#0055c4]": "hover:bg-indigo-700",
    "shadow-[0_4px_24px_rgba(0,0,0,0.1)]": "shadow-sm",
    "text-[#0075FF]": "text-indigo-600 dark:text-indigo-400",
    "bg-[#1B254B]": "bg-slate-100 dark:bg-zinc-800",
    "hover:bg-[#1B254B]": "hover:bg-slate-200 dark:hover:bg-zinc-700",
    "hover:bg-[#2D3748]": "hover:bg-slate-300 dark:hover:bg-zinc-700",
    "bg-[#0075FF]/10": "bg-indigo-50 dark:bg-indigo-500/10",
    "border-[#0075FF]/30": "border-indigo-100 dark:border-indigo-500/30",
    "text-[#F59E0B]": "text-amber-500 dark:text-amber-400",
    "border-[#0075FF]/20": "border-indigo-200 dark:border-indigo-500/20",
    "bg-[#2D3748]": "bg-slate-300 dark:bg-zinc-600"
}

def migrate_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Manual fixes for complex text-white conditions, don't replace if it's already properly modified
    # We will just do a dumb string replace for classes
    for old, new in mapping.items():
        # Prevent replacing things already containing the target manually
        if old in content:
            content = content.replace(old, new)
            
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
        
directory = r"C:\Users\HP\OneDrive - Hanoi University of Science and Technology\BrandFLow\frontend\src\components"
for filename in os.listdir(directory):
    if filename.endswith(".jsx"):
        migrate_file(os.path.join(directory, filename))
        
print("Migration completed.")
