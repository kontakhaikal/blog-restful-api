import article from '../../domain/entity/article';
import { Status } from '../../domain/entity/content';
import ArticleRepository from '../../domain/repository/article.repository';
import logger from '../../utils/logger';
import MongoDatabase from '../connection/mongo.database';
import { ArticleDocument, CommentDocument, ReplyDocument } from './mongo-documents';

export default class MongoArticleRepository implements ArticleRepository {
    constructor(private readonly mongoDb: MongoDatabase) {}

    async getOneByIdAndStatus(id: string, status: Status): Promise<article | null> {
        return this.articles.then(c => c.findOne({ id, status }, { projection: { _id: 0 } })) as unknown as article | null;
    }

    async getManyByStatusWithOptionalSlug(status: Status, page: number, perPage: number, slug?: string): Promise<article[]> {
        return this.articles
            .then(c => c.find({ status, ...(slug ? { slug } : {}) }, { projection: { _id: 0 } }))
            .then(c => c.sort('id', -1))
            .then(r => r.skip((page - 1) * perPage))
            .then(r => r.limit(perPage))
            .then(r => r.toArray()) as unknown as article[];
    }

    async deleteOne(id: string): Promise<boolean> {
        const session = await this.mongoDb.getClientSession();
        try {
            session.startTransaction();
            const deleteArticleResult = await this.articles.then(c => c.deleteOne({ id }));
            const deleteCommentsResult = await this.comments.then(c => c.deleteMany({ articleId: id }));
            const deleteRepliesResult = await this.replies.then(c => c.deleteMany({ articleId: id }));
            await session.commitTransaction();
            return (
                deleteArticleResult.acknowledged &&
                deleteArticleResult.deletedCount === 1 &&
                deleteCommentsResult.acknowledged &&
                deleteRepliesResult.acknowledged
            );
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);
            }
            await session.abortTransaction();
            return false;
        }
    }

    async updateOne(props: article): Promise<boolean> {
        const updatedResult = await this.articles.then(c => c.updateOne({ id: props.id }, { $set: props }));
        return updatedResult.acknowledged && updatedResult.modifiedCount === 1;
    }

    async getOneById(id: string): Promise<article | null> {
        return this.articles.then(c => c.findOne({ id }, { projection: { _id: 0 } })) as unknown as article | null;
    }

    async getOneBySlug(slug: string): Promise<article | null> {
        return this.articles.then(c => c.findOne({ slug }, { projection: { _id: 0 } })) as unknown as article | null;
    }

    async getOneByTitle(title: string): Promise<article | null> {
        return this.articles.then(c => c.findOne({ title }, { projection: { _id: 0 } })) as unknown as article | null;
    }

    async saveOne(props: article): Promise<boolean> {
        const insertResult = await this.articles.then(c => c.insertOne(props));
        return insertResult.acknowledged && !!insertResult.insertedId;
    }

    private get articles() {
        return this.mongoDb.getDatabase().then(db => db.collection<ArticleDocument>('articles'));
    }

    private get comments() {
        return this.mongoDb.getDatabase().then(db => db.collection<CommentDocument>('comments'));
    }

    private get replies() {
        return this.mongoDb.getDatabase().then(db => db.collection<ReplyDocument>('replies'));
    }
}
