import { Request, Response } from 'express';
import ICategoryService from '../../domain/services/category.service';
import { parseCredentialsFromBearerToken } from '../helper/bearer-token';
import BaseController from './base.controller';

export default class CategoryController extends BaseController {
    constructor(private readonly categoryService: ICategoryService) {
        super();
    }

    getList = async (_req: Request, res: Response) => {
        const response = await this.categoryService.getCategoryList();
        return res.json(response.data);
    };

    update = async (req: Request, res: Response) => {
        const requestDTO = {
            id: req.params['id'],
            payload: req.body,
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeCommand(res, requestDTO, this.categoryService.changeCategory.bind(this.categoryService));
    };

    create = async (req: Request, res: Response) => {
        const requestDTO = {
            payload: req.body,
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeCommand(res, requestDTO, this.categoryService.addCategory.bind(this.categoryService));
    };

    delete = async (req: Request, res: Response) => {
        const requestDTO = {
            id: req.params['id'],
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeCommand(res, requestDTO, this.categoryService.deleteCategory.bind(this.categoryService));
    };
}
