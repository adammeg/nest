import * as bcrypt from 'bcrypt-nodejs';
import { Exclude } from 'class-transformer';
import * as crypto from 'crypto';
import { trimEnd } from 'lodash';
import { AfterInsert, AfterUpdate, BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'users' })
export class User {
    public static readonly ROLE_DEFAULT = 'ROLE_USER';
    public static readonly ROLE_SUPER_ADMIN = 'ROLE_SUPER_ADMIN';
    public static readonly ROLE_AUTHOR = 'ROLE_AUTHOR';

    @PrimaryGeneratedColumn()
    public id: number;

    @Column({ name: 'first_name' })
    public firstName: string;

    @Column({ name: 'last_name' })
    public lastName: string;

    @Column({ name: 'email' })
    public email: string;

    @Exclude()
    @Column({ name: 'email_canonical', unique: true })
    public emailCanonical: string;

    @Column({ name: 'username' })
    public username: string;

    @Exclude()
    @Column({ name: 'username_canonical', unique: true })
    public usernameCanonical: string;

    @Exclude()
    public plainPassword: string;

    @Exclude()
    @Column({ name: 'password' })
    public password: string;

    @Column({ name: 'enabled' })
    public enabled: boolean;

    @Column({ name: 'roles', type: 'json' })
    public roles: string[];

    @Exclude()
    @Column({ name: 'confirmation_token', unique: true, nullable: true })
    public confirmationToken: string;

    @Exclude()
    @Column({ name: 'security_key' })
    public securityKey: string;

    @CreateDateColumn({ name: 'created_date' })
    public createdDate;

    public constructor() {
        this.enabled = false;
        this.roles = [User.ROLE_DEFAULT];
    }

    public toString(): string {
        return `${this.firstName} ${this.lastName} (${this.email})`;
    }

    public isPasswordValid(password: string): boolean {
        return this.password && bcrypt.compareSync(password, this.password);
    }

    public addRole(role: string): void {
        if (this.roles.indexOf(role) === -1) {
            this.roles.push(role);
        }
    }

    public isAdmin(roles: string[]): boolean {
        let permission = false;
        roles.forEach(role => {
            if (role === "ROLE_AUTHOR") {
                permission = true
            }
        });
        return permission

    }

    @BeforeInsert()
    public generateConfirmationToken(): void {
        this.confirmationToken = trimEnd(
            crypto.randomBytes(30)
                .toString('base64')
                .replace(/\//g, '_')
                .replace(/\+/g, '-'),
            '=');
    }

    @BeforeInsert()
    public generateSecurityKey(): void {
        this.securityKey = crypto.randomBytes(8).toString('hex');
    }

    @BeforeInsert()
    @BeforeUpdate()
    public hashPassword(): void {
        if (this.plainPassword) {
            this.password = bcrypt.hashSync(this.plainPassword);
        }
    }

    @BeforeInsert()
    @BeforeUpdate()
    public canonicalizeEmail(): void {
        if (this.email) {
            this.emailCanonical = this.email.toLowerCase();
        }
    }

    @BeforeInsert()
    @BeforeUpdate()
    public canonicalizeUsername(): void {
        if (this.username) {
            this.usernameCanonical = this.username.toLowerCase();
        }
    }

    @AfterInsert()
    @AfterUpdate()
    public eraseCredentials(): void {
        this.plainPassword = '';
    }
}