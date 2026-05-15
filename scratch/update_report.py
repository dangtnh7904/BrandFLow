import re
import os

filepath = 'frontend/src/components/workspace/ExecutiveReport.tsx'
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update CAC/LTV mock data
old_marketing_goals = """      "marketing_goals": [
        "Giảm Customer Acquisition Cost (CAC) xuống dưới $200",
        "Tăng tỷ lệ LTV:CAC lên mức chuẩn 3:1"
      ]"""
new_marketing_goals = """      "marketing_goals": [
        "Giảm Customer Acquisition Cost (CAC) xuống dưới $200",
        "Tăng tỷ lệ LTV:CAC lên mức chuẩn 3:1"
      ],
      "cac_ltv_analysis": "Dựa trên AOV $1,200/năm, LTV dự kiến đạt $3,600 (với tỷ lệ churn 5%). Mục tiêu CAC tối đa $400 để duy trì tỷ lệ LTV/CAC > 8:1, đảm bảo dòng tiền an toàn."
    }"""
content = content.replace(old_marketing_goals, new_marketing_goals)

# 2. Update Data Sources mock data
old_value_prop = """        "value_proposition": "Thay vì nuôi team Marketing 5 người tốn $10k/tháng, BrandFlow cung cấp AI Agency tự động hóa với chi phí 10%, ra chiến lược trong 30 phút."
      }"""
new_value_prop = """        "value_proposition": "Thay vì nuôi team Marketing 5 người tốn $10k/tháng, BrandFlow cung cấp AI Agency tự động hóa với chi phí 10%, ra chiến lược trong 30 phút.",
        "data_sources": [
          "Báo cáo B2B SaaS Benchmark 2025 từ Forrester",
          "Dữ liệu khảo sát 500 CEO Tech Startup tại Đông Nam Á"
        ]
      }"""
content = content.replace(old_value_prop, new_value_prop)

# 3. Update Budget Allocation and Task Checklist mock data
old_tactics = """"p_name": "Product",
        "action_bullet": "Ra mắt Workspace với quy trình 5 bước AI tự động chốt ngân sách",
        "kpi": "20% user trial hoàn thành 1 bản kế hoạch",
        "budget_vnd": 50000000,
        "moscow_tag": "MUST_HAVE"
      },
      {
        "p_name": "Promotion",
        "action_bullet": "Tổ chức chuỗi Webinar B2B 'Growth Hacking cho SaaS'",
        "kpi": "Thu hút 500 MQLs, tỷ lệ chuyển SQL 10%",
        "budget_vnd": 30000000,
        "moscow_tag": "MUST_HAVE"
      },
      {
        "p_name": "Physical Evidence",
        "action_bullet": "Public Case Study chứng minh ROI từ startup đã dùng BrandFlow",
        "kpi": "Đạt 1,000 lượt tải whitepaper tháng 1",
        "budget_vnd": 10000000,
        "moscow_tag": "SHOULD_HAVE"
      },
      {
        "p_name": "Price",
        "action_bullet": "Gói Early Bird Lifetime Deal thu hồi vốn lưu động",
        "kpi": "Bán 100 gói $299 trong 2 tuần",
        "budget_vnd": 10000000,
        "moscow_tag": "COULD_HAVE"
      }
    ],
    "total_budget_used": 100000000
  },"""
new_tactics = """"p_name": "Product",
        "action_bullet": "Ra mắt Workspace với quy trình 5 bước AI tự động chốt ngân sách",
        "kpi": "20% user trial hoàn thành 1 bản kế hoạch",
        "budget_vnd": 50000000,
        "budget_allocation_percent": 50.0,
        "moscow_tag": "MUST_HAVE"
      },
      {
        "p_name": "Promotion",
        "action_bullet": "Tổ chức chuỗi Webinar B2B 'Growth Hacking cho SaaS'",
        "kpi": "Thu hút 500 MQLs, tỷ lệ chuyển SQL 10%",
        "budget_vnd": 30000000,
        "budget_allocation_percent": 30.0,
        "moscow_tag": "MUST_HAVE"
      },
      {
        "p_name": "Physical Evidence",
        "action_bullet": "Public Case Study chứng minh ROI từ startup đã dùng BrandFlow",
        "kpi": "Đạt 1,000 lượt tải whitepaper tháng 1",
        "budget_vnd": 10000000,
        "budget_allocation_percent": 10.0,
        "moscow_tag": "SHOULD_HAVE"
      },
      {
        "p_name": "Price",
        "action_bullet": "Gói Early Bird Lifetime Deal thu hồi vốn lưu động",
        "kpi": "Bán 100 gói $299 trong 2 tuần",
        "budget_vnd": 10000000,
        "budget_allocation_percent": 10.0,
        "moscow_tag": "COULD_HAVE"
      }
    ],
    "total_budget_used": 100000000,
    "task_ready_checklist": [
      "Lên outline và chốt Guest Speaker cho Webinar",
      "Thiết kế Landing Page B2B cho gói Early Bird",
      "Draft Case Study framework và phỏng vấn khách hàng",
      "Set up tracking MQL/SQL trên Hubspot"
    ]
  },"""
content = content.replace(old_tactics, new_tactics)

# 4. Update Render CAC/LTV
old_render_financial = """              <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1">
                {goal.objectives.financial_goals.map((g: string, i: number) => <li key={i}>{g}</li>)}
              </ul>
            </div>"""
new_render_financial = """              <ul className="list-disc pl-4 text-sm text-slate-700 space-y-1">
                {goal.objectives.financial_goals.map((g: string, i: number) => <li key={i}>{g}</li>)}
              </ul>
              {goal.objectives.cac_ltv_analysis && (
                <div className="text-xs bg-blue-100 text-blue-900 p-2 rounded mt-2 border border-blue-200">
                  <span className="font-bold block uppercase mb-1 text-[10px] tracking-wider">CAC/LTV Analysis</span>
                  {goal.objectives.cac_ltv_analysis}
                </div>
              )}
            </div>"""
content = content.replace(old_render_financial, new_render_financial)

# 5. Update Render Data Sources
old_render_sources = """                  <div className="bg-blue-50 text-blue-900 p-3 rounded border border-blue-100 text-sm">
                    <span className="font-bold">Value Proposition:</span> {seg.value_proposition}
                  </div>
                </div>"""
new_render_sources = """                  <div className="bg-blue-50 text-blue-900 p-3 rounded border border-blue-100 text-sm mb-3">
                    <span className="font-bold">Value Proposition:</span> {seg.value_proposition}
                  </div>
                  {seg.data_sources && seg.data_sources.length > 0 && (
                    <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded border border-slate-100">
                      <span className="font-bold uppercase mb-1 block">Nguồn dữ liệu (Source of Truth):</span>
                      <ul className="list-disc pl-3 mt-1">
                        {seg.data_sources.map((src: string, k: number) => <li key={k}>{src}</li>)}
                      </ul>
                    </div>
                  )}
                </div>"""
content = content.replace(old_render_sources, new_render_sources)

# 6. Update Render Tactics Table
old_table_headers = """                  <th className="py-2 px-2 font-black">Hành động cốt lõi</th>
                  <th className="py-2 px-2 font-black">KPI Cam kết</th>
                  <th className="py-2 px-2 font-black text-right">Ngân sách</th>
                </tr>"""
new_table_headers = """                  <th className="py-2 px-2 font-black">Hành động cốt lõi</th>
                  <th className="py-2 px-2 font-black">KPI Cam kết</th>
                  <th className="py-2 px-2 font-black text-right">Phân bổ (%)</th>
                  <th className="py-2 px-2 font-black text-right">Ngân sách</th>
                </tr>"""
content = content.replace(old_table_headers, new_table_headers)

old_table_row = """                    <td className="py-3 px-2 font-medium text-slate-800">{task.action_bullet}</td>
                    <td className="py-3 px-2 text-slate-600 italic text-xs">{task.kpi}</td>
                    <td className="py-3 px-2 text-right font-bold text-slate-900 whitespace-nowrap">
                      {new Intl.NumberFormat('vi-VN').format(task.budget_vnd)}
                    </td>"""
new_table_row = """                    <td className="py-3 px-2 font-medium text-slate-800">{task.action_bullet}</td>
                    <td className="py-3 px-2 text-slate-600 italic text-xs">{task.kpi}</td>
                    <td className="py-3 px-2 text-right font-bold text-blue-600 whitespace-nowrap bg-blue-50/50">
                      {task.budget_allocation_percent ? `${task.budget_allocation_percent}%` : '-'}
                    </td>
                    <td className="py-3 px-2 text-right font-bold text-slate-900 whitespace-nowrap">
                      {new Intl.NumberFormat('vi-VN').format(task.budget_vnd)}
                    </td>"""
content = content.replace(old_table_row, new_table_row)

# 7. Update Task Ready Checklist
old_checklist = """              </tbody>
            </table></div>
          </section>"""
new_checklist = """              </tbody>
            </table></div>

            {tactics.task_ready_checklist && tactics.task_ready_checklist.length > 0 && (
              <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                <h3 className="font-bold text-emerald-900 uppercase text-sm mb-3 flex items-center">
                  <CheckCircle2 className="w-5 h-5 mr-2" /> Task-Ready Checklist
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-emerald-800">
                  {tactics.task_ready_checklist.map((task: string, k: number) => (
                    <div key={k} className="flex items-start bg-white p-2 rounded border border-emerald-100 shadow-sm">
                      <div className="w-4 h-4 rounded border-2 border-emerald-400 bg-white mr-3 shrink-0 mt-0.5 flex items-center justify-center"></div>
                      <span className="font-medium leading-snug">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>"""
content = content.replace(old_checklist, new_checklist)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)

print("Update complete")
