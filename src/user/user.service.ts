import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import {v4 as uuid} from 'uuid';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor( private db:PrismaClient, private jwtService:JwtService){}

    async findUser(login){
        login = login.toLowerCase()
        const user = await this.db?.users.findFirst({
            where:{
                login: login
            }
        })
        return user
    }

    async findUserById(id){
        const user = await this.db?.users.findFirst({
            where:{
                id: id
            },
            include:{
                chats:{
                include:{
                    chat: {select:{
                        id: true,
                        name: true,
                    }}
                }}},
            })
        return user
    }

    async createUser(data){
        const saltRounds = 10;
        data.login = data.login.toLowerCase()
        if (await this.db.users.findFirst({
            where:{ OR: [
                {username: data.username},
                {login: data.login},
            ]}
        })) throw new BadRequestException('Этот логин и никнейм уже заняты')
        if (!data.pfp){
            const user = await this.db?.users.create({
                data:{
                    username: data.username,
                    login: data.login,
                    password: await bcrypt.hash(data.password, saltRounds),
                    pfpId: undefined
                }
            })
            return user
        }
        const file = data.pfp
        if (!file) {
          throw new BadRequestException('No file uploaded');
        }
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir);
        }
        const newFileName = uuid;
        const filePath = path.join(uploadDir, newFileName);
        await fs.promises.writeFile(filePath, file.buffer);
        const user = await this.db?.users.create({
            data:{
                username: data.username,
                login: data.login,
                password: await bcrypt.hash(data.password, saltRounds),
                pfpId: newFileName,
            }
        })

        return user
    }

    async getInfo(token){
        try {
            await this.jwtService.verifyAsync(token, { secret: process.env.SECRET })
        } catch (err) {throw new ForbiddenException('Некорретный токен')}
        const decoded = await this.jwtService.verifyAsync(token, { secret: process.env.SECRET })
        const info = await this.findUserById(decoded.id)
        if (!info) { throw new BadRequestException('Такого юзера нету')}
        return info
      }

    async changePfp(data, token){
        try {
            await this.jwtService.verifyAsync(token, { secret: process.env.SECRET })
        } catch (err) {throw new ForbiddenException('Некорретный токен')}
        const decoded = await this.jwtService.verifyAsync(token, { secret: process.env.SECRET });
        const user = await this.db.users.findFirst({
            where: {id: decoded.id}
        })
        if (!user) { throw new BadRequestException('Такого юзера нету')}
        const oldPfp = user.pfpId
        if (!data.pfp){
            await this.db.users.update({
                where: {id: user.id},
                data: {pfpId: undefined}
            })
            return true
        }
        const file = data.pfp
        if (!file) {
          throw new BadRequestException('No file uploaded');
        }
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir);
        }
        const fileExtension = file.originalname.split('.').pop()
        const newFileName = uuid()+ '.' + fileExtension;
        const filePath = path.join(uploadDir, newFileName);
        await fs.promises.writeFile(filePath, file.buffer);
        await this.db.users.update({
            where: {id: user.id},
            data: {pfpId: newFileName}
        })
        if (oldPfp){
        await fs.unlinkSync(path.join(uploadDir, oldPfp))}
        return true
    }

    async changePassword(data, token){
        try {
            await this.jwtService.verifyAsync(token, { secret: process.env.SECRET })
        } catch (err) {throw new ForbiddenException('Некорретный токен')}
        const decoded = await this.jwtService.verifyAsync(token, { secret: process.env.SECRET });
        const user = await this.db.users.findFirst({
            where: {id: decoded.id}
        })
        if (!user) { throw new BadRequestException('Такого юзера нету')}
        const saltRounds = 10;
        await this.db.users.update({
            where: {id: user.id},
            data: {password: await bcrypt.hash(data.password, saltRounds)}
        })
        return true
    }

    async changeUsername(data, token){
        try {
            await this.jwtService.verifyAsync(token, { secret: process.env.SECRET })
        } catch (err) {throw new ForbiddenException('Некорретный токен')}
        const decoded = await this.jwtService.verifyAsync(token, { secret: process.env.SECRET });
        const user = await this.db.users.findFirst({
            where: {id: decoded.id}
        })
        if (!user) { throw new BadRequestException('Такого юзера нету')}
        const checkUsername = await this.db.users.findFirst({
            where:{ OR: [
                {username: data.username},
            ]}
        })
        if (checkUsername){throw new BadRequestException('Этот никнейм уже занят')}
        await this.db.users.update({
            where: {id: user.id},
            data: {username: data.username}
        })
        return true
    }

    async changeStatus(data, token){
        try {
            await this.jwtService.verifyAsync(token, { secret: process.env.SECRET })
        } catch (err) {throw new ForbiddenException('Некорретный токен')}
        const decoded = await this.jwtService.verifyAsync(token, { secret: process.env.SECRET });
        const user = await this.db.users.findFirst({
            where: {id: decoded.id}
        })
        if (!user) { throw new BadRequestException('Такого юзера нету')}
        await this.db.users.update({
            where: {id: user.id},
            data: {status: data.status}
        })
        return true
    }

    async findUserByUsername(username){
        return this.db.users.findMany({
            where:{
                username: username,
            },
            select:{
                id: true,
                username: true,
                pfpId: true,
                status: true
            }
        })
    }

    async findUserByIdv2(id){
        return this.db.users.findMany({
            where:{
                id: id,
            },
            select:{
                id: true,
                username: true,
                pfpId: true,
                status: true
            }
        })
    }
}

