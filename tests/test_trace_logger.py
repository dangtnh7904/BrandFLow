from trace_logger import TraceLogger


def test_trace_logger_creates_files(tmp_path):
    logger = TraceLogger(root_dir=tmp_path, goal="G", budget=100)
    run_dir = tmp_path / "trace" / logger.run_id

    logger.log(agent="planner", role="assistant", content="hello", step=1)

    assert (run_dir / "planner.json").exists()
    assert (run_dir / "customer.json").exists()
    assert (run_dir / "cfo.json").exists()


def test_trace_logger_appends_message(tmp_path):
    logger = TraceLogger(root_dir=tmp_path, goal="G", budget=100)
    logger.log(agent="planner", role="assistant", content="hello", step=1)
    logger.log(agent="planner", role="assistant", content="world", step=2)

    data = logger.read_file(agent="planner")
    assert len(data["messages"]) == 2
    assert data["messages"][0]["content"] == "hello"
    assert data["messages"][1]["content"] == "world"
