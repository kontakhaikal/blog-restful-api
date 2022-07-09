import { RequestDTO, ResponseDTO } from '../dto';
import { UserLogin, UserRegister } from '../dto/user.dto';
import { UserCredentials } from '../entity/user';

export default interface IUserService {
    register(request: RequestDTO<UserRegister>): Promise<ResponseDTO>;
}
