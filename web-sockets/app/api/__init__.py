from fastapi import APIRouter
from app.api.v1 import chat

api_router = APIRouter()
api_router.include_router(chat.router, tags=["chat"])