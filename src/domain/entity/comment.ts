import generateId from '../helper/id-generator';
import { CreateEntityValidator, UpdateEntityValidator } from '../validator';
import { Payload } from './entity';
import { UserData } from './user';

export type CreateComment = Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateComment = Omit<Comment, 'id' | 'user' | 'articleId' | 'createdAt' | 'updatedAt'>;

export type CommentProps = Comment;

export default class Comment {
    constructor(
        public id: string,
        public user: UserData,
        public articleId: string,
        public body: string,
        public createdAt: number,
        public updatedAt: number,
    ) {}

    static async create(payload: Payload<CreateComment>, validator: CreateEntityValidator<CreateComment>) {
        await validator.validateBeforeCreate(payload);
        const id = generateId();
        const currentTimeStamp = Date.now();
        return new Comment(id, payload.user as UserData, payload.articleId as string, payload.body as string, currentTimeStamp, currentTimeStamp);
    }

    static async update(props: CommentProps, payload: Payload<UpdateComment>, validator: UpdateEntityValidator<CommentProps, UpdateComment>) {
        await validator.validateBeforeUpdate(props, payload);
        const currentTimeStamp = Date.now();
        return new Comment(props.id, props.user, props.articleId, payload.body as string, props.createdAt, currentTimeStamp);
    }
}
