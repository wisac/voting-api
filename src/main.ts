import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   // app.useGlobalPipes(new ValidationPipe());
   app.useGlobalPipes(
     new ValidationPipe({
       whitelist: true,
       forbidNonWhitelisted: false,
       transform: true,
       transformOptions: {
         enableImplicitConversion: true,
       },
     }),
   );

  const config = new DocumentBuilder()
    .setTitle('Voting System API')
    .setDescription('API for a simple picture voting system')
    .setVersion('1.0')
    .addBearerAuth()
     .build();
   

   app.enableCors({
      
   })

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('', app, document);

  await app.listen(3000);
}
bootstrap();
