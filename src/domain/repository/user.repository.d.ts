import User, { Role } from '../entity/user';
import BaseRepository from './base.repository';

export type UserProps = User;

export type UserList = Pick<User, 'id'>[];

export default interface UserRepository extends BaseRepository<UserProps> {
    getManyByRole(role: Role): Promise<UserList>;
    getOneByEmail(email: string): Promise<UserProps | null>;
}
