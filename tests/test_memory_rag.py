import pytest
from unittest.mock import patch
import chromadb
from langchain_chroma import Chroma
from langchain_core.embeddings import FakeEmbeddings
from langchain_core.messages import AIMessage

from memory_rag import extract_and_save_rule, get_relevant_guidelines

@pytest.fixture
def in_memory_vectorstore():
    """
    Tạo ChromaDB collection tạm thời trong RAM (InMemory) bằng FakeEmbeddings.
    Đảm bảo test chạy cực nhanh và không phụ thuộc vào Ollama hay ổ cứng.
    """
    ephemeral_client = chromadb.EphemeralClient()
    fake_embeddings = FakeEmbeddings(size=128)
    
    test_store = Chroma(
        client=ephemeral_client,
        collection_name="test_brandflow_memory",
        embedding_function=fake_embeddings
    )
    
    # Patch hàm get_vectorstore để hệ thống dùng DB tạm thời này
    with patch("memory_rag.get_vectorstore", return_value=test_store):
        yield test_store

@patch("memory_rag.ChatOllama.invoke")
def test_extract_and_save_rule_then_retrieve(mock_llm_invoke, in_memory_vectorstore):
    """
    Kiểm tra ChromaDB Learner: 
    1. Gọi extract_and_save_rule với nội dung giả lập.
    2. Gọi get_relevant_guidelines.
    3. Assert kết quả trả về có chứa từ khóa của quy tắc vừa lưu.
    """
    # 1. Mock LLM output cho Learner Agent
    mock_llm_invoke.return_value = AIMessage(
        content='{"rule_summary": "KHÔNG ĐƯỢC CHẠY ADS QUÁ 50% NGÂN SÁCH.", "keywords": ["ads", "budget", "limit"]}'
    )
    
    # 2. Extract và lưu rule
    saved_rule = extract_and_save_rule(
        human_feedback="Feedback giả lập: Giảm tiền ads xuống.",
        rejected_plan="Plan giả lập bị dôi ngân sách ads."
    )
    
    assert saved_rule == "KHÔNG ĐƯỢC CHẠY ADS QUÁ 50% NGÂN SÁCH."
    
    # Vector DB phải có 1 document
    assert in_memory_vectorstore._collection.count() == 1
    
    # 3. Retrieve rule
    # Sử dụng query bất kỳ, vì FakeEmbeddings sẽ tạo random vectors,
    # nhưng vì chỉ có 1 doc trong DB nên chắc chắn sẽ trả về doc đó bằng KNN lookup mặc định.
    retrieved_text = get_relevant_guidelines("Lên plan cho chiến dịch có ads")
    
    assert "KHÔNG ĐƯỢC CHẠY ADS QUÁ 50% NGÂN SÁCH" in retrieved_text
