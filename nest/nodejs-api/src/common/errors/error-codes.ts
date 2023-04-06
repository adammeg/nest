import { startsWith } from 'lodash';

export class ErrorCodes {
    // Standard codes
    public static readonly HTTP_BAD_REQUEST = 400;
    public static readonly HTTP_UNAUTHORIZED = 401;
    public static readonly HTTP_FORBIDDEN = 403;
    public static readonly HTTP_NOT_FOUND = 404;
    public static readonly HTTP_METHOD_NOT_ALLOWED = 405;
    public static readonly HTTP_INTERNAL_SERVER_ERROR = 500;
    public static readonly HTTP_SERVICE_UNAVAILABLE = 503;

    // Specifics codes
    public static readonly FAILED_DATA_VALIDATION = 400000;
    public static readonly INVALID_FILE = 400001;
    public static readonly PASSWORD_FAILED = 400002;
    public static readonly INVALID_CREDENTIALS = 401000;
    public static readonly EXPECTED_JWT_TOKEN = 401001;
    public static readonly INVALID_JWT_TOKEN = 401002;
    public static readonly EXPIRED_JWT_TOKEN = 401003;
    public static readonly INVALID_REFRESH_TOKEN = 401004;
    public static readonly EXPIRED_REFRESH_TOKEN = 401005;
    public static readonly DISABLED_ACCOUNT = 401006;
    public static readonly INVALID_CONFIRMATION_TOKEN = 401007;
    public static readonly DENIED_VIEW_NOTE = 403010;
    public static readonly DENIED_EDIT_NOTE = 403012;
    public static readonly DENIED_EDIT_USER = 403013;
    public static readonly NOTE_NOT_FOUND = 404011;
    public static readonly USER_NOT_FOUND = 404012;


    public static readonly STATUS_TEXTS = {
        [ErrorCodes.HTTP_BAD_REQUEST]: 'Bad Request',
        [ErrorCodes.HTTP_UNAUTHORIZED]: 'Unauthorized',
        [ErrorCodes.HTTP_FORBIDDEN]: 'Forbidden',
        [ErrorCodes.HTTP_NOT_FOUND]: 'Not Found',
        [ErrorCodes.HTTP_METHOD_NOT_ALLOWED]: 'Method Not Allowed',
        [ErrorCodes.HTTP_INTERNAL_SERVER_ERROR]: 'Internal Server Error',
        [ErrorCodes.HTTP_SERVICE_UNAVAILABLE]: 'Service Unavailable',

        [ErrorCodes.FAILED_DATA_VALIDATION]: 'Failed Data Validation',
        [ErrorCodes.INVALID_FILE]: 'Invalid File',
        [ErrorCodes.INVALID_CREDENTIALS]: 'Invalid Credentials',
        [ErrorCodes.EXPECTED_JWT_TOKEN]: 'EXPECTED JWT TOKEN',
        [ErrorCodes.INVALID_JWT_TOKEN]: 'Invalid JWT Token',
        [ErrorCodes.EXPIRED_JWT_TOKEN]: 'Expired JWT Token',
        [ErrorCodes.INVALID_REFRESH_TOKEN]: 'Invalid Refresh Token',
        [ErrorCodes.EXPIRED_REFRESH_TOKEN]: 'Expired Refresh Token',
        [ErrorCodes.DISABLED_ACCOUNT]: 'Account is disabled.',
        [ErrorCodes.INVALID_CONFIRMATION_TOKEN]: 'Invalid Confirmation Token',
        [ErrorCodes.DENIED_VIEW_NOTE]: 'Denied Access To Note',
        [ErrorCodes.DENIED_EDIT_NOTE]: 'Denied Edit Note',
        [ErrorCodes.DENIED_EDIT_USER]: 'Denied Edit User',
        [ErrorCodes.NOTE_NOT_FOUND]: 'Note Not Found',
        [ErrorCodes.USER_NOT_FOUND]: 'uSER Not Found',
        [ErrorCodes.PASSWORD_FAILED]: 'Password failed',

    };

    public static isBadRequest(code: number): boolean {
        return startsWith(code.toString(), '400');
    }

    public static isNotFound(code: number): boolean {
        return startsWith(code.toString(), '404');
    }

    public static isUnauthorized(code: number): boolean {
        return startsWith(code.toString(), '401');
    }

    public static isForbidden(code: number): boolean {
        return startsWith(code.toString(), '403');
    }

    public static isServerError(code: number): boolean {
        return parseInt(code.toString().substring(0, 3), 10) >= 500;
    }
}
