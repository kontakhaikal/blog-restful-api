import generateId from '../helper/id-generator';
import { CreateEntityValidator, UpdateEntityValidator } from '../validator';
import Entity, { Payload } from './entity';

export type CreateUser = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateUser = Omit<User, 'id' | 'role' | 'createdAt' | 'updatedAt'>;

export type UserProps = User;

export type UserCredentials = {
    id: User['id'];
    name: User['name'];
    role: User['role'];
};

export type UserData = Omit<UserCredentials, 'role'>;

export enum Role {
    ADMIN = 'admin',
    USER = 'user',
}

export default class User extends Entity {
    private constructor(
        id: string,
        public name: string,
        public email: string,
        public password: string,
        public role: Role,
        createdAt: number,
        updatedAt: number,
    ) {
        super(id, createdAt, updatedAt);
    }

    static async create(payload: Payload<CreateUser>, validator: CreateEntityValidator<CreateUser>) {
        await validator.validateBeforeCreate(payload);
        const id = generateId();
        const currentTimeStamp = Date.now();
        return new User(
            id,
            payload.name as string,
            payload.email as string,
            payload.password as string,
            payload.role as Role,
            currentTimeStamp,
            currentTimeStamp,
        );
    }

    static async update(props: UserProps, payload: Payload<UpdateUser>, validator: UpdateEntityValidator<UserProps, UpdateUser>) {
        await validator.validateBeforeUpdate(props, payload);
        const updatedAt = Date.now();
        return new User(
            props.id,
            payload.name as string,
            payload.email as string,
            payload.password as string,
            props.role,
            props.createdAt,
            updatedAt,
        );
    }
}
