import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { generateKeyPairSync } from 'crypto';
import { users } from 'src/models/chat.model';

@Injectable()
export class ChatService {
    constructor (private db:PrismaClient, private jwtService:JwtService){}

    async createChat(data: { name: string, userIds: string[]}, token){
      try {
        await this.jwtService.verifyAsync(token, { secret: process.env.SECRET })
      } catch (err) {throw new ForbiddenException('Некорретный токен')}
        const { name, userIds } = data;
        const decoded = await this.jwtService.verifyAsync(token, { secret: process.env.SECRET })
        if (!userIds.find(item => item === decoded.id)){throw new BadRequestException('Нельзя создать чат в котором не будет участовать создатель')}

        const users = await this.db.users.findMany({
          where: {
            id: { in: userIds }
          }
        });
    
        if (users.length !== userIds.length) {
          throw new Error('One or more users not found');
        }
    
        const RSA = await this.createRSA()
        const chat = await this.db.chat.create({
          data: { 
            name: name,
            PubKey:  RSA.publicKey,
            PrivKey: RSA.privateKey
           }
        });

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
    
      async deleteChat(chatId: string, token){
        try {
          await this.jwtService.verifyAsync(token, { secret: process.env.SECRET })
        } catch (err) {throw new ForbiddenException('Некорретный токен')}
        const decoded = await this.jwtService.verifyAsync(token, { secret: process.env.SECRET})
        const chat = await this.db.chat.findFirst({
          where: {
            id: chatId,
            users: {
              some: {
                userId: decoded.id
              }
            }
          }
        });
        if (!chat){ throw new BadRequestException('Что-то не так')}
        await this.db.chat.delete({
        where: {
            id: chatId
        },
        include: { messages: true, users: true }
        });
        return true;

      }

      async getChat(chatId: string, token){
        try {
          await this.jwtService.verifyAsync(token, { secret: process.env.SECRET })
        } catch (err) {throw new ForbiddenException('Некорретный токен')}
        const decoded = await this.jwtService.verifyAsync(token, { secret: process.env.SECRET})
        const chat = await this.db.chat.findFirst({
          where: {
            id: chatId,
            users: {
              some: {
                userId: decoded.id
              }
            }
          }
        });
        if (!chat){ throw new BadRequestException('Что-то не так')}
        return this.db.chat.findUnique({
            where: {
                id: chatId
            },
            include: { messages: true, users: true}
        });
      }

      async createRSA(){
        const { publicKey, privateKey } = generateKeyPairSync('rsa', {
          modulusLength: 2048,
          publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
          },
          privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
          }
        });
        return {publicKey, privateKey}
      }
      
      async updateUsersInChat(data: users, token){
        try {
          await this.jwtService.verifyAsync(token, { secret: process.env.SECRET })
        } catch (err) {throw new ForbiddenException('Некорретный токен')}
        const decoded = await this.jwtService.verifyAsync(token, { secret: process.env.SECRET})
        const chat = await this.db.chat.findFirst({
          where: {
            id: data.id,
            users: {
              some: {
                userId: decoded.id
              }
            }
          }
        });
        if (!chat){ throw new BadRequestException('Что-то не так')}
        const users = await this.db.users.findMany({
          where: { id: { in: data.userIds } }
        });
        if (users.length !== data.userIds.length) {
          throw new NotFoundException('Один или несколько пользователей не найдены');
        }
        const userChats = data.userIds.map(userId => ({
          chatId: data.id,
          userId: userId
        }));
      
        await this.db.userChat.createMany({
          data: userChats,
          skipDuplicates: true
        });
      
        return true;
      }

      async chatQuit(chatId:string, token){
        try {
          await this.jwtService.verifyAsync(token, { secret: process.env.SECRET })
        } catch (err) {throw new ForbiddenException('Некорретный токен')}
        const decoded = await this.jwtService.verifyAsync(token, { secret: process.env.SECRET})
        const chat = await this.db.chat.findFirst({
          where: {
            id: chatId,
            users: {
              some: {
                userId: decoded.id
              }
            }
          }
        });
        if (!chat){ throw new BadRequestException('Что-то не так')}
        const users = await this.db.users.findMany({
          where: { id: decoded.id }
        });
        if (!users) {
          throw new NotFoundException('Один или несколько пользователей не найдены');
        }
        await this.db.userChat.deleteMany({
          where:{
            chatId: chatId,
            userId: decoded.id
          }
        })
        return true
      }
}
