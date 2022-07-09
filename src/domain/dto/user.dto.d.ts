import { RequestDTO } from '.';
import User, { UpdateUser, UserCredentials } from '../entity/user';

export type UserLogin = {
    email: string;
    password: string;
};

export type UserRegister = {
    name: string;
    email: string;
    password: string;
};

export type ChangeUser = {
    id: User['id'];
    payload: UpdateUser;
    userCredentials: UserCredentials;
};
