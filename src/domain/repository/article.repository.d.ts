import Article from '../entity/article';
import { Status } from '../entity/content';
import ContentRepository from './content.repository';

export default interface ArticleRepository extends ContentRepository<Article> {
    getOneByIdAndStatus(id: string, status: Status): Promise<Article | null>;
}
