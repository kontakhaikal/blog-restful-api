export default class AuthenticationError extends Error {
    override readonly name = 'AuthenticationError';
    constructor(message: string) {
        super(message);
    }
}
