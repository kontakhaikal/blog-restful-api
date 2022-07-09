export default class AuthorizationError extends Error {
    override readonly name = 'UnauthorizedError';
    constructor(message: string) {
        super(message);
    }
}
