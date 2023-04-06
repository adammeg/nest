const config = require('./src/common/config').config;

module.exports = {
    ...config.typeOrm,
    entities: ['src/**/models/**/*.ts'],
    migrations: ['src/migrations/**/*.ts'],
    cli: {
        migrationsDir: 'src/migrations',
    },
};