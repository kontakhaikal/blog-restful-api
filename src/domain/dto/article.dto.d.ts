import Article, { CreateArticle, UpdateArticle } from '../entity/article';
import { UserCredentials } from '../entity/user';

export type AddArticle = {
    payload: Omit<CreateArticle, 'category'> & { categoryId: string };
    userCredentials: UserCredentials;
};

export type ChangeArticle = {
    id: Article['id'];
    payload: UpdateArticle;
    userCredentials: UserCredentials;
};

export type GetArticleList = {
    page: number;
    perPage: number;
    status: Status;
    userCredentials: UserCredentials;
};
