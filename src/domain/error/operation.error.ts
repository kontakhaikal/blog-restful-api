export default class OperationError extends Error {
    override readonly name = 'OperationError';
    constructor(message: string) {
        super(message);
    }
}
