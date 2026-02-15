import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from app.core.vector_store import get_vector_store
from app.core.config import TOP_K, SIMILARITY_THRESHOLD

load_dotenv()

# 1. Initialize ChatGroq (Chat-optimized model)
llm = ChatGroq(
    model="llama-3.1-8b-instant",
    temperature=0.1,  # Low temperature for accuracy, but high enough for natural flow
    api_key=os.getenv("GROQ_API_KEY")
)

def ask_question(question: str):
    store = get_vector_store()
    if store is None:
        raise ValueError("No documents uploaded")

    # 2. Retrieve relevant chunks
    results = store.similarity_search_with_score(question, k=TOP_K)

    # Convert FAISS distance → similarity
    similarities = [1 / (1 + score) for _, score in results]
    best_similarity = max(similarities) if similarities else 0.0

    # 3. Handle "Not Found" cases
    if best_similarity < SIMILARITY_THRESHOLD:
        return {
            "answer": "I'm sorry, I couldn't find any information regarding that in the provided logistics documents.",
            "supporting_source_text": [],
            "confidence_score": 0.0
        }

    source_chunks = [doc.page_content for doc, _ in results]
    context = "\n---\n".join(source_chunks)

    # 4. Chat-Optimized Prompt
    prompt = ChatPromptTemplate.from_messages([
        ("system", (
            "You are a highly accurate Logistics Data Analyst. Your task is to answer questions based "
            "on provided shipping documents (Rate Confirmations, Invoices, BOLs, and Emails).\n\n"
            
            "CRITICAL INSTRUCTIONS:\n"
            "1. Multi-Document Awareness: One document may contain an Invoice on page 1 and a BOL on page 7. "
            "Search the entire context for the answer.\n"
            
            "2. Synonym Matching: Logistics terms vary. Look for these equivalents:\n"
            "   - Shipment ID: Load ID, PO#, Ref#, Booking#, Job ID.\n"
            "   - Shipper: Origin, Pickup, From, Loading point.\n"
            "   - Consignee: Destination, Receiver, Drop-off, Unloading point, To.\n"
            "   - Delivery Date: Drop Date, Arrival Date, Scheduled Unload, POD Date.\n"
            
            "3. Precision: If a date has a time associated with it (e.g., 01-23-2026 10:00), include the time.\n"
            
            "4. Fact-Check: If you find conflicting information, prioritize the 'Bill of Lading' (BOL) "
            "or 'Proof of Delivery' (POD) for actual dates/weights, and the 'Rate Confirmation' for pricing.\n"
            
            "5. If the information is truly missing, say: 'I'm sorry, that information is not specified in the document.'"
        )),
        ("user", "Context:\n{context}\n\nQuestion: {question}")
    ])

    # 5. Chain and Invoke
    chain = prompt | llm
    
    response = chain.invoke({
        "context": context,
        "question": question
    })
    
    answer_text = response.content

    # 6. Improved Confidence Scoring
    # Check if the model's answer is grounded in the retrieved text
    answer_in_context = any(word.lower() in context.lower() for word in answer_text.split()[:10])
    validation_bonus = 1.0 if answer_in_context else 0.5
    
    confidence = (
        (sum(similarities) / len(similarities)) * 0.7
        + validation_bonus * 0.3
    )

    return {
        "answer": answer_text,
        "supporting_source_text": source_chunks,
        "confidence_score": round(confidence, 2)
    }