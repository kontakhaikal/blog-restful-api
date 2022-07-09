import { DeleteEntity, GetEntity, RequestDTO, ResponseDTO } from '../dto';
import { AddProject, ChangeProject, GetProjectList } from '../dto/project.dto';
import { ProjectProps } from '../entity/project';

export default interface IProjectService {
    getProjectList(request: RequestDTO<GetProjectList>): Promise<ResponseDTO<ProjectProps[]>>;
    getProject(request: RequestDTO<GetEntity>): Promise<ResponseDTO<ProjectProps>>;
    addProject(request: RequestDTO<AddProject>): Promise<ResponseDTO>;
    changeProject(request: RequestDTO<ChangeProject>): Promise<ResponseDTO>;
    deleteProject(request: RequestDTO<DeleteEntity>): Promise<ResponseDTO>;
}
