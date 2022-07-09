import { Payload } from '../../entity/entity';
import { Role, UserCredentials } from '../../entity/user';
import AuthorizationError from '../../error/authorization.error';
import NotFoundError from '../../error/not-found.error';
import BaseRepository from '../../repository/base.repository';

export enum AuthLevel {
    ADMIN,
    USER,
}

export default abstract class BaseService {
    protected validateAuthorization(
        userCredentials: Payload<UserCredentials>,
        options: {
            authLevel: AuthLevel;
            errorMessage: string;
        },
    ) {
        if (typeof userCredentials.id !== 'string') {
            throw new AuthorizationError(options.errorMessage);
        }
        if (typeof userCredentials.name !== 'string') {
            throw new AuthorizationError(options.errorMessage);
        }
        if (options.authLevel === AuthLevel.ADMIN && userCredentials.role !== Role.ADMIN) {
            throw new AuthorizationError(options.errorMessage);
        }
        if (options.authLevel === AuthLevel.USER && userCredentials.role !== Role.ADMIN && userCredentials.role !== Role.USER) {
            throw new AuthorizationError(options.errorMessage);
        }
    }

    protected async getProps<T>(id: unknown, repository: BaseRepository<T>, options?: { errorMessage: string }): Promise<T> {
        if (typeof id !== 'string') {
            throw new NotFoundError(options?.errorMessage ?? 'not found');
        }
        const props = await repository.getOneById(id);
        if (!props) {
            throw new NotFoundError(options?.errorMessage ?? 'not found');
        }
        return props;
    }
}
