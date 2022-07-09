import { Request, Response } from 'express';
import IArticleService from '../../domain/services/article.service';
import { parseCredentialsFromBearerToken } from '../helper/bearer-token';
import BaseController from './base.controller';

export default class ArticleController extends BaseController {
    constructor(private readonly articleService: IArticleService) {
        super();
    }

    getList = async (req: Request, res: Response) => {
        const requestDTO = {
            slug: req.query['slug'],
            page: req.query['page'],
            perPage: req.query['per-page'],
            status: req.query['status'],
            userCredentials: parseCredentialsFromBearerToken(req.headers.authorization),
        };
        return this.executeQuery(res, requestDTO, this.articleService.getArticleList.bind(this.articleService));
    };

    getDetail = async (req: Request, res: Response) => {
        const requestDTO = {
            id: req.params['id'],
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeQuery(res, requestDTO, this.articleService.getArticle.bind(this.articleService));
    };

    delete = async (req: Request, res: Response) => {
        const requestDTO = {
            id: req.params['id'],
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeCommand(res, requestDTO, this.articleService.deleteArticle.bind(this.articleService));
    };

    update = async (req: Request, res: Response) => {
        const requestDTO = {
            id: req.params['id'],
            payload: req.body,
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeCommand(res, requestDTO, this.articleService.changeArticle.bind(this.articleService));
    };

    create = async (req: Request, res: Response) => {
        const requestDTO = {
            payload: req.body,
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeCommand(res, requestDTO, this.articleService.addArticle.bind(this.articleService));
    };
}
