
import os
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import google.generativeai as genai
from pinecone import Pinecone
from dotenv import load_dotenv

router = APIRouter()

# Load env variables explicitly if needed, typically main.py does this
# but for safety in this module:
API_KEY = os.getenv("GEMINI_API_KEY")
PINECONE_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = "portfolio-rag"

if API_KEY:
    genai.configure(api_key=API_KEY)

pc = Pinecone(api_key=PINECONE_KEY) if PINECONE_KEY else None

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[Message] = []

def get_embedding(text: str):
    try:
        # 'retrieval_query' optimizes for query side
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_query"
        )
        return result['embedding']
    except Exception as e:
        print(f"Embedding error: {e}")
        return None

def generate_stream(prompt: str):
    model = genai.GenerativeModel('gemini-flash-latest')
    response = model.generate_content(prompt, stream=True)
    for chunk in response:
        if chunk.text:
            yield chunk.text

# In-memory rate limiter: {ip: [timestamp1, timestamp2]}
RATE_LIMITS = {}
RATE_LIMIT_DURATION = 60 # seconds
RATE_LIMIT_MAX_REQUESTS = 10 

def check_rate_limit(request: Request):
    client_ip = request.client.host
    now = __import__("time").time()
    
    # Initialize info
    if client_ip not in RATE_LIMITS:
        RATE_LIMITS[client_ip] = []
    
    # Clean up old timestamps
    RATE_LIMITS[client_ip] = [t for t in RATE_LIMITS[client_ip] if now - t < RATE_LIMIT_DURATION]
    
    # Check limit
    if len(RATE_LIMITS[client_ip]) >= RATE_LIMIT_MAX_REQUESTS:
        raise HTTPException(status_code=429, detail="Rate limit exceeded. Try again later.")
    
    # Record request
    RATE_LIMITS[client_ip].append(now)

@router.post("/chat")
async def chat_endpoint(request: ChatRequest, req: Request):
    # 0. Check Rate Limit
    check_rate_limit(req)

    if not API_KEY or not PINECONE_KEY:
        raise HTTPException(status_code=500, detail="AI Services not configured")

    user_query = request.message
    
    # 1. Embed Query
    query_vector = get_embedding(user_query)
    if not query_vector:
        raise HTTPException(status_code=500, detail="Failed to embed query")

    # 2. Retrieve Context
    index = pc.Index(INDEX_NAME)
    results = index.query(
        vector=query_vector,
        top_k=4,
        include_metadata=True
    )

    # 3. Construct Context String & Check Relevance
    context_parts = []
    has_relevant_context = False
    
    for match in results.matches:
        if match.score > 0.35: # Lowered threshold for better recall
            has_relevant_context = True
            meta = match.metadata
            text = meta.get("text", "")
            context_parts.append(f"---\n{text}\n---")
    
    # Guardrail: If query seems totally irrelevant (no matches > 0.45),
    # handle it gracefully without wasting LLM generation if possible,
    # OR provide a very strict prompt.
    # However, conversational filler ("Hi", "Thanks") might have low scores.
    # Strategy: If query is short (< 10 chars) allow it (greetings).
    # If query is long but no context, default to strict fallback.
    
    context_str = "\n".join(context_parts)

    # 4. Construct History String
    history_str = ""
    if request.history:
        # Limit history to lookback of last 6 messages to save context window
        recent_history = request.history[-6:] 
        history_str = "\n".join([f"{msg.role.upper()}: {msg.content}" for msg in recent_history])
    
    # 5. System Prompt
    system_prompt = f"""
    You are 'AI Sumit', a virtual assistant for Sumit Kumar's portfolio.
    Your goal is to answer questions about Sumit's skills, projects, experience, and background based on the provided context.
    
    Rules:
    - If the user asks about something NOT in the context (like "Who is Messi?" or "Write me code"), politely refuse and say you can only discuss Sumit's work.
    - If the answer is in the context, answer clearly and professionally.
    - Be concise. Keep answers under 4-5 sentences unless asked for details.
    - Use a friendly, professional tone.
    - Use Markdown for emphasis (bold, lists) where appropriate.
    
    Context:
    {context_str}

    Conversation History:
    {history_str}
    
    User Question: {user_query}
    
    Answer:
    """

    # 6. Generate Response (Streaming)
    return StreamingResponse(generate_stream(system_prompt), media_type="text/plain")
