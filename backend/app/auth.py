from fastapi import Security, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth
from typing import Optional
import os

security = HTTPBearer()

ALLOWED_EMAILS = ["sumit749284@gmail.com"]

# For local development without Firebase credentials
LOCAL_DEV_MODE = os.getenv("LOCAL_DEV_MODE", "false").lower() == "true"

async def verify_token(res: HTTPAuthorizationCredentials = Security(security)):
    token = res.credentials
    
    # BYPASS: For local development without Firebase Admin credentials
    if LOCAL_DEV_MODE:
        print(f"⚠️  LOCAL_DEV_MODE enabled - bypassing token verification")
        # Return a mock decoded token for allowed email
        return {"email": ALLOWED_EMAILS[0], "uid": "local-dev-user"}
    
    try:
        decoded_token = auth.verify_id_token(token)
        email = decoded_token.get("email")
        if not email or email not in ALLOWED_EMAILS:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access Denied: You are not authorized."
            )
        return decoded_token
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid authentication credentials: {str(e)}"
        )
