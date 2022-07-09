import { RequestDTO, ResponseDTO } from '../dto';
import { AddAReply, ChangeReply, DeleteReply } from '../dto/reply.dto';
import { ReplyProps } from '../entity/reply';
import { UserCredentials } from '../entity/user';

export default class IReplyService {
    getReplyList(
        request: RequestDTO<{
            articleId: string;
            commentId: string;
            nextCursor: string | undefined;
            limit: number;
            userCredentials: UserCredentials;
        }>,
    ): Promise<ResponseDTO<ReplyProps[]>>;
    addReply(request: RequestDTO<AddAReply>): Promise<ResponseDTO>;
    deleteReply(request: RequestDTO<DeleteReply>): Promise<ResponseDTO>;
    changeReply(request: RequestDTO<ChangeReply>): Promise<ResponseDTO>;
}
