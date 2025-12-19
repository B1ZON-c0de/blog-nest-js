import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.use(cookieParser());

  // app.enableCors({
  //   origin: process.env.FRONTEND_URL,
  //   credentials: true,
  // });
  await app.listen(process.env.PORT ?? 3000, () =>
    console.log(
      `Server listenint on: http://localhost:${process.env.PORT ?? 3000}`,
    ),
  );
}
bootstrap();
