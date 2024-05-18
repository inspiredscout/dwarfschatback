from typing import Optional, List
from uuid import UUID

from pydantic import BaseModel, ConfigDict
from datetime import datetime


class MessageCreate(BaseModel):
    byUserId: UUID
    content: str
    timestamp: datetime
    chatId: UUID
