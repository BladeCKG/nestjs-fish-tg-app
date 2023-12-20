import { NestFactory } from '@nestjs/core';

import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    const config = new ConfigService();
    const document = SwaggerModule.createDocument(
        app,
        new DocumentBuilder()
            .setTitle('NF3X')
            .setDescription('NF3X API description')
            .addBearerAuth()
            .addApiKey({ type: 'apiKey', in: 'header', name: 'x-api-key' }, 'x-api-key')
            // .addTag("nf3x")
            .build(),
    );
    SwaggerModule.setup('apis', app, document);
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.listen(await config.getPortConfig());
}
bootstrap();
