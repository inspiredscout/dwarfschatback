import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { UserService } from 'src/user/user.service';
// import { LocalStrategy } from './local.strategy';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports:[JwtModule.register({
    secret: process.env.SECRET,
    signOptions: { expiresIn: '1d' },
}),PassportModule,],
  controllers: [AuthController],
  providers: [AuthService, PrismaClient, UserService
    // , LocalStrategy

  ]
})
export class AuthModule {}
