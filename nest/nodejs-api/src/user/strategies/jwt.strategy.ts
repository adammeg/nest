import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { config } from 'common/config';
import { AuthService } from '../services';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private authService: AuthService) {
        super(
            {
                jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
                secretOrKey: config.auth.jwt.secretKey,
                algorithms: ['HS256'],
            },
        );

    }

    async validate(payload: any) {
        const user = await this.authService.validateUser(payload.id);

        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }
}
