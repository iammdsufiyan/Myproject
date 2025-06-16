import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { TransformInterceptor } from './transform/transform.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { VersioningType } from '@nestjs/common';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.useGlobalFilters(new UnknownExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  app.enableVersioning({
  type: VersioningType.URI,
});
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
