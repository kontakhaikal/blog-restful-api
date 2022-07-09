export default class ValidationError extends Error {
    override readonly name = 'ValidationError';
    constructor(message: string) {
        super(message);
    }
}
