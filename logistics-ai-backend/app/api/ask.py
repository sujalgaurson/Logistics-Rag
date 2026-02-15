from fastapi import APIRouter
from app.services.rag_pipeline import ask_question
from app.schemas.extraction_schema import QueryResponse

router = APIRouter()


@router.post("/ask", response_model=QueryResponse)
async def ask(payload: dict):
    question = payload.get("question")

    if not question:
        return {
            "answer": "Question required",
            "supporting_source_text": [],
            "confidence_score": 0.0,
        }

    return ask_question(question)
