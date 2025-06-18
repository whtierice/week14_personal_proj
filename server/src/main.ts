import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
process.env.TZ = 'Asia/Seoul';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // 전역 파이프 설정
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  
  // CORS 설정
  app.enableCors({
    origin: 'http://localhost:3001',  // React 앱 주소
    credentials: true,
  });
  
  // 포트 설정
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

// 직접 실행될 때만 bootstrap 함수 호출
if (require.main === module) {
  bootstrap();
}