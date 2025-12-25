from fastapi import Security, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth
from typing import Optional

security = HTTPBearer()

ALLOWED_EMAILS = ["sumit749284@gmail.com"]

async def verify_token(res: HTTPAuthorizationCredentials = Security(security)):
    token = res.credentials
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
