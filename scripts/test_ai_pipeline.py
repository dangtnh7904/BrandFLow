import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')
sys.stderr = io.TextIOWrapper(sys.stderr.buffer, encoding='utf-8', errors='replace')

"""
Test Script: AI Form Generation Pipeline
=========================================
Workflow:
  1. PDF → Extract Text (DocumentIngestor)
  2. Text → Gap Analysis (Gemini AI)
  3. Gaps → Hỏi User bổ sung
  4. Text + Answers → Generate 23 Forms (Gemini AI)
  5. Forms → Save to DB

Usage:
  python scripts/test_ai_pipeline.py "path/to/file.pdf"
"""

import sys
import os
import json

# Ensure project root is in path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
load_dotenv()

from app.services.document_processor import DocumentIngestor
from app.services.ai_form_generator import analyze_gaps, generate_all_forms, FORM_SCHEMAS, OVERVIEW_FORMS


def main():
    if len(sys.argv) < 2:
        print("❌ Usage: python scripts/test_ai_pipeline.py <path_to_pdf>")
        sys.exit(1)
    
    file_path = sys.argv[1]
    if not os.path.exists(file_path):
        print(f"❌ File không tồn tại: {file_path}")
        sys.exit(1)
    
    print("=" * 70)
    print("🚀 BRANDFLOW AI FORM GENERATION PIPELINE TEST")
    print("=" * 70)
    print(f"📄 Input: {file_path}")
    print()
    
    # ── Step 1: Extract Text ──
    print("━" * 70)
    print("📖 STEP 1: Trích xuất văn bản từ PDF")
    print("━" * 70)
    
    ingestor = DocumentIngestor()
    raw_text = ingestor.ingest_file(file_path)
    cleaned_text = ingestor.clean_text(raw_text)
    
    if not cleaned_text.strip():
        print("❌ Không trích xuất được text từ file. Kiểm tra định dạng PDF.")
        sys.exit(1)
    
    print(f"✅ Đã trích xuất {len(cleaned_text)} ký tự")
    print(f"📝 Preview (500 ký tự đầu):")
    print("-" * 40)
    print(cleaned_text[:500])
    print("-" * 40)
    print()
    
    # ── Step 2: Gap Analysis ──
    print("━" * 70)
    print("🔍 STEP 2: Phân tích Gap - So sánh với 4 Nhóm Dữ liệu")
    print("━" * 70)
    
    gap_result = analyze_gaps(cleaned_text)
    
    found_data = gap_result.get("found_data", {})
    missing_gaps = gap_result.get("missing_gaps", [])
    
    print(f"\n✅ DỮ LIỆU TÌM THẤY:")
    print(json.dumps(found_data, indent=2, ensure_ascii=False))
    
    print(f"\n⚠️  GAPS CẦN BỔ SUNG ({len(missing_gaps)} mục):")
    for i, gap in enumerate(missing_gaps, 1):
        priority_icon = "🔴" if gap.get("priority") == "critical" else "🟡"
        print(f"  {i}. {priority_icon} [{gap.get('priority', '?').upper()}] Nhóm {gap.get('group', '?')}: {gap.get('field', '?')}")
        print(f"     ❓ {gap.get('question', '?')}")
    print()
    
    # ── Step 3: Hỏi User bổ sung thông tin thiếu ──
    print("━" * 70)
    print("💬 STEP 3: Bổ sung thông tin thiếu từ người dùng")
    print("━" * 70)
    
    gap_answers = {}
    
    if missing_gaps:
        print("⚡ Hệ thống phát hiện một số dữ liệu quan trọng bị thiếu trong tài liệu.")
        print("   Vui lòng trả lời các câu hỏi dưới đây (nhấn Enter để bỏ qua):\n")
        
        for i, gap in enumerate(missing_gaps, 1):
            priority_icon = "🔴" if gap.get("priority") == "critical" else "🟡"
            field = gap.get("field", f"gap_{i}")
            question = gap.get("question", "?")
            
            print(f"  {priority_icon} Câu {i}/{len(missing_gaps)} [{gap.get('priority', '?').upper()}]:")
            answer = input(f"     {question}\n     → Trả lời: ").strip()
            
            if answer:
                gap_answers[field] = answer
            else:
                print("     (Bỏ qua)")
            print()
    else:
        print("✅ Tài liệu ĐẦY ĐỦ thông tin! Không cần hỏi thêm.")
    
    print(f"\n📋 Tổng kết: {len(gap_answers)}/{len(missing_gaps)} câu hỏi đã được trả lời.")
    print()
    
    # ── Step 4: Generate 23 Forms ──
    print("━" * 70)
    print("🤖 STEP 4: Sinh dữ liệu cho 23 Forms bằng Gemini AI")
    print("━" * 70)
    
    print("⏳ Đang gọi Gemini AI để sinh dữ liệu (có thể mất 20-40 giây)...")
    
    try:
        forms_data = generate_all_forms(cleaned_text, gap_answers)
    except Exception as e:
        print(f"❌ Lỗi khi sinh form data: {e}")
        sys.exit(1)
    
    print(f"\n✅ Đã sinh dữ liệu cho {len(forms_data)} forms:")
    
    all_expected_forms = list(FORM_SCHEMAS.keys())
    generated_forms = list(forms_data.keys())
    missing_forms = [f for f in all_expected_forms if f not in generated_forms]
    extra_forms = [f for f in generated_forms if f not in all_expected_forms]
    
    for form_key in sorted(generated_forms):
        schema = FORM_SCHEMAS.get(form_key, {})
        title = schema.get("title", "Unknown")
        data = forms_data[form_key]
        
        # Count data rows
        if isinstance(data, dict) and "items" in data:
            row_count = len(data["items"]) if isinstance(data["items"], list) else 0
            print(f"  ✅ {form_key:20s} | {title:35s} | {row_count} rows")
        elif isinstance(data, dict):
            field_count = len(data)
            print(f"  ✅ {form_key:20s} | {title:35s} | {field_count} fields")
        else:
            print(f"  ⚠️ {form_key:20s} | {title:35s} | Unexpected format")
    
    if missing_forms:
        print(f"\n⚠️  Forms THIẾU ({len(missing_forms)}):")
        for f in missing_forms:
            title = FORM_SCHEMAS.get(f, {}).get("title", "?")
            print(f"  ❌ {f} ({title})")
    
    if extra_forms:
        print(f"\n📝 Forms THÊM (ngoài schema): {extra_forms}")
    
    # ── Step 5: Preview & Summary ──
    print()
    print("━" * 70)
    print("📊 STEP 5: Xem trước dữ liệu chi tiết")
    print("━" * 70)
    
    # Show full JSON output
    output_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "pipeline_output.json")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump({
            "input_file": file_path,
            "text_length": len(cleaned_text),
            "gap_analysis": gap_result,
            "gap_answers": gap_answers,
            "forms_data": forms_data,
            "summary": {
                "total_expected": len(all_expected_forms),
                "total_generated": len(generated_forms),
                "missing_forms": missing_forms,
            }
        }, f, indent=2, ensure_ascii=False)
    
    print(f"💾 Full output saved to: {output_path}")
    
    # Show a sample form
    sample_key = "a1-mission" if "a1-mission" in forms_data else (generated_forms[0] if generated_forms else None)
    if sample_key:
        print(f"\n📋 Sample form [{sample_key}]:")
        print(json.dumps(forms_data[sample_key], indent=2, ensure_ascii=False))
    
    print()
    print("=" * 70)
    print(f"🎉 PIPELINE HOÀN TẤT!")
    print(f"   📄 Text: {len(cleaned_text)} chars")
    print(f"   🔍 Gaps: {len(missing_gaps)} detected, {len(gap_answers)} answered")
    print(f"   📊 Forms: {len(generated_forms)}/{len(all_expected_forms)} generated")
    print("=" * 70)


if __name__ == "__main__":
    main()
