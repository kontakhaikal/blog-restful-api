import { Request, Response } from 'express';
import IUserService from '../../domain/services/user.service';
import BaseController from './base.controller';

export default class AdminController extends BaseController {
    constructor(private readonly userService: IUserService) {
        super();
    }

    create = async (req: Request, res: Response) => {
        return this.executeCommand(res, req.body, this.userService.register.bind(this.userService));
    };
}
