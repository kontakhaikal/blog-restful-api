import { UserCredentials } from '../../domain/entity/user';
import jwt from 'jsonwebtoken';
import config from '../../config';

export const parseCredentialsFromBearerToken = (authorizationHeader: string | undefined): { id: unknown; name: unknown; role: unknown } => {
    try {
        const [head, token] = authorizationHeader!.split(' ');
        if (head === 'Bearer' && token) {
            const payload = jwt.verify(token, config('JWT_SECRET_KEY')) as jwt.JwtPayload | UserCredentials;
            return { id: payload.id, name: payload.name, role: payload.role };
        }
        return { id: undefined, name: undefined, role: undefined };
    } catch {
        return { id: undefined, name: undefined, role: undefined };
    }
};

export const generateBearerTokenFromCredentials = (userCredentials: UserCredentials) => {
    return `Bearer ${jwt.sign(userCredentials, config('JWT_SECRET_KEY'), { expiresIn: '3d' })}`;
};
