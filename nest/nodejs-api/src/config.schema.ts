import * as Joi from 'joi';

export const configSchema: Joi.ObjectSchema = Joi.object({
    NODE_ENV: Joi.string().valid(['development', 'production']).default('production'),
    PORT: Joi.number().default(3000),
    API_ROUTE_PREFIX: Joi.string().default('api'),
    LOCAL_UPLOAD_FOLDER: Joi.string().default('uploads'),
    STORAGE_SYSTEM: Joi.string().valid(['aws_s3', 'local']).required(),
    SERVER_HOST: Joi.string().required(),
    AWS_S3_BUCKET: Joi.string().required(),
    AWS_S3_REGION: Joi.string().default('eu-west-3'),
    ORM_URL: Joi.string().required(),
    ORM_DATABASE: Joi.string().required(),
    ORM_LOGGING: Joi.boolean().default(false),
    SECRET_KEY: Joi.string().required(),
    TOKEN_TTL: Joi.string().default('1h'),
    REFRESH_TOKEN_TTL: Joi.string().default('1d'),
    MAILER_SENDER_EMAIL: Joi.string().required(),
    MAILER_SENDER_NAME: Joi.string().required(),
    MAILER_CONNECTION_URL: Joi.string().required(),
    CLIENT_BASE_URL: Joi.string().required(),
});
