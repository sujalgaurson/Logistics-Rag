import os
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings

embedding_model = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

FAISS_PATH = "data/faiss_index"

vector_store = None


def get_vector_store():
    global vector_store

    # Load from disk if exists
    if vector_store is None and os.path.exists(FAISS_PATH):
        vector_store = FAISS.load_local(
            FAISS_PATH,
            embedding_model,
            allow_dangerous_deserialization=True
        )

    return vector_store


def create_vector_store(docs):
    global vector_store

    vector_store = FAISS.from_documents(docs, embedding_model)

    # Save to disk
    os.makedirs("data", exist_ok=True)
    vector_store.save_local(FAISS_PATH)

    return vector_store
