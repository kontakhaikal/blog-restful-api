import { CreateEntityValidator, UpdateEntityValidator } from '../validator';
import Content, { Status } from './content';
import { Payload } from './entity';
import { CategoryData } from './category';
import generateId from '../helper/id-generator';

export type CreateArticle = Omit<Article, 'id' | 'comments' | 'createdAt' | 'updatedAt'>;

export type UpdateArticle = Omit<Article, 'id' | 'comments' | 'createdAt' | 'updatedAt'>;

export type ArticleProps = Omit<Article, 'none'>;

export default class Article extends Content {
    constructor(
        id: string,
        title: string,
        slug: string,
        description: string,
        pictureLink: string,
        pictureDescription: string,
        public category: CategoryData,
        content: string,
        status: Status,
        createdAt: number,
        updatedAt: number,
    ) {
        super(id, title, slug, description, pictureLink, pictureDescription, content, status, createdAt, updatedAt);
    }
    static async create(payload: Payload<CreateArticle>, validator: CreateEntityValidator<CreateArticle>) {
        await validator.validateBeforeCreate(payload);
        const id = generateId();
        const currentTimeStamp = Date.now();
        return new Article(
            id,
            payload.title as string,
            payload.slug as string,
            payload.description as string,
            payload.pictureLink as string,
            payload.pictureDescription as string,
            payload.category as CategoryData,
            payload.content as string,
            payload.status as Status,
            currentTimeStamp,
            currentTimeStamp,
        );
    }

    static async update(props: ArticleProps, payload: Payload<UpdateArticle>, validator: UpdateEntityValidator<ArticleProps, UpdateArticle>) {
        await validator.validateBeforeUpdate(props, payload);
        const currentTimeStamp = Date.now();
        return new Article(
            props.id,
            payload.title as string,
            payload.slug as string,
            payload.description as string,
            payload.pictureLink as string,
            payload.pictureDescription as string,
            payload.category as CategoryData,
            payload.content as string,
            payload.status as Status,
            props.createdAt,
            currentTimeStamp,
        );
    }
}
