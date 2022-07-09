import CategoryController from '../controller/category.controller';
import { Router } from 'express';

export default class CategoryRouter {
    private readonly router: Router;
    constructor(private readonly categoryController: CategoryController) {
        this.router = Router();
        this.setCategoryRouter();
    }

    private setCategoryRouter() {
        this.router.get('/api/v1/categories', this.categoryController.getList);
        this.router.post('/api/v1/categories', this.categoryController.create);
        this.router.delete('/api/v1/categories/:id', this.categoryController.delete);
        this.router.put('/api/v1/categories/:id', this.categoryController.update);
    }

    get routes() {
        return this.router;
    }
}
