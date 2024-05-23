import { BadRequestException, Body, Controller, Delete, Get, Post, Put, Query, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ApiBearerAuth, ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { chatDTO, chatId, fullChatDTO, superFullChatDTO, users } from 'src/models/chat.model';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post()
    @ApiOkResponse({type:[fullChatDTO], description: 'Созданный чат'})
    @ApiOperation({summary: 'Создание чата'})
    @ApiBearerAuth()
    async createChat(@Body() data: chatDTO, @Req() req){
        if (!req.headers.authorization) {throw new BadRequestException('Токен авторизации отсутсвтует')}
        const token = req.headers.authorization.split(' ')[1];
        return this.chatService.createChat(data, token);
    }

    @Delete()
    @ApiOkResponse({ description: 'Returns true if successful', schema: { type: 'boolean' } })
    @ApiOperation({summary: 'Удаления чата'})
    @ApiBearerAuth()
    async deleteChat(@Query('id') chatId: string, @Req() req){
        if (!req.headers.authorization) {throw new BadRequestException('Токен авторизации отсутсвтует')}
        const token = req.headers.authorization.split(' ')[1];
        return this.chatService.deleteChat(chatId, token);
    }

    @Get()
    @ApiOkResponse({type: [superFullChatDTO], description: 'Информация о чатах'})
    @ApiOperation({summary: 'Получение информации о чате'})
    @ApiBearerAuth()
    async getChat(@Query('id') chatId: string, @Req() req){
        if (!req.headers.authorization) {throw new BadRequestException('Токен авторизации отсутсвтует')}
        const token = req.headers.authorization.split(' ')[1];
        return this.chatService.getChat(chatId, token);
    }

    @Put('users')
    @ApiBearerAuth()
    @ApiOperation({summary: 'Добавление новых юзеров в чат'})
    @ApiOkResponse({ description: 'Returns true if successful', schema: { type: 'boolean' } })
    async updChatUsers(@Body() data: users, @Req() req){
        if (!req.headers.authorization) {throw new BadRequestException('Токен авторизации отсутсвтует')}
        const token = req.headers.authorization.split(' ')[1];
        return this.chatService.updateUsersInChat(data, token);
        
    }

    @Put('quit')
    @ApiBearerAuth()
    @ApiOperation({summary: 'Выход юзера из чата'})
    @ApiOkResponse({ description: 'Returns true if successful', schema: { type: 'boolean' } })
    async quitChat(@Query('chatId') chatId: string, @Req() req){
        if (!req.headers.authorization) {throw new BadRequestException('Токен авторизации отсутсвтует')}
        const token = req.headers.authorization.split(' ')[1];
        return this.chatService.chatQuit(chatId, token);
    }
}
