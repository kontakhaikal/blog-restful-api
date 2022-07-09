import { CommentProps } from '../entity/comment';
import BaseRepository from './base.repository';

export default interface CommentRepository extends BaseRepository<CommentProps> {
    getOneById(articleId: string, id: string): Promise<CommentProps | null>;
    getManyByArticleId(articleId: string, nextCursor: string | undefined, limit: number): Promise<CommentProps[]>;
}
