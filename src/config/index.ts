import dotenv from 'dotenv';
import path from 'path';

const getEnvPath = () => {
    let envFile = '.env.dev';
    if (process.env['NODE_ENV'] === 'production') envFile = '.env';
    if (process.env['NODE_ENV'] === 'test') envFile = '.env.test';
    return path.resolve(envFile);
};

const config = (name: string) => {
    const env = process.env[name] ?? dotenv.config({ path: getEnvPath() }).parsed![name];
    if (!env) throw new Error(`${name} are not specified. Please add to your environment variable`);
    return env;
};

export default config;
