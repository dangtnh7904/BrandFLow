import re

with open(r'd:\Project\BrandFlow\BrandFlow\frontend\src\components\workspace\phase1\Screen2_Wizard.tsx', 'r', encoding='utf-8') as f:
    text = f.read()

target = """  const handleGenerateForms = async () => {
    setIsGenerating(true);
    setErrorStatus(null);
    try {
      const fullText = typeof window !== 'undefined' ? localStorage.getItem('bf_doc_text') || "" : "";
      const res = await fetch(`${BACKEND_URL}/api/v1/planning/generate-forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_text: fullText,
          gap_answers: gapAnswers,
          project_id: useFormStore.getState().projectId || "default_project",
          user_id: typeof window !== 'undefined' ? localStorage.getItem('brandflow_user_id') || "default_user" : "default_user"
        })"""

replacement = """  const handleGenerateForms = async () => {
    setIsGenerating(true);
    setErrorStatus(null);
    try {
      if (!useFormStore.getState().projectId) {
         await useFormStore.getState().initializeProject();
      }
      const fullText = typeof window !== 'undefined' ? localStorage.getItem('bf_doc_text') || "" : "";
      
      const p_id = useFormStore.getState().projectId || "default_project";
      const u_id = typeof window !== 'undefined' ? localStorage.getItem('brandflow_user_id') || "default_user" : "default_user";

      const res = await fetch(`${BACKEND_URL}/api/v1/planning/generate-forms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          document_text: fullText,
          gap_answers: gapAnswers,
          project_id: p_id,
          user_id: u_id
        })"""

new_text = text.replace(target, replacement)
if text == new_text:
    print('Failed to replace Screen2.')
else:
    with open(r'd:\Project\BrandFlow\BrandFlow\frontend\src\components\workspace\phase1\Screen2_Wizard.tsx', 'w', encoding='utf-8') as f:
        f.write(new_text)
    print('Replaced successfully Screen2.')

with open(r'd:\Project\BrandFlow\BrandFlow\app\services\ai_form_generator.py', 'r', encoding='utf-8') as f:
    text_ai = f.read()

target_ai = """def _generate_batch(batch_name: str, form_keys: list, document_text: str, answers_text: str) -> Dict[str, Any]:
    \"\"\"Generate forms for a single batch group using multiple models on rate limit.\"\"\"
    fallback_models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "llama3-8b-8192", "mixtral-8x7b-32768"]"""

replacement_ai = """def _is_valid_form_data(form_key: str, data: Any) -> bool:
    \"\"\"Kiểm tra xem schema do AI sinh ra có đúng chuẩn không, nếu không đúng Drop/Fallback.\"\"\"
    if not isinstance(data, dict): return False
    if form_key == "a1-mission":
        for k in ["role", "business_def", "purpose", "competency", "directions"]:
            if k not in data: return False
        return True
    if "items" not in data or not isinstance(data["items"], list) or len(data["items"]) == 0:
        return False
    return True

def _generate_batch(batch_name: str, form_keys: list, document_text: str, answers_text: str) -> Dict[str, Any]:
    \"\"\"Generate forms for a single batch group using multiple models on rate limit.\"\"\"
    fallback_models = ["llama-3.3-70b-versatile", "llama-3.1-8b-instant", "llama3-8b-8192", "mixtral-8x7b-32768"]"""

new_text_ai = text_ai.replace(target_ai, replacement_ai)

target_ai2 = """            cleaned = _clean_json_response(raw_text)
            return json.loads(cleaned)
        except Exception as e:"""

replacement_ai2 = """            cleaned = _clean_json_response(raw_text)
            result_dict = json.loads(cleaned)
            valid_results = {}
            for k, v in result_dict.items():
                if _is_valid_form_data(k, v):
                    valid_results[k] = v
                else:
                    print(f"    [WARN] Batch invalid data schema for {k}")
            return valid_results
        except Exception as e:"""

new_text_ai = new_text_ai.replace(target_ai2, replacement_ai2)

target_ai3 = """            single_result = _generate_single_form(form_key, truncated, answers_text)
            if single_result:
                all_forms[form_key] = single_result
                print(f"    [OK] {form_key} thanh cong!")
            else:"""

replacement_ai3 = """            single_result = _generate_single_form(form_key, truncated, answers_text)
            if single_result and _is_valid_form_data(form_key, single_result):
                all_forms[form_key] = single_result
                print(f"    [OK] {form_key} thanh cong!")
            else:"""

new_text_ai = new_text_ai.replace(target_ai3, replacement_ai3)

if text_ai == new_text_ai:
    print('Failed to replace ai_form_generator.')
else:
    with open(r'd:\Project\BrandFlow\BrandFlow\app\services\ai_form_generator.py', 'w', encoding='utf-8') as f:
        f.write(new_text_ai)
    print('Replaced successfully ai_form_generator.')
