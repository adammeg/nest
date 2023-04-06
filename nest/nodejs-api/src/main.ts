import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

import { config } from 'common/config';
import { TransformInterceptor } from 'common/interceptors';
import { ApiExceptionFilter, BadRequestExceptionFilter } from 'common/exception-filters';
import { ApiGuard, RolesGuard } from 'user/guards';
import { UserModule } from 'user/user.module';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/exception-filters/http-exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const rolesGuard = app.select(UserModule).get(RolesGuard);

    app
        .setGlobalPrefix(config.apiRoutePrefix)
        .useGlobalInterceptors(new TransformInterceptor())
        .useGlobalPipes(new ValidationPipe({ transform: true }))
        .useGlobalFilters(new BadRequestExceptionFilter(), new ApiExceptionFilter(), new HttpExceptionFilter())
        .useGlobalGuards(new ApiGuard(), rolesGuard)
        .enableCors({ origin: config.client.baseUrl })
        .useStaticAssets(join(__dirname + './../uploads'));

    SwaggerModule.setup('/api/doc', app, SwaggerModule.createDocument(app, config.getSwaggerOptions()));

    await app.listen(config.app.apiPort);
}

bootstrap();
