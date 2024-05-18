from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from app.db import Base


class UserChat(Base):
    __tablename__ = "UserChat"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    userId = Column(UUID(as_uuid=True), ForeignKey('users.id'))
    chatId = Column(UUID(as_uuid=True), ForeignKey('chat.id'))
