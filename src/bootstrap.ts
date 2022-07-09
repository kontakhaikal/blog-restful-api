import ArticleService from './domain/services/impl/article.service';
import MongoDatabase from './persistence/connection/mongo.database';
import MongoArticleRepository from './persistence/mongo-repository/mongo.article.repository';
import ArticleController from './web/controller/article.controller';
import ArticleRouter from './web/router/article.router';
import ExpressApplication from './web/app';
import UserRouter from './web/router/user.router';
import UserController from './web/controller/user.controller';
import MongoUserRepository from './persistence/mongo-repository/mongo.user.repository';
import UserService from './domain/services/impl/user.service';
import AdminRouter from './web/router/admin.router';
import AdminController from './web/controller/admin.controller';
import AdminService from './domain/services/impl/admin.service';
import ProjectRouter from './web/router/project.router';
import ProjectService from './domain/services/impl/project.service';
import ProjectController from './web/controller/project.controller';
import MongoProjectRepository from './persistence/mongo-repository/mongo.project.repository';
import CommentController from './web/controller/comment.controller';
import CommentService from './domain/services/impl/comment.service';
import MongoCommentRepository from './persistence/mongo-repository/mongo.comment.repository';
import CategoryRouter from './web/router/category.router';
import CategoryController from './web/controller/category.controller';
import CategoryService from './domain/services/impl/category.service';
import MongoCategoryRepository from './persistence/mongo-repository/mongo.category.repository';
import ReplyController from './web/controller/reply.controller';
import ReplyService from './domain/services/impl/reply.service';
import MongoReplyRepository from './persistence/mongo-repository/mongo.reply.repository';
import SessionRouter from './web/router/session.router';
import SessionController from './web/controller/session.controller';
import SessionService from './domain/services/impl/session.service';

/**
 * Persistence layer
 */

const mongoDatabase = new MongoDatabase();
const mongoArticleRepository = new MongoArticleRepository(mongoDatabase);
const mongoUserRepository = new MongoUserRepository(mongoDatabase);
const mongoProjectRepository = new MongoProjectRepository(mongoDatabase);
const mongoCommentRepository = new MongoCommentRepository(mongoDatabase);
const mongoCategoryRepository = new MongoCategoryRepository(mongoDatabase);
const mongoReplyRepository = new MongoReplyRepository(mongoDatabase);

/**
 * Domain layer
 */

const articleService = new ArticleService(mongoArticleRepository, mongoCategoryRepository);
const userService = new UserService(mongoUserRepository);
const adminService = new AdminService(mongoUserRepository);
const projectService = new ProjectService(mongoProjectRepository);
const commentService = new CommentService(mongoArticleRepository, mongoCommentRepository);
const categoryService = new CategoryService(mongoCategoryRepository);
const replyService = new ReplyService(mongoReplyRepository, mongoCommentRepository);
const sessionService = new SessionService(mongoUserRepository);

/**
 * Presentation Layer
 */

const articleController = new ArticleController(articleService);
const adminController = new AdminController(adminService);
const userController = new UserController(userService);
const commentController = new CommentController(commentService);
const projectController = new ProjectController(projectService);
const categoryController = new CategoryController(categoryService);
const replyController = new ReplyController(replyService);
const sessionController = new SessionController(sessionService);

const articleRouter = new ArticleRouter(articleController, commentController, replyController);
const adminRouter = new AdminRouter(adminController);
const userRouter = new UserRouter(userController);
const projectRouter = new ProjectRouter(projectController);
const categoryRouter = new CategoryRouter(categoryController);
const sessionRouter = new SessionRouter(sessionController);

const app = new ExpressApplication(mongoDatabase, articleRouter, userRouter, adminRouter, projectRouter, categoryRouter, sessionRouter);

app.run();
