import { Router } from 'express';
import UserController from '../controller/user.controller';

export default class UserRouter {
    private readonly router: Router;
    constructor(private readonly userController: UserController) {
        this.router = Router();
        this.setUserRoute();
    }

    private setUserRoute() {
        this.router.post('/api/v1/users', this.userController.create);
    }

    get routes() {
        return this.router;
    }
}
