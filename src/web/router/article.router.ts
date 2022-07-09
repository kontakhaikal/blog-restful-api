import { Router } from 'express';
import ArticleController from '../controller/article.controller';
import CommentController from '../controller/comment.controller';
import ReplyController from '../controller/reply.controller';

export default class ArticleRouter {
    private readonly router: Router;
    constructor(
        private readonly articleController: ArticleController,
        private readonly commentController: CommentController,
        private readonly replyController: ReplyController,
    ) {
        this.router = Router();
        this.setArticleRouter();
        this.setCommentRouter();
        this.setReplyRouter();
    }

    private setArticleRouter() {
        this.router.get('/api/v1/articles', this.articleController.getList);
        this.router.post('/api/v1/articles', this.articleController.create);
        this.router.get('/api/v1/articles/:id', this.articleController.getDetail);
        this.router.delete('/api/v1/articles/:id', this.articleController.delete);
        this.router.put('/api/v1/articles/:id', this.articleController.update);
    }

    private setCommentRouter() {
        this.router.get('/api/v1/articles/:articleId/comments', this.commentController.getList);
        this.router.post('/api/v1/articles/:articleId/comments', this.commentController.create);
        this.router.delete('/api/v1/articles/:articleId/comments/:commentId', this.commentController.delete);
        this.router.put('/api/v1/articles/:articleId/comments/:commentId', this.commentController.update);
    }

    private setReplyRouter() {
        this.router.get('/api/v1/articles/:articleId/comments/:commentId/replies', this.replyController.getList);
        this.router.post('/api/v1/articles/:articleId/comments/:commentId/replies', this.replyController.create);
        this.router.delete('/api/v1/articles/:articleId/comments/:commentId/replies/:replyId', this.replyController.delete);
        this.router.put('/api/v1/articles/:articleId/comments/:commentId/replies/:replyId', this.replyController.update);
    }

    get routes() {
        return this.router;
    }
}
