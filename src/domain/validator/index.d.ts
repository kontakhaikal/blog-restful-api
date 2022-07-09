import { Payload } from '../entity/entity';

/**
 * This validator is kinda bad.
 */

export interface CreateEntityValidator<T> {
    validateBeforeCreate(payload: Payload<T>): Promise<void>;
}

export interface UpdateEntityValidator<T, P> {
    validateBeforeUpdate(props: T, payload: Payload<P>): Promise<void>;
}
