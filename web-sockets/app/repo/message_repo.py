from typing import List
from uuid import UUID, uuid4

from sqlalchemy import select
from datetime import datetime

from app.models import Users
from app.models.message import Message
from app.repo.repo import SQLAlchemyRepo


class MessageRepo(SQLAlchemyRepo):
    async def save_message(self, user_id: UUID, content: str, chat_id: UUID):
        new_message = Message(
            id=uuid4(),
            byUserId=user_id,
            content=content,
            timestamp=datetime.now(),
            chatId=chat_id
        )
        self.session.add(new_message)
        await self.session.commit()

    async def check_con(self):
        stmt = select(Users)
        result = await self.session.execute(stmt)
        users = result.scalars().all()
        if users:
            return True
        else:
            return False
