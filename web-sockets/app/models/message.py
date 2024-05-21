from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from app.db import Base

from .users import Users


class Message(Base):
    __tablename__ = "Message"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    byUserId = Column(UUID(as_uuid=True), ForeignKey('Users.id'))
    content = Column(String)
    timestamp = Column(DateTime, default=func.now())
    chatId = Column(UUID(as_uuid=True), ForeignKey('Chat.id'))
