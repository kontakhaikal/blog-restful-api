import { RequestDTO, ResponseDTO } from '../../dto';
import { AddComment, ChangeComment, DeleteComment } from '../../dto/comment';
import Comment, { CommentProps, CreateComment, UpdateComment } from '../../entity/comment';
import AuthorizationError from '../../error/authorization.error';
import NotFoundError from '../../error/not-found.error';
import ArticleRepository from '../../repository/article.repository';
import CommentRepository from '../../repository/comment.repository';
import { CreateEntityValidator, UpdateEntityValidator } from '../../validator';
import CommentValidator from '../../validator/comment.validator';
import ICommentService from '../comment.service';
import BaseService, { AuthLevel } from './base.service';
import { Role } from '../../entity/user';
import { Status } from '../../entity/content';
import { parseCursorPaginationRequest } from '../../helper/pagination-request-parser';

export default class CommentService extends BaseService implements ICommentService {
    private readonly commentValidator: CreateEntityValidator<CreateComment> & UpdateEntityValidator<CommentProps, UpdateComment>;
    constructor(private readonly articleRepository: ArticleRepository, private readonly commentRepository: CommentRepository) {
        super();
        this.commentValidator = new CommentValidator();
    }

    async getCommentList(request: {
        readonly articleId: unknown;
        readonly nextCursor: unknown;
        readonly limit: unknown;
        readonly userCredentials: { readonly id: unknown; readonly name: unknown; readonly role: unknown };
    }): Promise<Readonly<{ success: boolean; message: string; data?: readonly Comment[] }>> {
        const articleProps = await this.getProps(request.articleId, this.articleRepository, { errorMessage: 'article not found' });
        const [nextCursor, limit] = parseCursorPaginationRequest({ nextCursor: request.nextCursor, limit: request.limit ?? '5' });
        const commentProps = await this.commentRepository.getManyByArticleId(articleProps.id, nextCursor, limit);
        return {
            success: true,
            message: 'comments founded',
            data: commentProps,
        };
    }

    async addComment(request: RequestDTO<AddComment>): Promise<ResponseDTO> {
        this.validateAuthorization(request.userCredentials, { authLevel: AuthLevel.USER, errorMessage: 'unauthorized to add comment' });
        if (typeof request.articleId !== 'string') {
            throw new NotFoundError('article not found');
        }
        const articleProps = await this.articleRepository.getOneByIdAndStatus(request.articleId, Status.PUBLISHED);
        if (!articleProps) {
            throw new NotFoundError('article not found');
        }
        const comment = await Comment.create(
            { articleId: articleProps.id, body: request.body, user: { id: request.userCredentials.id, name: request.userCredentials.name } },
            this.commentValidator,
        );
        const success = await this.commentRepository.saveOne(comment);
        return {
            success,
            message: success ? 'comment added' : 'failed to add comment',
        };
    }

    async changeComment(request: RequestDTO<ChangeComment>): Promise<ResponseDTO> {
        this.validateAuthorization(request.userCredentials, { authLevel: AuthLevel.USER, errorMessage: 'unauthorized to change comment' });
        const commentProps = await this.getCommentProps(request.articleId, request.commentId);
        if (commentProps?.user !== request.userCredentials.id) {
            throw new AuthorizationError('unauthorized to change comment');
        }
        const updatedComment = await Comment.update(commentProps, request, this.commentValidator);
        const success = await this.commentRepository.updateOne(updatedComment);
        return {
            success,
            message: success ? 'comment changed' : 'failed to change comment',
        };
    }

    async deleteComment(request: RequestDTO<DeleteComment>): Promise<ResponseDTO> {
        this.validateAuthorization(request.userCredentials, { authLevel: AuthLevel.USER, errorMessage: 'unauthorized to delete comment' });
        const commentProps = await this.getCommentProps(request.articleId, request.commentId);
        if (request.userCredentials.role !== Role.ADMIN && commentProps?.user !== request.userCredentials.id) {
            throw new AuthorizationError('unauthorized to delete comment');
        }
        const success = await this.commentRepository.deleteOne(commentProps.id);
        return {
            success,
            message: success ? 'comment deleted' : 'failed to delete comment',
        };
    }

    private async getCommentProps(articleId: unknown, commentId: unknown) {
        if (typeof commentId !== 'string' || typeof articleId !== 'string') {
            throw new NotFoundError('comment not found');
        }
        const commentProps = await this.commentRepository.getOneById(articleId, commentId);
        if (!commentProps) {
            throw new NotFoundError('comment not found');
        }
        return commentProps;
    }
}
