import { MongoClient } from 'mongodb';
import config from '../../config';
import logger from '../../utils/logger';
import Database from './database';

export default class MongoDatabase implements Database {
    private mongoClient: MongoClient | null = null;
    private readonly MONGO_URI = config('MONGO_URI');
    private readonly MONGO_DBNAME = config('MONGO_DBNAME');

    async connect(): Promise<void> {
        await this.getConnectedMongoClient();
    }

    async closeConnection(): Promise<void> {
        const mongoClient = await this.getConnectedMongoClient();
        await mongoClient.close();
    }

    private async getConnectedMongoClient() {
        if (!this.mongoClient) {
            try {
                logger.info('connecting to mongodb');
                const mongoClient = new MongoClient(this.MONGO_URI);
                this.mongoClient = await mongoClient.connect();
                logger.info('connected to mongodb');
            } catch (error) {
                logger.error('failed to make connection. stopping the application');
                process.exit(1);
            }
        }
        return this.mongoClient;
    }

    async getDatabase() {
        return this.getConnectedMongoClient().then(c => c.db(this.MONGO_DBNAME));
    }

    async getClientSession() {
        return this.getConnectedMongoClient().then(c => c.startSession());
    }
}
