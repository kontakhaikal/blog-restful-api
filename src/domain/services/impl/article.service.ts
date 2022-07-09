import Article, { ArticleProps, CreateArticle, UpdateArticle } from '../../entity/article';
import { DeleteEntity, GetEntity, RequestDTO, ResponseDTO } from '../../dto';
import { AddArticle, ChangeArticle } from '../../dto/article.dto';
import ArticleRepository from '../../repository/article.repository';
import BaseService, { AuthLevel } from './base.service';
import { CreateEntityValidator, UpdateEntityValidator } from '../../validator';
import ArticleValidator from '../../validator/article.validator';
import { Status } from '../../entity/content';
import { Role } from '../../entity/user';
import NotFoundError from '../../error/not-found.error';
import IArticleService from '../article.service';
import CategoryRepository from '../../repository/category.repository';
import { parsePaginationRequest } from '../../helper/pagination-request-parser';

export default class ArticleService extends BaseService implements IArticleService {
    private readonly articleValidator: CreateEntityValidator<CreateArticle> & UpdateEntityValidator<ArticleProps, UpdateArticle>;
    constructor(private readonly articleRepository: ArticleRepository, private readonly categoryRepository: CategoryRepository) {
        super();
        this.articleValidator = new ArticleValidator(articleRepository);
    }

    async getArticleList(request: {
        readonly page: unknown;
        readonly perPage: unknown;
        readonly status: unknown;
        readonly slug: unknown;
        readonly userCredentials: { readonly id: unknown; readonly name: unknown; readonly role: unknown };
    }): Promise<ResponseDTO<ArticleProps[]>> {
        const { status, page, perPage } = parsePaginationRequest({ ...request, page: request.page ?? '1', perPage: request.perPage ?? '5' });
        const articleList = await this.articleRepository.getManyByStatusWithOptionalSlug(
            status,
            page,
            perPage,
            typeof request.slug !== 'string' ? undefined : request.slug,
        );
        return {
            success: true,
            message: 'articles founded',
            data: articleList,
        };
    }

    async getArticle(request: RequestDTO<GetEntity>): Promise<ResponseDTO<ArticleProps>> {
        const articleProps = await this.getProps(request.id, this.articleRepository, { errorMessage: 'article not found' });
        if (articleProps.status === Status.DRAFT && request.userCredentials.role !== Role.ADMIN) {
            throw new NotFoundError('article not found');
        }
        return {
            success: true,
            message: 'article founded',
            data: articleProps,
        };
    }

    async addArticle(request: RequestDTO<AddArticle>): Promise<ResponseDTO> {
        this.validateAuthorization(request.userCredentials, { authLevel: AuthLevel.ADMIN, errorMessage: 'unauthorized to add article' });
        const category: { id: unknown; name: unknown } = { id: request.payload.categoryId, name: undefined };
        if (typeof request.payload.categoryId === 'string') {
            const categoryProps = await this.categoryRepository.getOneById(request.payload.categoryId);
            category.name = categoryProps?.name;
        }
        const article = await Article.create({ ...request.payload, category }, this.articleValidator);
        const success = await this.articleRepository.saveOne(article);
        return {
            success,
            message: success ? 'article added' : 'failed to add article',
        };
    }

    async changeArticle(request: RequestDTO<ChangeArticle>): Promise<ResponseDTO> {
        this.validateAuthorization(request.userCredentials, { authLevel: AuthLevel.ADMIN, errorMessage: 'unauthorized to change article' });
        const articleProps = await this.getProps(request.id, this.articleRepository, { errorMessage: 'article not found' });
        const updatedArticle = await Article.update(articleProps, request.payload, this.articleValidator);
        const success = await this.articleRepository.updateOne(updatedArticle);
        return {
            success,
            message: success ? 'article changed' : 'failed to change article',
        };
    }

    async deleteArticle(request: RequestDTO<DeleteEntity>): Promise<ResponseDTO> {
        this.validateAuthorization(request.userCredentials, { authLevel: AuthLevel.ADMIN, errorMessage: 'unauthorized to delete article' });
        const articleProps = await this.getProps(request.id, this.articleRepository, { errorMessage: 'article not found' });
        const success = await this.articleRepository.deleteOne(articleProps.id);
        return {
            success,
            message: success ? 'article deleted' : 'failed to delete article',
        };
    }
}
