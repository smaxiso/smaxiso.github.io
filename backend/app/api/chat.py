
import os
from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import google.generativeai as genai
from pinecone import Pinecone
from dotenv import load_dotenv

router = APIRouter()

# Load environment variables
load_dotenv()

INDEX_NAME = "portfolio-index"

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: list[Message] = []

def get_intent(query: str):
    """
    Uses a tiny, fast prompt to detect the user's intent category.
    Returns: 'project', 'blog', 'skills', 'resume', or None (general).
    """
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key: return None
        
        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-flash-latest')
        
        prompt = f"""
        Analyze this user question and classify it into ONE of these categories: 
        'project', 'blog', 'skills', 'resume'. If it doesn't fit or is general, return 'general'.
        
        Question: "{query}"
        
        Category:"""
        
        response = model.generate_content(prompt)
        intent = response.text.strip().lower()
        
        if 'project' in intent: return 'project'
        if 'blog' in intent: return 'blog'
        if 'skill' in intent: return 'skills'
        if 'resume' in intent: return 'resume'
        return None
    except Exception as e:
        print(f"⚠️ Intent detection error: {e}")
        return None

def get_embedding(text: str):
    """Generates a 768-dimensional embedding using Gemini."""
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key: return None
        genai.configure(api_key=api_key)
        
        result = genai.embed_content(
            model="models/text-embedding-004",
            content=text,
            task_type="retrieval_query"
        )
        return result.get('embedding')
    except Exception as e:
        print(f"❌ Embedding error: {e}")
        return None

def generate_stream(prompt: str):
    """Streams the response from Gemini."""
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            yield "Error: Gemini API key not configured."
            return

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-flash-latest')
        response = model.generate_content(prompt, stream=True)
        for chunk in response:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        print(f"❌ Stream generation error: {e}")
        yield f"Sorry, I encountered an error during generation: {str(e)}"

# In-memory rate limiter
RATE_LIMITS = {}
RATE_LIMIT_DURATION = 60 
RATE_LIMIT_MAX_REQUESTS = 15 

def check_rate_limit(request: Request):
    client_ip = request.client.host if request.client else "unknown"
    now = __import__("time").time()
    if client_ip not in RATE_LIMITS: RATE_LIMITS[client_ip] = []
    RATE_LIMITS[client_ip] = [t for t in RATE_LIMITS[client_ip] if now - t < RATE_LIMIT_DURATION]
    if len(RATE_LIMITS[client_ip]) >= RATE_LIMIT_MAX_REQUESTS:
        raise HTTPException(status_code=429, detail="Rate limit exceeded.")
    RATE_LIMITS[client_ip].append(now)

@router.post("/chat")
async def chat_endpoint(request: ChatRequest, req: Request):
    try:
        check_rate_limit(req)
        user_query = request.message
        context_str = ""
        
        # 1. Detect Intent for Filtering
        intent = get_intent(user_query)
        if intent:
            print(f"🎯 Detected Intent: {intent}")

        # 2. Attempt Context Retrieval (RAG)
        pinecone_key = os.getenv("PINECONE_API_KEY")
        if pinecone_key:
            try:
                pc = Pinecone(api_key=pinecone_key)
                query_vector = get_embedding(user_query)
                
                if query_vector:
                    index = pc.Index(INDEX_NAME)
                    
                    # Apply metadata filter if intent was detected
                    filter_obj = {"type": {"$eq": intent}} if intent else None
                    
                    results = index.query(
                        vector=query_vector,
                        top_k=5, # Slightly more for better coverage
                        include_metadata=True,
                        filter=filter_obj
                    )
                    
                    context_parts = []
                    for match in results.matches:
                        # 0.35 threshold is safer for Gemini 004
                        if match.score > 0.35:
                            meta = match.metadata
                            text = meta.get("text", "")
                            context_parts.append(f"---\n{text}\n---")
                    
                    context_str = "\n".join(context_parts)
                    if context_str:
                        print(f"🧠 Retrieved {len(context_parts)} context chunks (Filter: {intent if intent else 'None'})")
            except Exception as pine_err:
                print(f"⚠️ Pinecone error: {pine_err}")
        
        # 3. History String
        history_str = ""
        if request.history:
            recent_history = request.history[-6:] 
            history_str = "\n".join([f"{msg.role.upper()}: {msg.content}" for msg in recent_history])
        
        # 4. Final Prompt
        system_prompt = f"""
        You are 'AI Sumit', a virtual assistant for Sumit Kumar's portfolio.
        Your goal is to answer questions about Sumit's skills, projects, and background.
        
        Rules:
        - If the user asks something irrelevant, politely steer back to Sumit's work.
        - Use the context provided below. If no context is found, use your general knowledge to be helpful but mention that you don't have specific details on that yet.
        - Be concise, professional, and friendly. Use Markdown.
        
        Sumit's Context:
        {context_str if context_str else "No specific data found in Knowledge Base."}

        Conversation History:
        {history_str}
        
        User Question: {user_query}
        
        Answer:
        """

        return StreamingResponse(generate_stream(system_prompt), media_type="text/plain")

    except Exception as e:
        print(f"🔥 Critical Chat Error: {e}")
        def error_fallback():
            yield "I'm having a little trouble connecting to my brain right now. Please try again in a moment."
        return StreamingResponse(error_fallback(), media_type="text/plain")
