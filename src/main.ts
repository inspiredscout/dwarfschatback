import { NestFactory } from '@nestjs/core';
import { AppModule, setupSwagger } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(process.env.API_PREFIX || 'api/v1');
  app.enableCors();
  setupSwagger(app);
  await app.listen(8000);
}
bootstrap();
console.log(
  `Server is running on http://localhost:8000/api/v1`,
);
