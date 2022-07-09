import { Document } from 'mongodb';

interface EntityDocument extends Document {
    id: string;
    createdAt: number;
    updatedAt: number;
}

interface ContentDocument extends EntityDocument {
    title: string;
    slug: string;
    description: string;
    pictureLink: string;
    pictureDescription: string;
    content: string;
    status: string;
}

export interface ArticleDocument extends ContentDocument {
    category: {
        id: CategoryDocument['id'];
        name: CategoryDocument['name'];
    };
}

export interface ProjectDocument extends ContentDocument {}

export interface CommentDocument extends EntityDocument {
    articleId: ArticleDocument['id'];
    body: string;
    user: {
        id: UserDocument['id'];
        name: UserDocument['name'];
    };
}

export interface ReplyDocument extends EntityDocument {
    articleId: ArticleDocument['id'];
    commentId: CommentDocument['id'];
    body: string;
    user: {
        id: UserDocument['id'];
        name: UserDocument['name'];
    };
}

export interface CategoryDocument extends EntityDocument {
    name: string;
    description: string;
}

export interface UserDocument extends EntityDocument {
    name: string;
    email: string;
    password: string;
}
