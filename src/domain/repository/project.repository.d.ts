import { Status } from '../entity/content';
import { ProjectProps } from '../entity/project';
import ContentRepository from './content.repository';

export default interface ProjectRepository extends ContentRepository<ProjectProps> {}
