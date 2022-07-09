import { RequestDTO, ResponseDTO } from '../../dto';
import { UserRegister } from '../../dto/user.dto';
import User, { CreateUser, Role, UpdateUser, UserProps } from '../../entity/user';
import { hash } from '../../helper/password-hasher';

import UserRepository from '../../repository/user.repository';
import { CreateEntityValidator, UpdateEntityValidator } from '../../validator';
import UserValidator from '../../validator/user.validator';
import BaseService from './base.service';

export default class UserService extends BaseService {
    protected readonly userValidator: CreateEntityValidator<CreateUser> & UpdateEntityValidator<UserProps, UpdateUser>;

    constructor(protected readonly userRepository: UserRepository) {
        super();
        this.userValidator = new UserValidator(userRepository);
    }

    async register(request: RequestDTO<UserRegister>): Promise<ResponseDTO> {
        const user = await User.create({ ...request, role: Role.USER }, this.userValidator);
        const success = await this.userRepository.saveOne({ ...user, password: await hash(user.password) });
        return {
            success,
            message: success ? 'user registration success' : 'user registration failed',
        };
    }
}
