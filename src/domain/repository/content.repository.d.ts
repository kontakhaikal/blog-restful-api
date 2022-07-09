import Content, { Status } from '../entity/content';
import BaseRepository from './base.repository';

export default interface ContentRepository<T = Content> extends BaseRepository<T> {
    getOneByTitle(title: string): Promise<T | null>;
    getOneBySlug(slug: string): Promise<T | null>;
    getManyByStatusWithOptionalSlug(status: Status, page: number, perPage: number, slug?: string): Promise<T[]>;
}
