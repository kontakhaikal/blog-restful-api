import { CreateEntityValidator, UpdateEntityValidator } from '.';
import { CreateUser, UpdateUser, UserProps } from '../entity/user';
import { Payload } from '../entity/entity';
import UserRepository from '../repository/user.repository';
import BaseValidator from './base.validator';

export default class UserValidator extends BaseValidator implements CreateEntityValidator<CreateUser>, UpdateEntityValidator<UserProps, UpdateUser> {
    constructor(private readonly userRepository: UserRepository) {
        super();
    }
    async validateBeforeCreate(payload: Payload<CreateUser>): Promise<void> {
        await this.validateUser(payload);
    }

    async validateBeforeUpdate(props: UserProps, payload: Payload<UpdateUser>): Promise<void> {
        const checkDuplicateEmail = props.email !== payload.email;
        await this.validateUser(payload, checkDuplicateEmail);
    }

    private async validateUser(payload: Payload<CreateUser | UpdateUser>, checkDuplicateEmail: boolean = true): Promise<void> {
        this.throwErrorWhenInvalid([
            this.validateName(payload.name),
            await this.validateEmail(payload.email, { checkDuplicate: checkDuplicateEmail }),
            this.validatePassword(payload.password),
        ]);
    }

    private validateName(name: unknown): string | void {
        if (!name) {
            return 'name is required';
        }
        if (typeof name !== 'string') {
            return 'name must be a string';
        }
        if (name.trim().length > 30) {
            return 'name is too long. Max 30 characters';
        }
    }

    private async validateEmail(email: unknown, options: { checkDuplicate: boolean }): Promise<string | void> {
        if (!email) {
            return 'email is required';
        }
        if (typeof email !== 'string') {
            return 'email must be a string';
        }
        if (/[]/.test(email)) {
            return 'email is not valid';
        }
        if (options.checkDuplicate) {
            return this.checkDuplicateEmail(email);
        }
    }

    private validatePassword(password: unknown): string | void {
        if (!password) {
            return 'password is required';
        }
        if (typeof password !== 'string') {
            return 'password must be a string';
        }
    }

    private async checkDuplicateEmail(email: string): Promise<string | void> {
        const existedUser = await this.userRepository.getOneByEmail(email);
        if (existedUser) {
            return 'email is already in use';
        }
    }
}
