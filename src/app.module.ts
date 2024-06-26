import { INestApplication, Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';

export async function setupSwagger(app: INestApplication) {
  if (process.env.SWAGGER == 'TRUE')
  {
  const options = new DocumentBuilder()
    .setTitle('DwarfsAPI')
    .setDescription('Супер дока')
    .addBearerAuth()
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/v2', app, document);
}
}

@Module({
  imports:[UserModule, AuthModule, ChatModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
