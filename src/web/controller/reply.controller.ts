import { Request, Response } from 'express';
import IReplyService from '../../domain/services/reply.service';
import { parseCredentialsFromBearerToken } from '../helper/bearer-token';
import BaseController from './base.controller';

export default class ReplyController extends BaseController {
    constructor(private readonly replyService: IReplyService) {
        super();
    }

    getList = async (req: Request, res: Response) => {
        const requestDTO = {
            articleId: req.params['articleId'],
            commentId: req.params['commentId'],
            nextCursor: req.query['next-cursor'],
            limit: req.query['limit'],
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeQuery(res, requestDTO, this.replyService.getReplyList.bind(this.replyService));
    };

    create = async (req: Request, res: Response) => {
        const requestDTO = {
            articleId: req.params['articleId'],
            commentId: req.params['commentId'],
            body: req.body['body'],
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeCommand(res, requestDTO, this.replyService.addReply.bind(this.replyService));
    };

    delete = async (req: Request, res: Response) => {
        const { articleId, commentId, replyId } = req.params;
        const requestDTO = {
            articleId,
            commentId,
            replyId,
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeCommand(res, requestDTO, this.replyService.deleteReply.bind(this.replyService));
    };

    update = async (req: Request, res: Response) => {
        const { articleId, commentId, replyId } = req.params;
        const requestDTO = {
            articleId,
            commentId,
            replyId,
            body: req.body['body'],
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeCommand(res, requestDTO, this.replyService.deleteReply.bind(this.replyService));
    };
}
