import express, { Express } from 'express';
import helmet from 'helmet';
import ArticleRouter from './router/article.router';
import http from 'http';
import logger from '../utils/logger';
import Database from '../persistence/connection/database';
import UserRouter from './router/user.router';
import AdminRouter from './router/admin.router';
import ProjectRouter from './router/project.router';
import CategoryRouter from './router/category.router';
import SessionRouter from './router/session.router';
import config from '../config';
import cors from 'cors';

export default class ExpressApplication {
    private readonly app: Express;
    private readonly PORT = parseInt(config('PORT'));
    private readonly HOST = config('HOST');
    constructor(
        private readonly database: Database,
        private readonly articleRouter: ArticleRouter,
        private readonly userRouter: UserRouter,
        private readonly adminRouter: AdminRouter,
        private readonly projectRouter: ProjectRouter,
        private readonly categoryRouter: CategoryRouter,
        private readonly sessionRouter: SessionRouter,
    ) {
        this.app = express();
        this.setMiddleware();
        this.setRouter();
    }

    private setRouter() {
        this.app.use(this.adminRouter.routes);
        this.app.use(this.userRouter.routes);
        this.app.use(this.articleRouter.routes);
        this.app.use(this.projectRouter.routes);
        this.app.use(this.categoryRouter.routes);
        this.app.use(this.sessionRouter.routes);
    }

    private setMiddleware() {
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(cors({ origin: config('ACCESS_CONTROL_ALLOW_ORIGIN') }));
        this.app.use(helmet());
    }

    run() {
        const server = http.createServer(this.app);
        server.listen(this.PORT, this.HOST, async () => {
            logger.info('starting application');
            await this.database.connect();
            logger.info('application running on http://' + this.HOST + ':' + this.PORT);
        });
    }
}
