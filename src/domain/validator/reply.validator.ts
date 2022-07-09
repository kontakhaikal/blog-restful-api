import { CreateEntityValidator, UpdateEntityValidator } from '.';
import reply, { CreateReply, ReplyProps, UpdateReply } from '../entity/reply';
import ValidationError from '../error/validation.error';

export default class ReplyValidator implements CreateEntityValidator<CreateReply>, UpdateEntityValidator<ReplyProps, UpdateReply> {
    async validateBeforeCreate(payload: {
        readonly user: { readonly id: unknown; readonly name: unknown };
        readonly commentId: unknown;
        readonly body: unknown;
    }): Promise<void> {
        this.valdiateBody(payload.body);
    }

    async validateBeforeUpdate(_props: reply, payload: { readonly articleId: unknown; readonly body: unknown }): Promise<void> {
        this.valdiateBody(payload.body);
    }

    private valdiateBody(body: unknown): void {
        if (!body) {
            throw new ValidationError('body is required');
        }
        if (typeof body !== 'string') {
            throw new ValidationError('body must be a string');
        }
        if (body.trim().length > 1000) {
            throw new ValidationError('body is too long. Max 1.000 characters');
        }
    }
}
