import Article from '../entity/article';
import Comment, { CreateComment } from '../entity/comment';
import { UserCredentials } from '../entity/user';

export type AddComment = {
    articleId: Article['id'];
    body: Comment['body'];
    userCredentials: UserCredentials;
};

export type ChangeComment = {
    articleId: Article['id'];
    commentId: Comment['id'];
    body: Comment['body'];
    userCredentials: UserCredentials;
};

export type DeleteComment = {
    articleId: Article['id'];
    commentId: Comment['id'];
    userCredentials: UserCredentials;
};
