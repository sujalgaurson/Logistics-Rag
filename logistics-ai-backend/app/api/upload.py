from fastapi import APIRouter, UploadFile, File
from app.services.document_loader import load_document
from app.services.chunking import chunk_documents
from app.core.vector_store import create_vector_store

router = APIRouter()


@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    docs = load_document(file)
    chunks = chunk_documents(docs)
    create_vector_store(chunks)

    return {"status": "Document uploaded successfully", "chunks": len(chunks)}
