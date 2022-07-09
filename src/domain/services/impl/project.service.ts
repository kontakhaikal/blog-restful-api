import { DeleteEntity, RequestDTO, ResponseDTO } from '../../dto';
import { AddProject, ChangeProject } from '../../dto/project.dto';
import { Status } from '../../entity/content';
import Project, { CreateProject, ProjectProps, UpdateProject } from '../../entity/project';
import { Role } from '../../entity/user';
import NotFoundError from '../../error/not-found.error';
import { parsePaginationRequest } from '../../helper/pagination-request-parser';
import ProjectRepository from '../../repository/project.repository';
import { CreateEntityValidator, UpdateEntityValidator } from '../../validator';
import ProjectValidator from '../../validator/project.validator';
import IProjectService from '../project.service';
import BaseService, { AuthLevel } from './base.service';

export default class ProjectService extends BaseService implements IProjectService {
    private readonly projectValidator: CreateEntityValidator<CreateProject> & UpdateEntityValidator<ProjectProps, UpdateProject>;
    constructor(private readonly projectRepository: ProjectRepository) {
        super();
        this.projectValidator = new ProjectValidator(projectRepository);
    }

    async getProject(request: {
        readonly id: unknown;
        readonly userCredentials: { readonly id: unknown; readonly role: unknown };
    }): Promise<Readonly<{ success: boolean; message: string; data?: Readonly<Project> }>> {
        const projectProps = await this.getProps(request.id, this.projectRepository, { errorMessage: 'project not found' });
        if (projectProps.status === Status.DRAFT && request.userCredentials.role !== Role.ADMIN) {
            throw new NotFoundError('article not found');
        }
        return {
            success: true,
            message: 'project founded',
        };
    }

    async getProjectList(request: {
        readonly page: unknown;
        readonly perPage: unknown;
        readonly status: unknown;
        readonly slug: unknown;
        readonly userCredentials: { readonly id: unknown; readonly name: unknown; readonly role: unknown };
    }): Promise<Readonly<{ success: boolean; message: string; data?: readonly Project[] }>> {
        const { status, page, perPage } = parsePaginationRequest({ ...request, page: request.page ?? '1', perPage: request.perPage ?? '5' });
        const projectList = await this.projectRepository.getManyByStatusWithOptionalSlug(
            status,
            page,
            perPage,
            typeof request.slug !== 'string' ? undefined : request.slug,
        );
        return {
            success: true,
            message: 'projects founded',
            data: projectList,
        };
    }

    async addProject(request: RequestDTO<AddProject>): Promise<ResponseDTO> {
        this.validateAuthorization(request.userCredentials, { authLevel: AuthLevel.ADMIN, errorMessage: 'unauthorized to add project' });
        const project = await Project.create(request.payload, this.projectValidator);
        const success = await this.projectRepository.saveOne(project);
        return {
            success,
            message: success ? 'project added' : 'failed to add project',
        };
    }

    async changeProject(request: RequestDTO<ChangeProject>): Promise<ResponseDTO> {
        this.validateAuthorization(request.userCredentials, {
            authLevel: AuthLevel.ADMIN,
            errorMessage: 'unauthorized to change project',
        });
        const projectProps = await this.getProps(request.id, this.projectRepository, { errorMessage: 'project not found' });
        const updatedProject = await Project.update(projectProps, request.payload, this.projectValidator);
        const success = await this.projectRepository.updateOne(updatedProject);
        return {
            success,
            message: success ? 'project changed' : 'failed to change project',
        };
    }

    async deleteProject(request: RequestDTO<DeleteEntity>): Promise<ResponseDTO> {
        this.validateAuthorization(request.userCredentials, {
            authLevel: AuthLevel.ADMIN,
            errorMessage: 'unauthorized to delete project',
        });
        const projectProps = await this.getProps(request.id, this.projectRepository, { errorMessage: 'project not found' });
        const success = await this.projectRepository.deleteOne(projectProps.id);
        return {
            success,
            message: success ? 'project deleted' : 'failed to delete project',
        };
    }
}
