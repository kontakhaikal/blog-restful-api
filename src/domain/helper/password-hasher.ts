import { BinaryLike, randomBytes, scrypt, timingSafeEqual } from 'crypto';
import config from '../../config';

const SALT_LENGTH_IN_BYTES = 32;
const KEY_LENGTH_IN_BYTES = 64;
const ENCODING: BufferEncoding = 'base64url';
const PASSWORD_SECRET_KEY = config('PASSWORD_SECRET_KEY');
const SALT_KEY_DELIMITER = '.';

export async function hash(rawPassword: string): Promise<string> {
    const salt = randomBytes(SALT_LENGTH_IN_BYTES).toString(ENCODING);
    const derivedKey = await createDerivedKey(rawPassword, salt);
    return salt + SALT_KEY_DELIMITER + derivedKey.toString(ENCODING);
}

export async function compare(rawPassword: string, hashedPassword: unknown): Promise<boolean> {
    const [salt, key] = parseHashedPassword(hashedPassword);
    const derivedKey = await createDerivedKey(rawPassword, salt);
    return timingSafeEqual(Buffer.from(key, ENCODING), derivedKey);
}

function parseHashedPassword(hashedPassword: unknown): [string, string] {
    if (typeof hashedPassword !== 'string') {
        throw new Error('invalid hashed password');
    }
    const [salt, key] = hashedPassword.split(SALT_KEY_DELIMITER);
    if (!salt || !key) {
        throw new Error('invalid hashed password');
    }
    return [salt, key];
}

function createDerivedKey(rawPassword: BinaryLike, salt: BinaryLike): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        scrypt(rawPassword, salt + PASSWORD_SECRET_KEY, KEY_LENGTH_IN_BYTES, (error, derivedKey) => {
            if (error) reject(error);
            resolve(derivedKey);
        });
    });
}
