import { UserCredentials } from '../entity/user';

export type RequestDTO<T> = T extends object
    ? {
          readonly [P in keyof T]: RequestDTO<T[P]>;
      }
    : unknown;

export type ResponseDTO<T = undefined> = Readonly<{
    success: boolean;
    message: string;
    data?: Readonly<T>;
}>;

export type GetEntity = {
    id: string;
    userCredentials: UserCredentials;
};

export type DeleteEntity = {
    id: string;
    userCredentials: UserCredentials;
};
