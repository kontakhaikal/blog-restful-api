import { Response } from 'express';
import AuthenticationError from '../../domain/error/authentication.error';
import AuthorizationError from '../../domain/error/authorization.error';
import NotFoundError from '../../domain/error/not-found.error';
import OperationError from '../../domain/error/operation.error';
import ValidationError from '../../domain/error/validation.error';

export default abstract class BaseController {
    protected async executeCommand<T>(
        res: Response,
        requestDTO: T,
        serviceMethod: (requestDTO: T) => Promise<{ success: boolean; message?: string }>,
    ) {
        return this.execute(requestDTO, res, serviceMethod, { isCommand: true });
    }

    protected async executeQuery<T, P = undefined>(
        res: Response,
        requestDTO: T,
        serviceMethod: (request: T) => Promise<{ success: boolean; data?: P }>,
    ) {
        return this.execute(requestDTO, res, serviceMethod, { isCommand: false });
    }

    private async execute<T, P = undefined>(
        requestDTO: T,
        res: Response,
        serviceMethod: (requestDTO: T) => Promise<{ success: boolean; message?: string; data?: P }>,
        options: { isCommand: boolean },
    ) {
        try {
            const response = await serviceMethod(requestDTO);
            if (response.success) {
                return res.status(200).json(options.isCommand ? { statusCode: 200, message: response.message } : response.data);
            }
            return res.status(507).json({
                status: 507,
                message: response.message,
            });
        } catch (error) {
            if (error instanceof AuthorizationError) {
                return res.status(400).json({
                    status: 401,
                    message: error.message,
                });
            }
            if (error instanceof AuthenticationError) {
                return res.status(400).json({
                    status: 401,
                    message: error.message,
                });
            }
            if (error instanceof NotFoundError) {
                return res.status(404).json({
                    status: 404,
                    message: error.message,
                });
            }
            if (error instanceof ValidationError) {
                return res.status(401).json({
                    status: 400,
                    message: error.message,
                });
            }
            if (error instanceof OperationError) {
                return res.status(409).json({
                    status: 409,
                    message: error.message,
                });
            }
            return res.status(500).end();
        }
    }
}
