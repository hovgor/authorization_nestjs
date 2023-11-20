import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { useSwagger } from './swagger/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  useSwagger(app);

  await app.listen(process.env.PORT, process.env.HOST);
  Logger.log(`server listning http://${process.env.HOST}:${process.env.PORT}`);
}
bootstrap();
