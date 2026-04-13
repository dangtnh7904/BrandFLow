import os
import re

planning_dir = r"D:\Project\BrandFlow\BrandFlow\frontend\src\app\planning"

for root, _, files in os.walk(planning_dir):
    for file in files:
        if file == "page.tsx":
            path = os.path.join(root, file)
            # form_key is the name of the folder
            form_key = os.path.basename(root)
            
            with open(path, "r", encoding="utf-8") as f:
                content = f.read()

            if "useAutoSaveForm" in content or "useFormStore" in content:
                print(f"Skipping {form_key} (already has state logic or is custom)")
                continue

            # Look for static _DATA variable like KSF_DATA, OBJ_DATA
            data_match = re.search(r"const\s+([A-Z_]+_DATA)\s*=\s*(.*?);[\r\n]+(?=export\s+default\s+function)", content, re.DOTALL)
            
            if data_match:
                static_var_name = data_match.group(1)
                static_data = data_match.group(2)
                
                # We will convert it to DEFAULT_DATA internally or just use the static var
                new_import = "import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';\n"
                
                # Insert import
                content = content.replace("import React", new_import + "import React")
                
                # Replace export default function
                func_match = re.search(r"export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\(\)\s*\{", content)
                if not func_match: continue
                func_name = func_match.group(1)
                
                new_func_def = f"export default function {func_name}() {{\n  const {{ localData, saveStatus }} = useAutoSaveForm('{form_key}', {{ items: {static_var_name} }});"
                content = content.replace(f"export default function {func_name}() {{", new_func_def)
                
                # Pass saveStatus to B2BPageTemplate
                content = content.replace("<B2BPageTemplate", "<B2BPageTemplate\n      saveStatus={saveStatus}")
                
                # Replace the data={} prop in PastelTable or elsewhere
                content = content.replace(f"data={{{static_var_name}}}", f"data={{localData.items}}")
                
                with open(path, "w", encoding="utf-8") as f:
                    f.write(content)
                print(f"Patched {form_key}")
            else:
                # Basic standard template without static data array
                print(f"Could not find standard data array in {form_key}, doing basic patch")
                
                new_import = "import { useAutoSaveForm } from '@/hooks/useAutoSaveForm';\n"
                
                # Insert import only if not exists
                if "useAutoSaveForm" not in content:
                    content = content.replace("import React", new_import + "import React")
                
                func_match = re.search(r"export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\(\)\s*\{", content)
                if func_match:
                    func_name = func_match.group(1)
                    new_func_def = f"export default function {func_name}() {{\n  const {{ localData, saveStatus }} = useAutoSaveForm('{form_key}', {{ }});"
                    content = content.replace(f"export default function {func_name}() {{", new_func_def)
                    content = content.replace("<B2BPageTemplate", "<B2BPageTemplate\n      saveStatus={saveStatus}")
                    
                    with open(path, "w", encoding="utf-8") as f:
                        f.write(content)
                    print(f"Basic Patched {form_key}")

print("Refactoring complete.")
