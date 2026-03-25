# Customer Agent Feedback Loop - Design (2026-03-25)

## Summary
Add a "CustomerReviewer" agent that provides feedback and satisfaction scoring on marketing plans. The customer review happens in a loop with the CFO until a satisfaction threshold is met or a maximum number of feedback rounds is reached. Scoring uses a deterministic Python rule score plus an LLM self-score.

## Goals
- Add a customer feedback agent with scoring and actionable feedback
- Allow customer review loops with a configurable stop condition
- Keep budget enforcement authoritative (never exceed budget)
- Make scoring transparent and tunable with weights

## Non-Goals
- No new UI changes in this phase
- No new external services or cloud dependencies

## Architecture
- New **CustomerReviewer** node in the LangGraph workflow
- Loop order:
  1. Planner produces a plan
  2. CustomerReviewer scores + feedback
  3. CFO checks budget (cuts if needed)
  4. CustomerReviewer re-scores
  5. Repeat until satisfied or max rounds

## Components
### CustomerReviewer Agent
- Inputs: plan, brand guidelines (RAG), target audience, budget summary
- Outputs:
  - `client_self_score` (1-100)
  - `feedback` (list of required changes)
  - `reasoning_summary` (short)

### Rule Score Calculator (Python)
- Function: `calculate_customer_rule_score(plan, criteria_weights)`
- Default criteria (weights sum to 100):
  - KPI/Activity clarity: 35
  - Feasibility & budget fit: 25
  - Strategic coherence: 20
  - Target audience fit: 10
  - Brand DNA fit: 10

### Final Score Formula
- `final_score = 0.7 * rule_score + 0.3 * client_self_score`
- Weight ratio is configurable

### Config
- `customer_review.max_rounds`
- `customer_review.satisfaction_threshold`
- `customer_review.score_weights`
- `customer_review.criteria_weights`

## Data Flow
1. Planner generates plan
2. CustomerReviewer receives plan + guidelines + budget
3. Python calculates `rule_score`
4. LLM generates `client_self_score` + feedback
5. Combine into `final_score`
6. If `final_score >= threshold` -> approve
7. Else -> CFO review -> return to CustomerReviewer

## Stop Conditions
- Stop if `final_score >= satisfaction_threshold`
- Stop if `round >= max_rounds` and set `needs_human_intervention = true`

## Error Handling
- LLM output parse failure:
  - `client_self_score = 50`
  - empty feedback
  - log warning
- Rule score cannot be computed (missing fields):
  - `rule_score = 50`
  - `incomplete_plan = true` to force feedback
- CFO vs Customer conflict:
  - budget cap is authoritative
  - customer feedback focuses on trimming, not adding costs

## Testing
- Unit tests:
  - rule score calculation with full fields
  - fallback when fields missing
- Workflow tests:
  - satisfied on first round
  - multiple rounds, success before max
  - hits max -> `needs_human_intervention = true`
- Parsing tests:
  - valid LLM output
  - invalid output -> fallback

## Open Questions
- None for this phase (criteria weights can be tuned later)
