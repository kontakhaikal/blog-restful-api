import { ReplyProps } from '../../domain/entity/reply';
import ReplyRepository from '../../domain/repository/reply.repository';
import MongoDatabase from '../connection/mongo.database';
import { ReplyDocument } from './mongo-documents';

export default class MongoReplyRepository implements ReplyRepository {
    constructor(private readonly mongodb: MongoDatabase) {}

    async getManyByArticleIdAndCommentId(articleId: string, commentId: string, nextCursor: string | undefined, limit: number): Promise<ReplyProps[]> {
        return this.replies
            .then(c => c.find({ articleId, commentId, ...(nextCursor ? { id: { $lt: nextCursor } } : {}) }, { projection: { _id: 0 } }))
            .then(r => r.sort('id', -1))
            .then(r => r.limit(limit))
            .then(r => r.toArray()) as unknown as ReplyProps[];
    }

    async deleteOne(id: string): Promise<boolean> {
        const deleteResult = await this.replies.then(c => c.deleteOne({ id }));
        return deleteResult.acknowledged && deleteResult.deletedCount === 1;
    }

    async getOneById(articleId: string, commentId: string, id: string): Promise<ReplyProps | null> {
        return this.replies.then(c => c.findOne({ id, articleId, commentId }, { projection: { _id: 0 } })) as unknown as ReplyProps | null;
    }

    async saveOne(props: ReplyProps): Promise<boolean> {
        const insertResult = await this.replies.then(c => c.insertOne(props));
        return insertResult.acknowledged && !!insertResult.insertedId;
    }

    async updateOne(props: ReplyProps): Promise<boolean> {
        const updateResult = await this.replies.then(c => c.updateOne({ id: props.id }, { $set: props }));
        return updateResult.acknowledged && updateResult.modifiedCount === 1;
    }

    private get replies() {
        return this.mongodb.getDatabase().then(db => db.collection<ReplyDocument>('replies'));
    }
}
