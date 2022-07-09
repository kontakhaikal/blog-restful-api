import { CreateEntityValidator, UpdateEntityValidator } from '.';
import { Payload } from '../entity/entity';
import { CreateProject, ProjectProps, UpdateProject } from '../entity/project';
import ProjectRepository from '../repository/project.repository';
import ContentValidator from './content.validator';

export default class ProjectValidator
    extends ContentValidator
    implements CreateEntityValidator<CreateProject>, UpdateEntityValidator<ProjectProps, UpdateProject>
{
    constructor(projectRepository: ProjectRepository) {
        super(projectRepository);
    }
    async validateBeforeCreate(payload: Payload<CreateProject>): Promise<void> {
        await this.validateProject(payload);
    }

    async validateBeforeUpdate(props: ProjectProps, payload: Payload<UpdateProject>): Promise<void> {
        const checkDuplicateTitle = props.title !== payload.title;
        const checkDuplicateSlug = props.slug !== payload.slug;
        await this.validateProject(payload, checkDuplicateTitle, checkDuplicateSlug);
    }

    private async validateProject(
        payload: Payload<CreateProject | UpdateProject>,
        checkDuplicateTitle: boolean = true,
        checkDuplicateSlug: boolean = true,
    ) {
        this.throwErrorWhenInvalid([
            await this.validateTitle(payload.title, { checkDuplicate: checkDuplicateTitle }),
            await this.validateSlug(payload.slug, { checkDuplicate: checkDuplicateSlug }),
            this.validateDescription(payload.description),
            this.validatePictureLink(payload.pictureLink),
            this.validatePictureDescription(payload.pictureDescription),
            this.valdiateProjectLink(payload.projectLink),
            this.validateContent(payload.content),
            this.validateStatus(payload.status),
        ]);
    }

    private valdiateProjectLink(projectLink: unknown): void | string {
        if (!projectLink) {
            return 'projectLink is required';
        }
        if (typeof projectLink !== 'string') {
            return 'projectLink must be a string';
        }
        if (!/^(http:\/\/|https:\/\/)/.test(projectLink)) {
            return 'projectLink must a valid url';
        }
    }
}
