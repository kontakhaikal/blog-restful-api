import generateId from '../helper/id-generator';
import { CreateEntityValidator, UpdateEntityValidator } from '../validator';
import Content, { Status } from './content';
import { Payload } from './entity';

export type CreateProject = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateProject = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>;

export type ProjectProps = Project;

export default class Project extends Content {
    private constructor(
        id: string,
        title: string,
        slug: string,
        description: string,
        pictureLink: string,
        pictureDescription: string,
        public projectLink: string,
        content: string,
        status: Status,
        createdAt: number,
        updatedAt: number,
    ) {
        super(id, title, slug, description, pictureLink, pictureDescription, content, status, createdAt, updatedAt);
    }

    static async create(payload: Payload<CreateProject>, validator: CreateEntityValidator<CreateProject>): Promise<Project> {
        await validator.validateBeforeCreate(payload);
        const id = generateId();
        const currentTimeStamp = Date.now();
        return new Project(
            id,
            payload.title as string,
            payload.slug as string,
            payload.description as string,
            payload.pictureLink as string,
            payload.pictureDescription as string,
            payload.projectLink as string,
            payload.content as string,
            payload.status as Status,
            currentTimeStamp,
            currentTimeStamp,
        );
    }

    static async update(
        props: ProjectProps,
        payload: Payload<UpdateProject>,
        validator: UpdateEntityValidator<ProjectProps, UpdateProject>,
    ): Promise<Project> {
        await validator.validateBeforeUpdate(props, payload);
        return new Project(
            props.id,
            payload.title as string,
            payload.slug as string,
            payload.description as string,
            payload.pictureLink as string,
            payload.pictureDescription as string,
            payload.projectLink as string,
            payload.content as string,
            payload.status as Status,
            props.createdAt,
            props.updatedAt,
        );
    }
}
