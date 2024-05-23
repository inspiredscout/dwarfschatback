import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PrismaClient } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [ChatService, PrismaClient, JwtService],
  controllers: [ChatController]
})
export class ChatModule {}
