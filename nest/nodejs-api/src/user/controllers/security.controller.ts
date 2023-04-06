import { Body, Controller, HttpCode, Logger, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiImplicitBody, ApiUseTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { ApiException, ErrorCodes } from 'common/errors';
import { ValidatorService } from 'common/services';
import { AuthService, UserMailerService, UserService } from '../services';
import { CredentialsDto, ForgotPasswordDto, RefreshTokenDto, ResetPasswordDto, UserDto } from '../dto';

@ApiUseTags('Security')
@Controller()
export class SecurityController {

    /**
     * Constructor
     * @param authService
     * @param logger
     * @param validator
     * @param userMailer
     * @param userService
     */
    constructor(private authService: AuthService,
        private logger: Logger,
        private validator: ValidatorService,
        private userMailer: UserMailerService,
        private userService: UserService) {
    }

    /**
     * Login controller
     * 
     * @param {CredentialsDto} credentials 
     * @returns {Promise<object>}
     */
    @Post('/login')
    public async login(@Body() credentials: CredentialsDto): Promise<object> {
        this.logger.log('Login to your account')

        const user = await this.userService.findUserByUsernameOrEmail(credentials.username);

        if (user === undefined || !user.isPasswordValid(credentials.password)) {
            throw new ApiException(ErrorCodes.INVALID_CREDENTIALS);
        }

        return this.authService.generateAuthTokens(user);
    }

    /**
     * Refresh token controller
     * 
     * @param {RefreshTokenDto} refreshToken 
     * @returns {Promise<object>}
     */
    @Post('/refresh-token')
    public async refresh(@Body() { refreshToken }: RefreshTokenDto): Promise<object> {
        this.logger.log('Refresh token')

        const user = await this.authService.retrieveUserFromRefreshToken(refreshToken);

        return this.authService.generateAuthTokens(user);
    }

    /**
     * Register to new account controller
     * 
     * @param {UserDto} userDto 
     * @returns {Promise<object>}
     */
    @Post('/register')
    public async register(@Body() userDto: UserDto): Promise<object> {
        this.logger.log('Register to new account')

        const user = await this.userService.createUser(userDto.toUser());
        this.userMailer.sendActivationMail(user);

        return this.authService.generateAuthTokens(user);
    }

    /**
     * Confirm email after registration controller
     * @param {string} token 
     * @returns {Promise<object>}
     */
    @Post('/confirm-email/:confirmationToken')
    public async confirmEmail(@Param('confirmationToken') token: string): Promise<object> {
        this.logger.log('Confirm email')

        let user = await this.userService.findUserByConfirmationToken(token);

        if (user === undefined) {
            throw new ApiException(ErrorCodes.INVALID_CONFIRMATION_TOKEN);
        }

        user = await this.userService.activateUser(user);

        return this.authService.generateAuthTokens(user);
    }

    /**
     * Forgot password controller
     * 
     * @param {ForgotPasswordDto} forgotPasswordDto
     * @returns {ForgotPasswordDto): Promise<void>} 
     */
    @HttpCode(204)
    @Post('/forgot-password')
    public async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto): Promise<void> {
        this.logger.log('Forgot password')

        let user = await this.userService.findUserByEmail(forgotPasswordDto.email);

        user = await this.userService.forgotPassword(user);

        this.userMailer.sendResetPasswordMail(user);
    }

    /**
     * Reset password controller
     * 
     * @param {string} token 
     * @param {*} data 
     * @returns {Promise<object>}
     */
    @Post('/reset-password/:confirmationToken')
    @UsePipes(new ValidationPipe({ disableErrorMessages: false }))
    @ApiImplicitBody({ name: 'resetPassword', type: ResetPasswordDto })
    public async resetPassword(@Param('confirmationToken') token: string, @Body() data: any): Promise<object> {
        // Disable auto-validation to validate confirmation token before the password
        let user = await this.userService.findUserByConfirmationToken(token);
        const resetPassword = plainToClass<ResetPasswordDto, object>(ResetPasswordDto, data);

        if (user === undefined) {
            throw new ApiException(ErrorCodes.INVALID_CONFIRMATION_TOKEN);
        }

        await this.validator.validateOrReject(resetPassword);
        user = await this.userService.resetPassword(user, resetPassword['newPassword']);

        return this.authService.generateAuthTokens(user);
    }
}
