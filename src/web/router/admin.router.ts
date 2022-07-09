import { Router } from 'express';
import AdminController from '../controller/admin.controller';

export default class AdminRouter {
    private readonly router: Router;
    constructor(private readonly adminController: AdminController) {
        this.router = Router();
        this.setRoute();
    }

    private setRoute() {
        this.router.post('/api/v1/admin', this.adminController.create);
    }

    get routes() {
        return this.router;
    }
}
