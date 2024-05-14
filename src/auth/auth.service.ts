import { BadRequestException, Injectable } from '@nestjs/common';
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

    async validateUser(data): Promise<any> {
        const user = await this.userService.findUser(data.login);
        if (user && await bcrypt.compare(data.password, user.password)) {
          const { password, ...result } = user;
          return result;
        }
        throw new BadRequestException('Auth err');
      }
}