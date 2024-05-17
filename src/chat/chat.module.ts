import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  providers: [ChatService, PrismaClient],
  controllers: [ChatController]
})
export class ChatModule {}
