import generateId from '../helper/id-generator';
import { CreateEntityValidator, UpdateEntityValidator } from '../validator';
import Entity, { Payload } from './entity';
import { UserData } from './user';

export type CreateReply = Omit<Reply, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateReply = Omit<Reply, 'id' | 'articleId' | 'commentId' | 'user' | 'createdAt' | 'updatedAt'>;

export type ReplyProps = Reply;

export default class Reply extends Entity {
    private constructor(
        id: string,
        public user: UserData,
        public articleId: string,
        public commentId: string,
        public body: string,
        createdAt: number,
        updatedAt: number,
    ) {
        super(id, createdAt, updatedAt);
    }

    static async create(payload: Payload<CreateReply>, validator: CreateEntityValidator<CreateReply>) {
        await validator.validateBeforeCreate(payload);
        const id = generateId();
        const currentTimeStamp = Date.now();
        return new Reply(
            id,
            payload.user as UserData,
            payload.articleId as string,
            payload.commentId as string,
            payload.body as string,
            currentTimeStamp,
            currentTimeStamp,
        );
    }

    static async update(props: ReplyProps, payload: Payload<UpdateReply>, validator: UpdateEntityValidator<ReplyProps, UpdateReply>) {
        await validator.validateBeforeUpdate(props, payload);
        const currentTimeStamp = Date.now();
        return new Reply(props.id, props.user, props.articleId, props.commentId, payload.body as string, props.createdAt, currentTimeStamp);
    }
}
