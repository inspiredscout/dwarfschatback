import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(private jwtService:JwtService, private db:PrismaClient, private userService:UserService) {}

    async validateUser(data): Promise<any> {
        const user = await this.userService.findUser(data.login);
        if (user && await bcrypt.compare(data.password, user.password)) {
            const refreshToken = await this.generateRefreshToken(user.id)
            const accessToken = await this.generateAccessToken(user.id)
            return {refresh_token:refreshToken, access_token:accessToken};
        }
        throw new BadRequestException('Auth err');
    }

      async generateRefreshToken(id: string) {
        const refrToken = await this.jwtService.signAsync({ id, tokenType: 'refresh'}, {secret: process.env.RT_SECRET, expiresIn: '30d' })
        const oldRT = await this.db?.refreshToken.findUnique({
          where:
          {UsersId:id}})
        if ( oldRT ) {
          await this.db?.refreshToken.deleteMany({
              where: {
                  UsersId: id,
              },
          });
        }
        const RT = await this.db?.refreshToken.create({
          data: {
            token: refrToken,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // Expires in 30 days
            user: { connect: { id: id } }
          }
        });
        return RT.token;
    }

    async refreshToken(token){
        const decoded = await this.jwtService.verifyAsync(token, {secret: process.env.RT_SECRET})
        if (!decoded) { throw new BadRequestException('Токен не валид')}
        if (Date.now() >= decoded.exp * 1000) { throw new BadRequestException('Токен просрочен')}
        const oldRT = await this.db?.refreshToken.findUnique({
          where:
          {UsersId:decoded.id}})
        if (oldRT && oldRT.token !== token) { throw new BadRequestException('Токен не валид')}
        const user = await this.userService.findUserById(decoded.id);
        if (!user) {
          throw new UnauthorizedException('Что то не так');
        }
    
        const response = await {access_token: await this.generateAccessToken(user.id), refresh_token: await this.generateRefreshToken(user.id)}
        return response
      }

    async generateAccessToken(id){
        const payload = {id}
        const access_token = await this.jwtService.signAsync(payload)
        return access_token
    }
}