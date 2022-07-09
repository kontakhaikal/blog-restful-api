import { Router } from 'express';
import ProjectController from '../controller/project.controller';

export default class ProjectRouter {
    private readonly router: Router;
    constructor(private readonly projectController: ProjectController) {
        this.router = Router();
        this.setRoutes();
    }

    private setRoutes() {
        this.router.get('/api/v1/projects', this.projectController.getList);
        this.router.post('/api/v1/projects/', this.projectController.create);
        this.router.put('/api/v1/projects/:id', this.projectController.update);
        this.router.delete('/api/v1/projects/:id', this.projectController.delete);
    }

    get routes() {
        return this.router;
    }
}
