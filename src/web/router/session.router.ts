import { Router } from 'express';
import SessionController from '../controller/session.controller';

export default class SessionRouter {
    private readonly router: Router;
    constructor(private readonly sessionController: SessionController) {
        this.router = Router();
        this.setSessionRouter();
    }

    private setSessionRouter() {
        this.router.post('/api/v1/sessions', this.sessionController.create);
    }

    get routes() {
        return this.router;
    }
}
