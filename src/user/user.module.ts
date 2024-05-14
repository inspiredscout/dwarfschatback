import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaClient } from '@prisma/client';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'), // Путь к директории с файлами
      serveRoot: '/media',
      serveStaticOptions: {
				index: false
			}
    }),
  ],
  controllers: [UserController],
  providers: [UserService, PrismaClient]
})
export class UserModule {}
