import { CreateEntityValidator, UpdateEntityValidator } from '.';
import { CategoryProps, CreateCategory, UpdateCategory } from '../entity/category';
import { Payload } from '../entity/entity';
import CategoryRepository from '../repository/category.repository';
import BaseValidator from './base.validator';

export default class CategoryValidator
    extends BaseValidator
    implements CreateEntityValidator<CreateCategory>, UpdateEntityValidator<CategoryProps, UpdateCategory>
{
    constructor(private readonly categoryRepository: CategoryRepository) {
        super();
    }
    async validateBeforeCreate(payload: Payload<CreateCategory>): Promise<void> {
        await this.validateCategory(payload);
    }

    async validateBeforeUpdate(props: CategoryProps, payload: Payload<UpdateCategory>): Promise<void> {
        const checkDuplicateName = props.name !== payload.name;
        await this.validateCategory(payload, checkDuplicateName);
    }

    private async validateCategory(payload: Payload<CreateCategory | UpdateCategory>, checkDuplicateName: boolean = true) {
        this.throwErrorWhenInvalid([
            await this.validateName(payload.name, { checkDuplicate: checkDuplicateName }),
            this.validateDescription(payload.description),
        ]);
    }

    private async validateName(name: unknown, options: { checkDuplicate: boolean }) {
        if (!name) {
            return 'name is required';
        }
        if (typeof name !== 'string') {
            return 'name must be a string';
        }
        if (options.checkDuplicate) {
            return this.checkDuplicateName(name);
        }
    }

    private async checkDuplicateName(name: string): Promise<string | void> {
        const existedCategory = await this.categoryRepository.getOneByName(name);
        if (existedCategory) {
            return 'name is already exist';
        }
    }

    private validateDescription(description: unknown): string | void {
        if (!description) {
            return 'description is required';
        }
    }
}
