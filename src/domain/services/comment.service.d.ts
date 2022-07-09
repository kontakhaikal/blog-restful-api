import { RequestDTO, ResponseDTO } from '../dto';
import { AddComment, ChangeComment, DeleteComment } from '../dto/comment';
import { CommentProps } from '../entity/comment';
import { UserCredentials } from '../entity/user';

export default interface ICommentService {
    getCommentList(
        request: RequestDTO<{ articleId: string; nextCursor: string | undefined; limit: number; userCredentials: UserCredentials }>,
    ): Promise<ResponseDTO<CommentProps[]>>;
    addComment(request: RequestDTO<AddComment>): Promise<ResponseDTO>;
    changeComment(request: RequestDTO<ChangeComment>): Promise<ResponseDTO>;
    deleteComment(request: RequestDTO<DeleteComment>): Promise<DeleteEntity>;
}
