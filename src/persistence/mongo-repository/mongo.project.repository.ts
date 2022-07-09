import { Status } from '../../domain/entity/content';
import Project, { ProjectProps } from '../../domain/entity/project';
import ProjectRepository from '../../domain/repository/project.repository';
import MongoDatabase from '../connection/mongo.database';
import { ProjectDocument } from './mongo-documents';

export default class MongoProjectRepository implements ProjectRepository {
    constructor(private readonly mongodb: MongoDatabase) {}

    async getManyByStatusWithOptionalSlug(status: Status, page: number, perPage: number, slug?: string): Promise<ProjectProps[]> {
        return this.projects
            .then(c => c.find({ status, ...(slug ? { slug } : {}) }, { projection: { _id: 0 } }))
            .then(r => r.sort('id', -1))
            .then(r => r.skip((page - 1) * perPage))
            .then(r => r.limit(perPage))
            .then(r => r.toArray()) as unknown as ProjectProps[];
    }

    async deleteOne(id: string): Promise<boolean> {
        const deleteResult = await this.projects.then(p => p.deleteOne({ id }));
        return deleteResult.acknowledged && deleteResult.deletedCount === 1;
    }

    async getOneById(id: string): Promise<Project | null> {
        return this.projects.then(c => c.findOne({ id }, { projection: { _id: 0 } })) as unknown as Project | null;
    }

    async getOneBySlug(slug: string): Promise<Project | null> {
        return this.projects.then(c => c.findOne({ slug }, { projection: { _id: 0 } })) as unknown as Project | null;
    }

    async getOneByTitle(title: string): Promise<Project | null> {
        return this.projects.then(c => c.findOne({ title }, { projection: { _id: 0 } })) as unknown as Project | null;
    }

    async saveOne(props: Project): Promise<boolean> {
        const insertResult = await this.projects.then(c => c.insertOne(props));
        return insertResult.acknowledged && !!insertResult.insertedId;
    }

    async updateOne(props: Project): Promise<boolean> {
        const updateResult = await this.projects.then(c => c.updateOne({ id: props.id }, { $set: props }));
        return updateResult.acknowledged && updateResult.modifiedCount === 1;
    }

    get projects() {
        return this.mongodb.getDatabase().then(db => db.collection<ProjectDocument>('projects'));
    }
}
