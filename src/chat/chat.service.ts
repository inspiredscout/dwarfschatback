import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class ChatService {
    constructor (private db:PrismaClient){}

    async createChat(data: { name: string, userIds: string[] }){
        const { name, userIds } = data;
    
        // Проверка существования пользователей
        const users = await this.db.users.findMany({
          where: {
            id: { in: userIds }
          }
        });
    
        if (users.length !== userIds.length) {
          throw new Error('One or more users not found');
        }
    
        // Создание чата
        const chat = await this.db.chat.create({
          data: { name }
        });
    
        // Создание записей в UserChat
        await Promise.all(userIds.map(userId => 
          this.db.userChat.create({
            data: {
              chatId: chat.id,
              userId
            }
          })
        ));
    
        return chat;
      }
    
      async deleteChat(chatId: string){
        await this.db.chat.delete({
        where: {
            id: chatId
        }
        });
        return true;

      }
}
