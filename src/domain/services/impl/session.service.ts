import { RequestDTO, ResponseDTO } from '../../dto';
import { UserLogin } from '../../dto/user.dto';
import { UserCredentials } from '../../entity/user';
import AuthenticationError from '../../error/authentication.error';
import { compare } from '../../helper/password-hasher';
import UserRepository from '../../repository/user.repository';
import ISessionService from '../session.service';

export default class SessionService implements ISessionService {
    constructor(protected readonly userRepository: UserRepository) {}

    async createSession(request: RequestDTO<UserLogin>): Promise<ResponseDTO<UserCredentials>> {
        this.validatePayload(request);
        const userProps = await this.userRepository.getOneByEmail(request.email as string);
        if (!userProps) {
            throw new AuthenticationError('invalid credentials');
        }
        const isPasswordMatch = await compare(request.password as string, userProps.password);
        if (!isPasswordMatch) {
            throw new AuthenticationError('invalid credentials');
        }
        return {
            success: true,
            message: 'login success',
            data: {
                id: userProps.id,
                name: userProps.name,
                role: userProps.role,
            },
        };
    }

    private validatePayload(request: { readonly email: unknown; readonly password: unknown }) {
        if (typeof request.password !== 'string') {
            throw new AuthenticationError('invalid credentials');
        }
        if (request.password.trim().length === 0) {
            throw new AuthenticationError('invalid credentials');
        }
        if (typeof request.email !== 'string') {
            throw new AuthenticationError('invalid credentials');
        }

        if (request.email.trim().length === 0) {
            throw new AuthenticationError('invalid credentials');
        }
    }
}
