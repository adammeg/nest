import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';

import { config } from 'common/config';
import { ApiException, ErrorCodes } from 'common/errors';
import { Logger } from 'common/services';
import { User } from '../models';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
    constructor(private readonly jwtService: JwtService, private logger: Logger, private userService: UserService) {
    }

    /**
     * Retrieve user from token payload.
     *
     * @param {number} id
     * @returns {Promise<User>}
     */
    async validateUser(id: number): Promise<User> {
        this.logger.log('Validate user')

        return await this.userService.findUser(id);
    }

    /**
     * Generate access and refresh tokens.
     *
     * @param {User} user
     * @returns {object}
     */
    public generateAuthTokens(user: User): object {
        this.logger.log(`Generate auth token for ${user}`)

        return {
            token: this.generateAccessToken(user),
            refresh_token: this.generateRefreshToken(user),
        };
    }

    /**
     * Generate the user access token.
     *
     * @param {User} user
     * @returns {string}
     */
    public generateAccessToken(user: User): string {
        this.logger.log(`Generate access token for ${user}`);

        const payload = {id: user.id, roles: user.roles};
        const options = {
            audience: user.securityKey,
            expiresIn: config.auth.jwt.tokenTtl,
            algorithm: 'HS256',
        };

        return this.jwtService.sign(payload, options);
    }

    /**
     * Generate the refresh token used to renewal the access token.
     *
     * @param {User} user
     * @returns {string}
     */
    public generateRefreshToken(user: User): string {
        this.logger.log(`Generate refresh token for ${user}`);

        const payload = {id: user.id};
        const options = {
            audience: user.securityKey,
            expiresIn: config.auth.jwt.refreshTokenTtl,
            algorithm: 'HS512',
        };

        return this.jwtService.sign(payload, options);
    }

    /**
     * Explicit retrieving user from the access token.
     *
     * @param {string} accessToken
     * @returns {Promise<User>}
     */
    public async retrieveUserFromAccessToken(accessToken: string): Promise<User> {
        this.logger.log(`retrieve user from access token`);

        if (!accessToken) {
            throw new ApiException(ErrorCodes.EXPECTED_JWT_TOKEN);
        }

        let decoded: { id: number; aud: string; };

        try {
            decoded = this.jwtService.verify(accessToken, {algorithms: ['HS256']});
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new ApiException(ErrorCodes.EXPIRED_JWT_TOKEN);
            } else {
                throw new ApiException(ErrorCodes.INVALID_JWT_TOKEN);
            }
        }

        const user = await this.userService.findUser(decoded.id);

        if (user === undefined || decoded.aud !== user.securityKey) {
            throw new ApiException(ErrorCodes.INVALID_JWT_TOKEN);
        }

        if (!user.enabled) {
            throw new ApiException(ErrorCodes.DISABLED_ACCOUNT);
        }

        return user;
    }

    /**
     * Retrieve the user from the refresh token.
     *
     * @param {string} refreshToken
     * @returns {Promise<User>}
     */
    public async retrieveUserFromRefreshToken(refreshToken: string): Promise<User> {
        this.logger.log(`retrieve user from refresh token`);

        if (!refreshToken) {
            throw new ApiException(ErrorCodes.INVALID_REFRESH_TOKEN);
        }

        let decoded: { id: number; aud: string; };

        try {
            decoded = this.jwtService.verify(refreshToken, {algorithms: ['HS512']});
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                throw new ApiException(ErrorCodes.EXPIRED_REFRESH_TOKEN);
            } else {
                throw new ApiException(ErrorCodes.INVALID_REFRESH_TOKEN);
            }
        }

        const user = await this.userService.findUser(decoded.id);
        if (user === undefined || decoded.aud !== user.securityKey) {
            throw new ApiException(ErrorCodes.INVALID_REFRESH_TOKEN);
        }

        return user;
    }
}
