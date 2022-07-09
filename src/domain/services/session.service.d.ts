import { RequestDTO, ResponseDTO } from '../dto';
import { UserLogin } from '../dto/user.dto';
import { UserCredentials } from '../entity/user';

export default interface ISessionService {
    createSession(request: RequestDTO<UserLogin>): Promise<ResponseDTO<UserCredentials>>;
}
