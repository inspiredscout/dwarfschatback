from sqlalchemy import Column, String, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID
from app.db import Base


class Users(Base):
    __tablename__ = "Users"

    id = Column(UUID(as_uuid=True), primary_key=True, index=True)
    regDate = Column(DateTime, default=func.now())
    role = Column(String, default="user")
    username = Column(String, unique=True)
    status = Column(String)
    login = Column(String, unique=True)
    password = Column(String)
    pfpId = Column(String)
