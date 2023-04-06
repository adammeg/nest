import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Validator } from 'class-validator';

import { Logger } from 'common/services';
import { PaginationFilter } from 'common/filters';
import { EditProfileDto, EditMyProfileDto } from 'user/dto';
import { UpdatePasswordDto } from 'user/dto/update-password.dto';
import { UserRepository } from 'user/repositories/user.repository';
import { User } from '../models';


@Injectable()
export class UserService {

    /**
     * User service constructor
     * @param {UserRepository} userRepository 
     * @param {Logger} logger 
     */
    constructor(@InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private logger: Logger) {
    }

     /**
     * Find users service
     * 
     * @param {PaginationFilter} filter
     * @returns {Promise<User[]>} 
     */
    public async findUsers(filter: PaginationFilter): Promise<User[]>{
        this.logger.log('Find users');

        return await this.userRepository.findUsersWithFilterQueryBuilder(filter)
    }

    /**
     * Find user service
     * 
     * @param {number} id
     * @returns {Promise<User>} 
     */
    public findUser(id: number): Promise<User> {
        this.logger.log('Find user by id');

        return this.userRepository.findOne({ id });
    }

    /**
     * Find user by username or email.
     * 
     * @param {string} usernameOrEmail 
     * @returns {Promise<User>}
     */
    public findUserByUsernameOrEmail(usernameOrEmail: string): Promise<User> {
        this.logger.log('Find user by username or by email');

        const validator = new Validator();

        if (validator.isEmail(usernameOrEmail)) {
            return this.findUserByEmail(usernameOrEmail);
        } else {
            return this.findUserByUsername(usernameOrEmail);
        }
    }

    /**
     * Find user by username
     * 
     * @param {string} username 
     * @returns {Promise<User>}
     */
    public findUserByUsername(username: string): Promise<User> {
        this.logger.log('Find user by username');

        return this.userRepository.findOne({ usernameCanonical: username.toLowerCase() });
    }

    /**
     * Find user by email
     * 
     * @param {string} email 
     * @returns {Promise<User>}
     */
    public findUserByEmail(email: string): Promise<User> {
        this.logger.log('Find user by email');

        return this.userRepository.findOne({ emailCanonical: email.toLowerCase() });
    }

    /**
     * Find user by confirmation token
     * 
     * @param {string} confirmationToken 
     * @returns {Promise<User>}
     */
    public findUserByConfirmationToken(confirmationToken: string): Promise<User> {
        this.logger.log('Find user by confirmation token');

        return this.userRepository.findOne({ confirmationToken });
    }

    /**
     * Create user service
     * 
     * @param {User} user 
     * @returns {Promise<User>} 
     */
    public async createUser(user: User): Promise<User> {
        this.logger.log(`Create a new user ${user.toString()}`);

        return await this.userRepository.save(user);
    }

    /**
     * Activate user service
     * 
     * @param {User} user
     * @returns {Promise<User>} 
     */
    public async activateUser(user: User): Promise<User> {
        this.logger.log('Update a user');
        user.enabled = true;
        user.confirmationToken = null;
        return this.userRepository.save(user);
    }

    /**
     * Forgot password service
     * 
     * @param {User} user 
     * @returns {Promise<User>}
     */
    public forgotPassword(user: User): Promise<User> {
        this.logger.log('User forgot the password');

        if (!user.confirmationToken) {
            user.generateConfirmationToken();
        }

        return this.userRepository.save(user);
    }

    /**
     * Reset password
     * 
     * @param {User} user 
     * @param {string} password 
     * @returns {Promise<User>}
     */
    public resetPassword(user: User, password: string): Promise<User> {
        this.logger.log('Reset the user password');

        user.confirmationToken = null;
        user.plainPassword = password;

        return this.userRepository.save(user);
    }

    /**
     * Update user
     * 
     * @param {EditMyProfileDto} editMyProfileDto 
     * @param {User} user 
     * @returns {Promise<User>}
     */
    public async updateUser(editMyProfileDto: EditMyProfileDto, user: User): Promise<User> {
        this.logger.log(`Update user profile of ${user}`);

        const { firstName, lastName, email } = editMyProfileDto
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;

        await this.userRepository.save(user);
        
        return user
    }

    /**
     * Update user by id
     * 
     * @param {EditProfileDto} editProfileDto 
     * @param {User} user 
     * @returns {Promise<User>}
     */
    public async updateUserById(editProfileDto: EditProfileDto, user: User): Promise<User> {
        this.logger.log(`Update user profile of ${user}`);
        
        const { firstName, lastName, email } = editProfileDto
        user.firstName = firstName;
        user.lastName = lastName;
        user.email = email;

        await this.userRepository.save(user);
        
        return user
    }

    /**
     * Update user service
     * 
     * @param {UpdatePasswordDto} updatePasswordDto 
     * @param {User} user 
     * @returns {Promise<User>}
     */
    public async updatePassword(updatePasswordDto: UpdatePasswordDto, user: User): Promise<User> {
        this.logger.log(`Update user password of ${user}`);

        const { newPassword, currentPassword } = updatePasswordDto
        user.plainPassword = newPassword;
        user.password = currentPassword;        
        
        return await this.userRepository.save(user);
    }

    /**
     * Delete user service
     * 
     * @param {number} id 
     * @return {Promise<any>}
     */
    public async deleteNote(id: number): Promise<any> {
        this.logger.log('Delete user: ' + id);

        return await this.userRepository.delete(id)
    }
}
