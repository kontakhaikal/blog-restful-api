import { Request, Response } from 'express';
import ICommnetService from '../../domain/services/comment.service';
import { parseCredentialsFromBearerToken } from '../helper/bearer-token';
import BaseController from './base.controller';

export default class CommentController extends BaseController {
    constructor(private readonly commentService: ICommnetService) {
        super();
    }

    getList = async (req: Request, res: Response) => {
        const requestDTO = {
            articleId: req.params['articleId'],
            nextCursor: req.query['next-cursor'],
            limit: req.query['limit'],
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeQuery(res, requestDTO, this.commentService.getCommentList.bind(this.commentService));
    };

    update = async (req: Request, res: Response) => {
        const requestDTO = {
            articleId: req.params['articleId'],
            commentId: req.params['commendId'],
            body: req.body['body'],
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeCommand(res, requestDTO, this.commentService.changeComment.bind(this.commentService));
    };

    create = async (req: Request, res: Response) => {
        const requestDTO = {
            articleId: req.params['articleId'],
            body: req.body['body'],
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeCommand(res, requestDTO, this.commentService.addComment.bind(this.commentService));
    };

    delete = async (req: Request, res: Response) => {
        const requestDTO = {
            articleId: req.params['articleId'],
            commentId: req.params['commentId'],
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeCommand(res, requestDTO, this.commentService.deleteComment.bind(this.commentService));
    };
}
