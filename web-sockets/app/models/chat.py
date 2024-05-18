from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from app.db import Base


class Chat(Base):
    __tablename__ = "Chat"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    name = Column(String)
