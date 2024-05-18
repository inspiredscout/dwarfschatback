from async_fastapi_jwt_auth import AuthJWT

from app.core.config import settings
from app.core.logger import logger
from app.factory import create_app
from fastapi import FastAPI, HTTPException
from async_fastapi_jwt_auth.exceptions import MissingTokenError, AuthJWTException, JWTDecodeError
from starlette.responses import JSONResponse

app = create_app()

if __name__ == "__main__":
    import uvicorn

    logger.info("Starting uvicorn in reload mode")
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        reload=True,
        port=int("8001"),
    )
