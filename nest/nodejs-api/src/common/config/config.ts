import { DocumentBuilder } from '@nestjs/swagger';
import { SwaggerBaseConfig } from '@nestjs/swagger/dist/interfaces';
import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from 'joi';

import { configSchema } from 'config.schema';

export interface EnvConfig {
    [prop: string]: string;
}

export class Config {
    private envConfig: EnvConfig;

    constructor() {
        if (fs.existsSync('.env')) {
            const config = dotenv.parse(fs.readFileSync('.env'));
            this.envConfig = this.validateInput(config);
        }
        this.envConfig = this.envConfig ? this.envConfig : process.env;
    }

    get(key: string): string {
        return this.envConfig[key];
    }

    isProdEnv() {
        return this.envConfig.NODE_ENV === 'production';
    }

    get app() {
        return {
            apiPort: this.envConfig.PORT,
            apiRoutePrefix: this.envConfig.API_ROUTE_PREFIX,
            localUploadFolder: this.envConfig.LOCAL_UPLOAD_FOLDER,
            storageSystem: this.envConfig.STORAGE_SYSTEM,
            serverHost: this.envConfig.SERVER_HOST,
        };
    }

    get typeOrm(): ConnectionOptions {
        return {
            type: 'mysql',
            database: this.envConfig.ORM_DATABASE,
            url: this.envConfig.ORM_URL, // https://github.com/typeorm/typeorm/issues/2096
            entities: [this.isProdEnv() ? 'dist/**/models/**/*.js' : 'src/**/models/**/*.ts'],
            migrations: [this.isProdEnv() ? 'dist/migrations/**/*.js' : 'src/migrations/**/*.ts'],
            cli: {
                migrationsDir: this.isProdEnv() ? 'dist/migrations' : 'src/migrations',
            },
        };
    }

    get awsS3() {
        return {
            bucket: this.envConfig.AWS_S3_BUCKET,
            region: this.envConfig.AWS_S3_REGION,
        };
    }

    get apiRoutePrefix(): string {
        return this.envConfig.API_ROUTE_PREFIX;
    }

    getSwaggerOptions(): SwaggerBaseConfig {
        const documentBuilder = new DocumentBuilder();

        documentBuilder
          .setTitle('Nest API prototype')
          .setDescription('REST API for Nest prototype')
          .setVersion('1.0.0')
          .setBasePath(this.app.apiRoutePrefix)
          .addBearerAuth('Authorization', 'header');

        return documentBuilder.build();
    }

    get auth(): { [prop: string]: any } {
        return {
            jwt: {
                secretKey: this.envConfig.SECRET_KEY,
                tokenTtl: this.envConfig.TOKEN_TTL,
                refreshTokenTtl: this.envConfig.REFRESH_TOKEN_TTL,
                firewall: new RegExp(this.envConfig.API_ROUTE_PREFIX +
                  '(?!\/(login|refresh-token|register|confirm-email|forgot-password|reset-password))'),
            },
        };
    }

    get mailerConfig(): { [prop: string]: string } {
        return {
            senderEmail: this.envConfig.MAILER_SENDER_EMAIL,
            senderName: this.envConfig.MAILER_SENDER_NAME,
            connectionUrl: this.envConfig.MAILER_CONNECTION_URL,
        };
    }

    get client(): { [prop: string]: string } {
        return {
            baseUrl: this.envConfig.CLIENT_BASE_URL,
            confirmEmailUrl: this.envConfig.CLIENT_BASE_URL.concat('/confirm-email/{token}'),
            resetPasswordUrl: this.envConfig.CLIENT_BASE_URL.concat('/reset-password/{token}'),
        };
    }

    /**
     * Ensures all needed variables are set, and returns the validated JavaScript object
     * including the applied default values.
     */
    private validateInput(envConfig: EnvConfig): EnvConfig {

        const { error, value: validatedEnvConfig } = Joi.validate(envConfig, configSchema);

        if (error) {
            throw new Error(`Config validation error: ${error.message}`);
        }

        return validatedEnvConfig;
    }
}
