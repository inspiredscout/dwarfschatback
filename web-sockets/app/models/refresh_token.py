from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from app.db import Base


class RefreshToken(Base):
    __tablename__ = "RefreshToken"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    UsersId = Column(UUID(as_uuid=True), ForeignKey('users.id'), unique=True)
    token = Column(String)
    expiresAt = Column(DateTime)
