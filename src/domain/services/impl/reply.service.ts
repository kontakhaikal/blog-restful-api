import { RequestDTO, ResponseDTO } from '../../dto';
import { AddAReply, ChangeReply, DeleteReply } from '../../dto/reply.dto';
import Reply, { CreateReply, ReplyProps, UpdateReply } from '../../entity/reply';
import { Role } from '../../entity/user';
import AuthorizationError from '../../error/authorization.error';
import NotFoundError from '../../error/not-found.error';
import { parseCursorPaginationRequest } from '../../helper/pagination-request-parser';
import CommentRepository from '../../repository/comment.repository';
import ReplyRepository from '../../repository/reply.repository';
import { CreateEntityValidator, UpdateEntityValidator } from '../../validator';
import ReplyValidator from '../../validator/reply.validator';
import IReplyService from '../reply.service';
import BaseService, { AuthLevel } from './base.service';

export default class ReplyService extends BaseService implements IReplyService {
    private readonly replyValidator: CreateEntityValidator<CreateReply> & UpdateEntityValidator<ReplyProps, UpdateReply>;
    constructor(private readonly replyRepository: ReplyRepository, private readonly commentRepository: CommentRepository) {
        super();
        this.replyValidator = new ReplyValidator();
    }

    async getReplyList(request: {
        readonly articleId: unknown;
        readonly commentId: unknown;
        readonly nextCursor: unknown;
        readonly limit: unknown;
        readonly userCredentials: { readonly id: unknown; readonly name: unknown; readonly role: unknown };
    }): Promise<Readonly<{ success: boolean; message: string; data?: readonly Reply[] }>> {
        const commentProps = await this.getCommentProps(request.articleId, request.commentId);
        const [nextCursor, limit] = parseCursorPaginationRequest({ nextCursor: request.nextCursor, limit: request.limit ?? '5' });
        const replyList = await this.replyRepository.getManyByArticleIdAndCommentId(commentProps.articleId, commentProps.id, nextCursor, limit);
        return {
            success: true,
            message: 'replies founded',
            data: replyList,
        };
    }

    async addReply(request: RequestDTO<AddAReply>): Promise<ResponseDTO> {
        this.validateAuthorization(request.userCredentials, { authLevel: AuthLevel.USER, errorMessage: 'authorized to add reply' });
        const commentProps = await this.getCommentProps(request.articleId, request.commentId);
        const reply = await Reply.create(
            {
                articleId: commentProps.articleId,
                body: request.body,
                commentId: commentProps.id,
                user: { id: request.userCredentials.id, name: request.userCredentials.name },
            },
            this.replyValidator,
        );
        const success = await this.replyRepository.saveOne(reply);
        return {
            success,
            message: success ? 'reply added' : 'failed to add reply',
        };
    }

    async deleteReply(request: RequestDTO<DeleteReply>): Promise<ResponseDTO> {
        this.validateAuthorization(request.userCredentials, { authLevel: AuthLevel.USER, errorMessage: 'authorized to delete reply' });
        const replyProps = await this.getReplyProps(request.articleId, request.commentId, request.replyId);
        if (request.userCredentials.role !== Role.ADMIN && replyProps.user.id !== request.userCredentials.id) {
            throw new AuthorizationError('unauthorized to delete reply');
        }
        const success = await this.replyRepository.deleteOne(replyProps.id);
        return {
            success,
            message: success ? 'reply deleted' : 'failed to delete reply',
        };
    }

    async changeReply(request: RequestDTO<ChangeReply>): Promise<ResponseDTO> {
        this.validateAuthorization(request.userCredentials, { authLevel: AuthLevel.USER, errorMessage: 'authorized to update reply' });
        const replyProps = await this.getReplyProps(request.articleId, request.commentId, request.replyId);
        if (replyProps.user.id !== request.userCredentials.id) {
            throw new AuthorizationError('unauthorized to change reply');
        }
        const updatedReply = await Reply.update(replyProps, { body: request.body }, this.replyValidator);
        const success = await this.replyRepository.updateOne(updatedReply);
        return {
            success,
            message: success ? 'reply changed' : 'failed to change reply',
        };
    }

    private async getReplyProps(articleId: unknown, commentId: unknown, id: unknown) {
        if (typeof articleId !== 'string' || typeof commentId !== 'string' || typeof id !== 'string') {
            throw new NotFoundError('reply not found');
        }
        const replyProps = await this.replyRepository.getOneById(articleId, commentId, id);
        if (!replyProps) {
            throw new NotFoundError('reply not found');
        }
        return replyProps;
    }

    private async getCommentProps(articleId: unknown, commentId: unknown) {
        if (typeof articleId !== 'string' || typeof commentId !== 'string') {
            throw new NotFoundError('comment not found');
        }
        const commentProps = await this.commentRepository.getOneById(articleId, commentId);
        if (!commentProps) {
            throw new NotFoundError('comment not found');
        }
        return commentProps;
    }
}
