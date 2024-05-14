import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import {v4 as uuid} from 'uuid';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor( private db:PrismaClient){}

    async findUser(login){
        const user = await this.db?.users.findFirst({
            where:{
                login: login
            }
        })
        return user
    }

    async createUser(data){
        const saltRounds = 10;
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


}

