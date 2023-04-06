import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

import { config } from 'common/config';
import { Logger } from 'common/services';
import { ApiException, ErrorCodes } from 'common/errors';

@Injectable()
export class ApiGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        if (config.auth.jwt.firewall.test(request.route.path)) {
            return super.canActivate(context);
        }

        return true;
    }

    handleRequest(err, user, info) {
        // Bypass error if no JWT token is provided
        if (info && info.message === 'No auth token') {
            Logger.log('No Token provided by the client');
            throw new ApiException(ErrorCodes.EXPECTED_JWT_TOKEN);
        } else if (info && info.name === 'TokenExpiredError') {
            throw new ApiException(ErrorCodes.EXPIRED_JWT_TOKEN);
        } else if (err || !user) {
            throw new ApiException(ErrorCodes.INVALID_JWT_TOKEN);
        } else if (!user.enabled) {
            throw new ApiException(ErrorCodes.DISABLED_ACCOUNT);
        } else {
            Logger.log('Current user is ' + user.toString());
        }

        return user;
    }
}
