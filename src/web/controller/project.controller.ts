import { Request, Response } from 'express';
import IProjectService from '../../domain/services/project.service';
import { parseCredentialsFromBearerToken } from '../helper/bearer-token';
import BaseController from './base.controller';

export default class ProjectController extends BaseController {
    constructor(private readonly projectService: IProjectService) {
        super();
    }

    get = async (req: Request, res: Response) => {
        const requestDTO = {
            id: req.params['id'],
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeQuery(res, requestDTO, this.projectService.getProject.bind(this.projectService));
    };

    getList = async (req: Request, res: Response) => {
        const requestDTO = {
            slug: req.query['slug'],
            status: req.query['status'],
            page: req.query['page'],
            perPage: req.query['per-page'],
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeQuery(res, requestDTO, this.projectService.getProjectList.bind(this.projectService));
    };

    create = async (req: Request, res: Response) => {
        const requestDTO = {
            payload: req.body,
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeCommand(res, requestDTO, this.projectService.addProject.bind(this.projectService));
    };

    update = async (req: Request, res: Response) => {
        const requestDTO = {
            id: req.params['id'],
            payload: req.body,
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeCommand(res, requestDTO, this.projectService.changeProject.bind(this.projectService));
    };

    delete = async (req: Request, res: Response) => {
        const requestDTO = {
            id: req.params['id'],
            userCredentials: parseCredentialsFromBearerToken(req.headers['authorization']),
        };
        return this.executeCommand(res, requestDTO, this.projectService.deleteProject.bind(this.projectService));
    };
}
