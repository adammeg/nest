import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { config } from 'common/config';

import * as fromControllers from './controllers';
import * as fromGuards from './guards';
import { User } from './models';
import { UserRepository } from './repositories/user.repository';
import * as fromServices from './services';
import * as fromStrategies from './strategies';

@Global()
@Module({
    imports: [
        JwtModule.register({ secretOrPrivateKey: config.auth.jwt.secretKey }),
        TypeOrmModule.forFeature([User, UserRepository]),
    ],
    controllers: [
        fromControllers.UserController,
        fromControllers.SecurityController,
    ],
    providers: [
        fromGuards.ApiGuard,
        fromGuards.RolesGuard,
        fromServices.AuthService,
        fromServices.UserMailerService,
        fromServices.UserService,
        fromStrategies.JwtStrategy,

    ],
    exports: [
        fromGuards.ApiGuard,
        fromGuards.RolesGuard,
        fromServices.AuthService,
        fromServices.UserService,
    ],
})
export class UserModule {
}
