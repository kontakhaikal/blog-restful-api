import { ReplyProps } from '../entity/reply';
import BaseRepository from './base.repository';

export default interface ReplyRepository extends BaseRepository<ReplyProps> {
    getManyByArticleIdAndCommentId(articleId: string, commentId: string, nextCursor: string | undefined, limit: number): Promise<ReplyProps[]>;
    getOneById(articleId: string, commentId: string, id: string): Promise<ReplyProps | null>;
}
