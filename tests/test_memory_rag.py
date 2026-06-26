import pytest
from unittest.mock import patch, MagicMock
import sys
import importlib

from app.services.memory_rag import extract_and_save_rule, get_relevant_guidelines


class FakeEmbeddings:
    def __init__(self, size=128):
        self.size = size

    def embed_documents(self, texts):
        return [[0.1] * self.size for _ in texts]

    def embed_query(self, text):
        return [0.1] * self.size


@pytest.fixture
def in_memory_vectorstore():
    """
    Tạo ChromaDB collection tạm thời trong RAM (InMemory) bằng FakeEmbeddings.
    Đảm bảo test chạy cực nhanh và không phụ thuộc vào Ollama hay ổ cứng.
    
    Sử dụng chromadb trực tiếp (không qua langchain_chroma.Chroma) 
    để tránh bị test_api.py stub override.
    """
    import chromadb
    
    ephemeral_client = chromadb.EphemeralClient()
    fake_embeddings = FakeEmbeddings(size=128)
    
    # Import Chroma from the REAL langchain_chroma, bypassing any sys.modules stub
    # that test_api.py may have injected
    real_langchain_chroma = importlib.import_module("langchain_chroma")
    RealChroma = getattr(real_langchain_chroma, "_original_Chroma", None)
    if RealChroma is None:
        # If test_api.py hasn't overridden or the real class is directly available
        # we just use chromadb directly for the test store
        pass
    
    # Create the test store using the ephemeral client directly
    collection = ephemeral_client.get_or_create_collection(
        name="test_brandflow_memory"
    )
    
    # Build a mock vectorstore that behaves like Chroma for our test
    class TestVectorStore:
        def __init__(self, client, collection_obj, embeddings):
            self._client = client
            self._collection = collection_obj
            self._embeddings = embeddings
        
        def add_documents(self, documents):
            for doc in documents:
                embedding = self._embeddings.embed_query(doc.page_content)
                self._collection.add(
                    documents=[doc.page_content],
                    embeddings=[embedding],
                    metadatas=[doc.metadata] if doc.metadata else [{}],
                    ids=[f"doc_{self._collection.count()}"]
                )
        
        def similarity_search(self, query, k=3):
            embedding = self._embeddings.embed_query(query)
            results = self._collection.query(
                query_embeddings=[embedding],
                n_results=min(k, max(self._collection.count(), 1))
            )
            from langchain_core.documents import Document
            docs = []
            if results and results["documents"]:
                for doc_text in results["documents"][0]:
                    docs.append(Document(page_content=doc_text, metadata={}))
            return docs
    
    test_store = TestVectorStore(ephemeral_client, collection, fake_embeddings)

    # Patch hàm get_vectorstore để hệ thống dùng DB tạm thời này
    with patch("app.services.memory_rag.get_vectorstore", return_value=test_store):
        yield test_store


def test_extract_and_save_rule_then_retrieve(in_memory_vectorstore):
    """
    Kiểm tra ChromaDB Learner:
    1. Gọi extract_and_save_rule với nội dung giả lập.
    2. Gọi get_relevant_guidelines.
    3. Assert kết quả trả về có chứa từ khóa của quy tắc vừa lưu.
    """
    mock_chain_result = {
        "rule_summary": "KHÔNG ĐƯỢC CHẠY ADS QUÁ 50% NGÂN SÁCH.",
        "keywords": ["ads", "budget", "limit"],
    }

    with patch("app.services.memory_rag.ChatGoogleGenerativeAI") as MockLLM, \
         patch("app.services.memory_rag.learner_parser") as mock_parser, \
         patch("app.services.memory_rag.learner_prompt") as mock_prompt:

        mock_parser.get_format_instructions.return_value = ""

        mock_chain = MagicMock()
        mock_chain.invoke.return_value = mock_chain_result

        mock_llm_instance = MagicMock()
        MockLLM.return_value = mock_llm_instance

        mock_partial = MagicMock()
        mock_prompt.partial.return_value = mock_partial
        mock_intermediate = MagicMock()
        mock_partial.__or__ = MagicMock(return_value=mock_intermediate)
        mock_intermediate.__or__ = MagicMock(return_value=mock_chain)

        saved_rule = extract_and_save_rule(
            human_feedback="Feedback giả lập: Giảm tiền ads xuống.",
            rejected_plan="Plan giả lập bị dôi ngân sách ads.",
        )

    assert saved_rule == "KHÔNG ĐƯỢC CHẠY ADS QUÁ 50% NGÂN SÁCH."

    # Vector DB phải có 1 document (sử dụng _collection.count() trực tiếp)
    assert in_memory_vectorstore._collection.count() == 1

    # 3. Retrieve rule
    retrieved_text = get_relevant_guidelines("Lên plan cho chiến dịch có ads")
    assert "KHÔNG ĐƯỢC CHẠY ADS QUÁ 50% NGÂN SÁCH" in retrieved_text
