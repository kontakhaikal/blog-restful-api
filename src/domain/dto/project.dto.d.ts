import { Status } from '../entity/content';
import Project, { CreateProject, UpdateProject } from '../entity/project';
import { UserCredentials } from '../entity/user';

export type AddProject = {
    payload: CreateProject;
    userCredentials: UserCredentials;
};

export type ChangeProject = {
    id: Project['id'];
    payload: UpdateProject;
    userCredentials: UserCredentials;
};

export type GetProjectList = {
    page: number;
    perPage: number;
    status: Status;
    userCredentials: UserCredentials;
};
