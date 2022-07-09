import user, { Role } from '../../domain/entity/user';
import UserRepository, { UserList } from '../../domain/repository/user.repository';
import logger from '../../utils/logger';
import MongoDatabase from '../connection/mongo.database';
import { CommentDocument, ReplyDocument, UserDocument } from './mongo-documents';

export default class MongoUserRepository implements UserRepository {
    constructor(private readonly mongodb: MongoDatabase) {}

    async deleteOne(id: string): Promise<boolean> {
        const session = await this.mongodb.getClientSession();
        try {
            session.startTransaction();
            const deleteUserResult = await this.users.then(c => c.deleteOne({ id }));
            const deleteCommentsResult = await this.comments.then(c => c.deleteMany({ 'user.id': id }));
            const deleteRepliesResult = await this.replies.then(c => c.deleteMany({ 'user.id': id }));
            await session.commitTransaction();
            return (
                deleteUserResult.acknowledged &&
                deleteUserResult.deletedCount === 1 &&
                deleteCommentsResult.acknowledged &&
                deleteRepliesResult.acknowledged
            );
        } catch (error) {
            await session.abortTransaction();
            if (error instanceof Error) {
                logger.error(error.message);
            }
            return false;
        }
    }

    async getOneByEmail(email: string): Promise<user | null> {
        return this.users.then(u => u.findOne({ email }, { projection: { _id: 0 } })) as unknown as user | null;
    }

    async getOneById(id: string): Promise<user | null> {
        return this.users.then(u => u.findOne({ id }, { projection: { _id: 0 } })) as unknown as user | null;
    }

    async saveOne(props: user): Promise<boolean> {
        const insertResult = await this.users.then(u => u.insertOne(props));
        return insertResult.acknowledged && !!insertResult.insertedId;
    }

    async updateOne(props: user): Promise<boolean> {
        const session = await this.mongodb.getClientSession();
        try {
            session.startTransaction();
            const updateUserResult = await this.users.then(u => u.updateOne({ id: props.id }, { $set: props }));
            const updateCommentsResult = await this.comments.then(c =>
                c.updateMany({ 'user.name': props.name }, { $set: { 'user.name': props.name } }),
            );
            const updateRepliesResult = await this.replies.then(c =>
                c.updateMany({ 'user.name': props.name }, { $set: { 'user.name': props.name } }),
            );
            await session.commitTransaction();
            return (
                updateUserResult.acknowledged &&
                updateUserResult.modifiedCount === 1 &&
                updateCommentsResult.acknowledged &&
                updateRepliesResult.acknowledged
            );
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);
            }
            await session.abortTransaction();
            return false;
        }
    }

    async getManyByRole(role: Role): Promise<UserList> {
        return this.users.then(u => u.find({ role })).then(r => r.toArray()) as unknown as UserList;
    }

    get users() {
        return this.mongodb.getDatabase().then(db => db.collection<UserDocument>('users'));
    }

    get comments() {
        return this.mongodb.getDatabase().then(db => db.collection<CommentDocument>('comments'));
    }

    get replies() {
        return this.mongodb.getDatabase().then(db => db.collection<ReplyDocument>('replies'));
    }
}
