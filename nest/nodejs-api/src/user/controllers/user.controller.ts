import { Body, Controller, Delete, Get, Logger, Param, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiUseTags } from '@nestjs/swagger';

import { ApiException, ErrorCodes } from 'common/errors';
import { CurrentUser } from 'common/decorators';
import { UpdatePasswordDto } from 'user/dto/update-password.dto';
import { RolesGuard } from '../guards';
import { User } from '../models';
import { UserService } from '../services';
import { EditMyProfileDto, EditProfileDto } from '../dto';
import { PaginationFilter } from 'common/filters';

@ApiBearerAuth()
@ApiUseTags('User')
@UseGuards(RolesGuard)
@Controller('users')
export class UserController {

  /**
   * User controller constructor
   * 
   * @param {UserService} userService 
   * @param {Logger} logger 
   */
  constructor(private userService: UserService, private logger: Logger) {
  }

    /**
   * Get users me
   * 
   * @param {User} currentUser 
   * @returns {Promise<{ users: User[] }>}
   */
  @Get('/users')
  public async all(@Query() filter: PaginationFilter): Promise<{ users: User[] }> {
    this.logger.log('Get all users')

    const users =  await this.userService.findUsers(filter);
    return {users}
  }

  /**
   * Get users me
   * 
   * @param {User} currentUser 
   * @returns {Promise<{ user: User }>}
   */
  @Get('/me')
  public async one(@CurrentUser() currentUser: User): Promise<{ user: User }> {
    this.logger.log('Get user me')

    return { user: currentUser };
  }

  /**
   * Get user by id
   * 
   * @param {number} id 
   * @returns {Promise<{ user: Use }>}
   */
  @Get(':id')
  public async oneById(@Param('id') id: number): Promise<{ user: User }> {
    this.logger.log('Get user by id')

    const user =  await this.userService.findUser(id);
    return {user}
  }

  /**
   * Update user profile controller
   * 
   * @param {EditMyProfileDto} editMyProfileDto 
   * @param {User} currentUser 
   * @returns {Promise<{ user: User }>}
   */
  @Put('/me')
  public async update(@Body() editMyProfileDto: EditMyProfileDto, @CurrentUser() currentUser: User): Promise<{ user: User }> {
    this.logger.log('Update current user profile')

    if (!currentUser.isPasswordValid(editMyProfileDto.currentPassword)) {
      throw new ApiException(ErrorCodes.PASSWORD_FAILED);
    }

    const user = await this.userService.updateUser(editMyProfileDto, currentUser)
    
    return { user };
  }

  /**
   * Put user by id
   * @param {id} id 
   * @param {EditProfileDto} editProfileDto 
   * @param {User} currentUser 
   * @return {Promise<{ user: User }}
   */
  @Put(':id')
  public async putById(@Param('id') id: number, @Body() editProfileDto: EditProfileDto, @CurrentUser() currentUser: User): Promise<{ user: User }> {
    this.logger.log('Put user by id')

    const oldUser = await this.userService.findUser(id)
    
    if (oldUser === undefined) {
      throw new ApiException(ErrorCodes.USER_NOT_FOUND);
    }
    if (!currentUser.isAdmin(currentUser.roles)) {
      throw new ApiException(ErrorCodes.DENIED_EDIT_USER);
    }
    const user =  await this.userService.updateUserById(editProfileDto, oldUser);
    return {user}
  }

  /**
   * Update password controller
   * 
   * @param {UpdatePasswordDto} updatePasswordDto 
   * @param {User} currentUser 
   * @returns {Promise<User>}
   */
  @Put('/me/password')
  public async updatePassword(@Body() updatePasswordDto: UpdatePasswordDto, @CurrentUser() currentUser: User): Promise<User> {
    this.logger.log('Update current user profile')

    if (!currentUser.isPasswordValid(updatePasswordDto.currentPassword)) {
      throw new ApiException(ErrorCodes.PASSWORD_FAILED);
    }

    return await this.userService.updatePassword(updatePasswordDto, currentUser)
  }

  /**
     * Delete note controller
     * 
     * @param {User} user 
     * @param {number} id 
     * @returns {Promise<Response>}
     */
    @Delete(':id')
    public async delete(@CurrentUser() currentUser: User, @Param('id') id: number): Promise<Response> {
        this.logger.log('Delete user: ' + id);

        const user = await this.userService.findUser(id)

        if (user === undefined) {
            throw new ApiException(ErrorCodes.USER_NOT_FOUND);
        }

        if (!currentUser.isAdmin(currentUser.roles)) {
            throw new ApiException(ErrorCodes.DENIED_EDIT_USER);
        }

        return await this.userService.deleteNote(id)
    }
}