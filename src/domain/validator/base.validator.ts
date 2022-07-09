import ValidationError from '../error/validation.error';

export default class BaseValidator {
    protected throwErrorWhenInvalid(validationResult: (string | void)[]): void {
        const invalidResults = validationResult.filter(invalidResult => !!invalidResult);
        if (invalidResults.length > 0) {
            throw new ValidationError(invalidResults.join(': '));
        }
    }
}
