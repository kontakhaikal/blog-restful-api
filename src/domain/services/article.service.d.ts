import { DeleteEntity, GetEntity, RequestDTO, ResponseDTO } from '../dto';
import { AddArticle, ChangeArticle, GetArticleList } from '../dto/article.dto';
import { ArticleProps } from '../entity/article';
import { Status } from '../entity/content';
import { UserCredentials } from '../entity/user';

export default interface IArticleService {
    getArticleList(request: RequestDTO<GetArticleList>): Promise<ResponseDTO<ArticleProps[]>>;
    getArticle(request: RequestDTO<GetEntity>): Promise<ResponseDTO<ArticleProps>>;
    addArticle(request: RequestDTO<AddArticle>): Promise<ResponseDTO>;
    changeArticle(request: RequestDTO<ChangeArticle>): Promise<ResponseDTO>;
    deleteArticle(request: RequestDTO<DeleteEntity>): Promise<ResponseDTO>;
}
