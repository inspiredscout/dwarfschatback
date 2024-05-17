import { Body, Controller, Delete, Post, Query } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiTags } from '@nestjs/swagger';
import { chatDTO } from 'src/models/chat.model';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post()
    async createChat(
        @Body() data: chatDTO
    ){
        return this.chatService.createChat(data);
    }

    @Delete()
    async deleteChat(@Query('id') chatId: string){
        return this.chatService.deleteChat(chatId);
    }
}
