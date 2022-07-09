import { CreateEntityValidator, UpdateEntityValidator } from '.';
import comment, { CommentProps, CreateComment, UpdateComment } from '../entity/comment';
import { Payload } from '../entity/entity';
import ValidationError from '../error/validation.error';

export default class CommentValidato implements CreateEntityValidator<CreateComment>, UpdateEntityValidator<CommentProps, UpdateComment> {
    async validateBeforeCreate(payload: Payload<CreateComment>): Promise<void> {
        this.validateBody(payload.body);
    }

    async validateBeforeUpdate(_props: comment, payload: Payload<UpdateComment>): Promise<void> {
        this.validateBody(payload.body);
    }

    private validateBody(body: unknown): string | void {
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
