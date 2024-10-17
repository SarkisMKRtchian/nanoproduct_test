import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT;
  const logger = new Logger;

  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [process.env.CLIENT_URL],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true, transformOptions: { enableImplicitConversion: true } }));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('NANOPRODUCT API')
    .setVersion('0.0.1')
    .addBearerAuth({type: 'http', "x-tokenName": 'authorization', in: 'header', bearerFormat: 'JWT'}, 'jwt_auth')
    .addSecurityRequirements('jwt_auth')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api/docs', app, swaggerDocument, {
    customSiteTitle: 'Nanoproduct test REST API docs.',
    swaggerOptions: {
      defaultModelsExpandDepth: -1
    }
  });


  await app.listen(PORT, () => {
    logger.log(`Server started on port: ${PORT}`);
    logger.log(`Swagger UI started on url: http://localhost:${PORT}/api/docs`);
  });
}
bootstrap();
