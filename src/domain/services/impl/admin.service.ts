import User, { Role } from '../../entity/user';
import { RequestDTO, ResponseDTO } from '../../dto';
import { UserRegister } from '../../dto/user.dto';
import UserService from './user.service';
import OperationError from '../../error/operation.error';
import { hash } from '../../helper/password-hasher';

export default class AdminService extends UserService {
    override async register(request: RequestDTO<UserRegister>): Promise<ResponseDTO> {
        const userList = await this.userRepository.getManyByRole(Role.ADMIN);
        if (userList.length > 0) {
            throw new OperationError('admin already exist');
        }
        const user = await User.create({ ...request, role: Role.ADMIN }, this.userValidator);
        const success = await this.userRepository.saveOne({ ...user, password: await hash(user.password) });
        return {
            success,
            message: success ? 'admin registration success' : 'admin registration failed',
        };
    }
}
