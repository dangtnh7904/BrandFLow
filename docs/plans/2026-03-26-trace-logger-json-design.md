# Trace Logger JSON Output - Design (2026-03-26)

## Summary
Add a TraceLogger to record full-trace agent messages to JSON files. Each run creates a folder under `outputs/trace/<run_id>/` and writes three files: `planner.json`, `customer.json`, and `cfo.json`. Each file contains `meta` plus an ordered `messages[]` array of plain-text outputs.

## Goals
- Persist full trace messages for each agent
- Keep output format simple for later frontend integration
- Avoid impacting workflow execution if logging fails

## Non-Goals
- No SSE/WebSocket streaming in this phase
- No UI changes

## Architecture
- Introduce a `TraceLogger` utility in workflow layer
- `TraceLogger` generates `run_id`, creates output folder, and appends messages
- Nodes call `TraceLogger.log(agent, role, content, step, timestamp)` after completion

## File Structure
- `outputs/trace/<run_id>/planner.json`
- `outputs/trace/<run_id>/customer.json`
- `outputs/trace/<run_id>/cfo.json`

## JSON Format
Each file is an object with `meta` and `messages`:

```json
{
  "meta": {
    "run_id": "<uuid>",
    "agent": "planner",
    "goal": "<goal>",
    "budget": 20000000,
    "created_at": "2026-03-26T00:00:00+07:00"
  },
  "messages": [
    {
      "run_id": "<uuid>",
      "agent": "planner",
      "role": "assistant",
      "content": "<plain text summary>",
      "timestamp": "2026-03-26T00:00:01+07:00",
      "step": 1
    }
  ]
}
```

## Data Flow
1. Start run -> create `run_id` + output folder
2. Planner completes -> append message to `planner.json`
3. Customer completes -> append message to `customer.json`
4. CFO completes -> append message to `cfo.json`
5. Messages are appended in order of execution

## Error Handling
- If write fails, log warning and continue workflow
- If file missing, create with `meta` and empty `messages`
- Optional truncation of message content can be added later

## Testing
- Unit test TraceLogger:
  - Creates folder + files
  - Appends message correctly
- Workflow test:
  - Run one loop -> verify three files have messages

## Open Questions
- None for this phase
