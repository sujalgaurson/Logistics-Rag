from pydantic import BaseModel, Field
from typing import Optional, List


# 1. Model for Structured Shipment Extraction
class ShipmentExtraction(BaseModel):
    shipment_id: Optional[str] = Field(None, description="Unique identifier for the shipment")
    shipper: Optional[str] = Field(None, description="Entity sending the goods")
    consignee: Optional[str] = Field(None, description="Entity receiving the goods")
    pickup_datetime: Optional[str] = Field(None, description="Scheduled date and time for pickup")
    delivery_datetime: Optional[str] = Field(None, description="Scheduled date and time for delivery")
    equipment_type: Optional[str] = Field(None, description="Type of vehicle/container (e.g., Van, Reefer)")
    mode: Optional[str] = Field(None, description="Transportation mode (e.g., FTL, LTL)")
    rate: Optional[float] = Field(None, description="The monetary cost or carrier rate")
    currency: Optional[str] = Field(None, description="Currency code (e.g., USD, CAD)")
    weight: Optional[str] = Field(None, description="Weight of the shipment with units")
    carrier_name: Optional[str] = Field(None, description="Name of the transport company")


# 2. Model for the Q&A Response
class QueryResponse(BaseModel):
    answer: str = Field(..., description="The grounded answer from the document")
    supporting_source_text: List[str] = Field(
        ..., description="The specific chunks used for the answer"
    )
    confidence_score: float = Field(
        ..., description="Score between 0.0 and 1.0"
    )
