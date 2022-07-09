import { Status } from '../entity/content';
import { Role } from '../entity/user';
import ValidationError from '../error/validation.error';

export const parsePaginationRequest = (request: {
    page: unknown;
    perPage: unknown;
    status: unknown;
    userCredentials: { readonly id: unknown; readonly name: unknown; readonly role: unknown };
}): { status: Status; page: number; perPage: number } => {
    let errors: string[] = [];
    let status = request.status ?? Status.PUBLISHED;
    const pageValidationResult = validatePositiveInteger(request.page, 'page must be a positive integer string');
    const perPageValidationResult = validatePositiveInteger(request.perPage, 'per-page must be a positive integer string');
    if (status !== Status.DRAFT && status !== Status.PUBLISHED) {
        errors.push('status must be draft or published');
    }
    if (request.userCredentials.role !== Role.ADMIN) {
        status = Status.PUBLISHED;
    }
    if (pageValidationResult) {
        errors.push(pageValidationResult);
    }
    if (perPageValidationResult) {
        errors.push(perPageValidationResult);
    }
    if (errors.length > 0) {
        throw new ValidationError(errors.join('; '));
    }
    return { status: status as Status, page: parseInt(request.page as string), perPage: parseInt(request.perPage as string) };
};

export function parseCursorPaginationRequest(request: { nextCursor: unknown; limit: unknown }): [string | undefined, number] {
    const errors: string[] = [];

    if (typeof request.nextCursor !== 'undefined' && typeof request.nextCursor !== 'string') {
        errors.push('next-cursor must be spesify as string');
    }
    const limitValidationResult = validatePositiveInteger(request.limit, 'limit must be a positive integer string');
    if (limitValidationResult) {
        errors.push(limitValidationResult);
    }
    if (errors.length > 0) {
        throw new ValidationError(errors.join('; '));
    }
    return [request.nextCursor as string | undefined, parseInt(request.limit as string)];
}

const validatePositiveInteger = (value: unknown, errorMessage: string): void | string => {
    if (typeof value !== 'string') {
        return errorMessage;
    }
    if (!/^\d+$/.test(value)) {
        return errorMessage;
    }
    if (parseInt(value) < 1) {
        return errorMessage;
    }
};
