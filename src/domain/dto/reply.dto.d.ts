import Comment from '../entity/comment';
import Reply, { CreateReply } from '../entity/reply';
import { UserCredentials } from '../entity/user';

export type AddAReply = {
    articleId: string;
    commentId: string;
    body: string;
    userCredentials: UserCredentials;
};

export type ChangeReply = {
    replyId: Reply['id'];
    articleId: string;
    commentId: string;
    body: Reply['body'];
    userCredentials: UserCredentials;
};

export type DeleteReply = {
    replyId: Reply['id'];
    articleId: string;
    commentId: string;
    userCredentials: UserCredentials;
};
