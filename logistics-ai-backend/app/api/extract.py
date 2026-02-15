from fastapi import APIRouter
from app.services.extraction_pipeline import extract_data
from app.schemas.extraction_schema import ShipmentExtraction

router = APIRouter()


@router.post("/extract", response_model=ShipmentExtraction)
async def extract():
    data = extract_data()
    return ShipmentExtraction(**data)
