import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private jwtService:JwtService, private db:PrismaClient, private userService:UserService) {}
    async refreshToken(RToken){
        const decoded = await this.jwtService.verifyAsync(RToken, {secret: process.env.RT_SECRET})

    }

    async validateUser(login: string, password: string): Promise<any> {
        const user = await this.userService.findUser(login);
        if (user && await bcrypt.compare(password, user.password)) {
          const { password, ...result } = user;
          return result;
        }
        return null;
      }
}