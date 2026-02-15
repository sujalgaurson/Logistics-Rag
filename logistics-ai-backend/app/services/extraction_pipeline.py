import os
import json
from typing import Dict, Any
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from app.core.vector_store import get_vector_store
from app.schemas.extraction_schema import ShipmentExtraction

# Load environment variables (ensure GROQ_API_KEY is in your .env)
load_dotenv()

# Initialize ChatGroq with a model that supports high-speed extraction
# Llama-3.1-8b-instant is excellent for structured tasks
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0,  # Temperature 0 is critical for data extraction accuracy
    api_key=os.getenv("GROQ_API_KEY")
)

def extract_data() -> Dict[str, Any]:
    store = get_vector_store()
    if store is None:
        raise ValueError("No documents uploaded")

    # 1. Retrieve relevant chunks from your Vector Store
    # We search for keywords present in your uploaded files like "LD62752" or "MAQ TRANS"
    docs = store.similarity_search(
        "shipment details load ID rate confirmation carrier shipper consignee weight equipment",
        k=6
    )
    context = "\n---\n".join([d.page_content for d in docs])

    # 2. Optimized Prompt for Logistics Documents
    # Designed based on your Carrier RC, Bill of Lading, and Invoice samples
    prompt = ChatPromptTemplate.from_messages([
        ("system", (
            "You are a logistics data extraction specialist. "
            "Your goal is to extract shipment details into a valid JSON object. "
            "Follow these rules strictly:\n"
            "1. Use 'null' if a field is not found.\n"
            "2. Ensure currency is an ISO code (e.g., USD).\n"
            "3. Extract the 'rate' as a raw number without symbols.\n"
            "4. For 'mode', identify if it is FTL (Full Truckload) or LTL.\n"
            "5. The output must be ONLY a JSON object, no conversational filler."
        )),
        ("user", (
            "Context from documents:\n{context}\n\n"
            "Extract the following fields based on the ShipmentExtraction schema:\n"
            "- shipment_id (Look for 'Load ID', 'PO/LOAD #', or 'Reference ID')\n"
            "- shipper (Origin company)\n"
            "- consignee (Destination company)\n"
            "- pickup_datetime\n"
            "- delivery_datetime\n"
            "- equipment_type (e.g., Van, Straight Box Truck, Reefer)\n"
            "- mode (FTL/LTL)\n"
            "- rate (Total agreed amount)\n"
            "- currency (Default to USD if '$' is used)\n"
            "- weight (Include units, e.g., '40000 lbs')\n"
            "- carrier_name\n\n"
            "Resulting JSON:"
        ))
    ])

    # 3. Chain and Invoke
    chain = prompt | llm
    
    try:
        response = chain.invoke({"context": context})
        raw_content = response.content

        # Basic cleanup in case model adds markdown blocks
        if "```json" in raw_content:
            raw_content = raw_content.split("```json")[1].split("```")[0].strip()
        elif "```" in raw_content:
            raw_content = raw_content.split("```")[1].strip()

        parsed_data = json.loads(raw_content)

        # 4. Validation using your Pydantic Schema
        validated = ShipmentExtraction(**parsed_data)
        return validated.model_dump()

    except Exception as e:
        print(f"Extraction or Validation failed: {e}")
        # Return empty schema as fallback
        return ShipmentExtraction().model_dump()