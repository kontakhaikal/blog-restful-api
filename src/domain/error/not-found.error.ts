export default class NotFoundError extends Error {
    override readonly name = 'NotFoundError';
    constructor(message: string) {
        super(message);
    }
}
