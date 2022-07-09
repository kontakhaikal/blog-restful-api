import category, { CategoryProps } from '../../domain/entity/category';
import CategoryRepository from '../../domain/repository/category.repository';
import logger from '../../utils/logger';
import MongoDatabase from '../connection/mongo.database';
import { ArticleDocument, CategoryDocument, CommentDocument, ReplyDocument } from './mongo-documents';

export default class MongoCategoryRepository implements CategoryRepository {
    constructor(private readonly mongodb: MongoDatabase) {}

    async getMany(): Promise<category[]> {
        return this.categories
            .then(c => c.find({}, { projection: { _id: 0 } }))
            .then(r => r.sort('id', -1))
            .then(r => r.toArray()) as unknown as CategoryProps[];
    }

    async deleteOne(id: string): Promise<boolean> {
        const session = await this.mongodb.getClientSession();
        try {
            session.startTransaction();
            const deleteCategoryResult = await this.categories.then(c => c.deleteOne({ id }));
            const articleIds = await this.articles
                .then(c => c.find({ 'category.id': id }, { projection: { _id: 0, id: 1 } }))
                .then(r => r.toArray())
                .then(r => r.map(r => r.id));
            const deleteArticlesResult = await this.articles.then(c => c.deleteMany({ 'category.id': id }));
            const deleteCommentsResult = await this.comments.then(c => c.deleteMany({ articleId: { $in: articleIds } }));
            const deleteRepliesResult = await this.replies.then(c => c.deleteMany({ articleId: { $in: articleIds } }));
            await session.commitTransaction();
            return (
                deleteCategoryResult.acknowledged &&
                deleteCategoryResult.deletedCount === 1 &&
                deleteArticlesResult.acknowledged &&
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

    async getOneById(id: string): Promise<category | null> {
        return this.categories.then(c => c.findOne({ id }, { projection: { _id: 0 } })) as unknown as category | null;
    }

    async getOneByName(name: string): Promise<category | null> {
        return this.categories.then(c => c.findOne({ name }, { projection: { _id: 0 } })) as unknown as category | null;
    }

    async saveOne(props: category): Promise<boolean> {
        const insertResult = await this.categories.then(c => c.insertOne(props));
        return insertResult.acknowledged && !!insertResult.insertedId;
    }

    async updateOne(props: category): Promise<boolean> {
        const session = await this.mongodb.getClientSession();
        try {
            session.startTransaction();
            const updateCategoryResult = await this.categories.then(c => c.updateOne({ id: props.id }, { $set: props }));
            const updateArticlesResult = await this.articles.then(c =>
                c.updateMany({ 'category.id': props.id }, { $set: { 'category.name': props.name } }),
            );
            await session.commitTransaction();
            return updateCategoryResult.acknowledged && updateCategoryResult.modifiedCount === 1 && updateArticlesResult.acknowledged;
        } catch (error) {
            if (error instanceof Error) {
                logger.error(error.message);
            }
            await session.abortTransaction();
            return false;
        }
    }

    private get categories() {
        return this.mongodb.getDatabase().then(db => db.collection<CategoryDocument>('categories'));
    }

    private get articles() {
        return this.mongodb.getDatabase().then(db => db.collection<ArticleDocument>('articles'));
    }

    private get comments() {
        return this.mongodb.getDatabase().then(db => db.collection<CommentDocument>('comments'));
    }

    private get replies() {
        return this.mongodb.getDatabase().then(db => db.collection<ReplyDocument>('replies'));
    }
}
