import comment from '../../domain/entity/comment';
import CommentRepository from '../../domain/repository/comment.repository';
import logger from '../../utils/logger';
import MongoDatabase from '../connection/mongo.database';
import { CommentDocument, ReplyDocument } from './mongo-documents';

export default class MongoCommentRepository implements CommentRepository {
    constructor(private readonly mongodb: MongoDatabase) {}

    async getManyByArticleId(articleId: string, nextCursor: string | undefined, limit: number): Promise<comment[]> {
        return this.comments
            .then(c => c.find({ articleId, ...(nextCursor ? { id: { $lt: nextCursor } } : {}) }, { projection: { _id: 0 } }))
            .then(r => r.sort('id', -1))
            .then(r => r.limit(limit))
            .then(r => r.toArray()) as unknown as comment[];
    }

    async deleteOne(id: string): Promise<boolean> {
        const session = await this.mongodb.getClientSession();
        try {
            session.startTransaction();
            const deleteCommentResult = await this.comments.then(c => c.deleteOne({ id }));
            const deleteRepliesResult = await this.replies.then(c => c.deleteMany({ commentId: id }));
            await session.commitTransaction();
            return deleteCommentResult.acknowledged && deleteCommentResult.deletedCount === 1 && deleteRepliesResult.acknowledged;
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);
            }
            await session.abortTransaction();
            return false;
        }
    }

    async getOneById(articleId: string, commentId: string): Promise<comment | null> {
        return this.comments.then(c => c.findOne({ id: commentId, articleId }, { projection: { _id: 0 } })) as unknown as comment | null;
    }

    async saveOne(props: comment): Promise<boolean> {
        const insertResult = await this.comments.then(c => c.insertOne(props));
        return insertResult.acknowledged && !!insertResult.insertedId;
    }

    async updateOne(props: comment): Promise<boolean> {
        const updateResult = await this.comments.then(c => c.updateOne({ id: props.id, articleId: props.articleId }, { $set: props }));
        return updateResult.acknowledged && updateResult.modifiedCount === 1;
    }

    private get comments() {
        return this.mongodb.getDatabase().then(db => db.collection<CommentDocument>('comments'));
    }

    private get replies() {
        return this.mongodb.getDatabase().then(db => db.collection<ReplyDocument>('replies'));
    }
}
