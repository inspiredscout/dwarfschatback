import { INestApplication, Module } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

export async function setupSwagger(app: INestApplication) {
  if (process.env.SWAGGER == 'TRUE')
  {
  const options = new DocumentBuilder()
    .setTitle('Your API')
    .setDescription('API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api/v1', app, document);
}
}

@Module({
  imports:[UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
