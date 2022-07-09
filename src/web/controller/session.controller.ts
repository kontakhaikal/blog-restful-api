import { Request, Response } from 'express';
import ISessionService from '../../domain/services/session.service';

import BaseController from './base.controller';

export default class SessionController extends BaseController {
    constructor(private readonly sessionService: ISessionService) {
        super();
    }
    create = async (req: Request, res: Response) => {
        return this.executeCommand(res, req.body, this.sessionService.createSession.bind(this.sessionService));
    };
}
