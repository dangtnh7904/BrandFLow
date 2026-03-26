# Final Output Files - Design (2026-03-26)

## Summary
Write a separate, easy-to-read final output after each workflow run. The final output includes the approved (or last) master plan plus run status and scores. Two files will be written for each run: `final-<run_id>.json` and `final-<run_id>.txt` under `outputs/final/`.

## Goals
- Provide a clean, human-readable final summary (`.txt`)
- Provide a complete machine-readable final payload (`.json`)
- Keep output location consistent and easy to scan
- Preserve history by naming files with `run_id`

## Non-Goals
- No UI integration in this phase
- No streaming or live updates
- No changes to trace JSON format

## Decision
**Approach chosen:** single folder `outputs/final/` with file names containing `run_id`.
- `final-<run_id>.json`
- `final-<run_id>.txt`

## Data Included
### final.json
- `meta`: run_id, goal, budget, approved, rounds, customer_rounds, timestamp
- `plan`: full master plan (as JSON)
- `scores`: rule_score, client_self_score, final_score
- `customer_feedback`
- `cfo_decision` (if any)

### final.txt
Human-readable summary:
- Goal, Budget, Approved
- Total cost, rounds
- Phases and activities (name, cost, priority, KPI)
- Key customer/CFO feedback

## Flow
1. Workflow finishes and returns `final_state`
2. Create `outputs/final/` if missing
3. Write `final-<run_id>.json`
4. Write `final-<run_id>.txt`

## Error Handling
- If file write fails, log warning and continue workflow
- If plan missing, write summary with placeholders

## Testing
- Unit test for writer utility (optional)
- Workflow test: run once, verify both final files exist and contain expected keys
