import generateId from '../helper/id-generator';
import { CreateEntityValidator, UpdateEntityValidator } from '../validator';
import Entity, { Payload } from './entity';

export type CreateCategory = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateCategory = Omit<Category, 'id' | 'createdAt' | 'updatedAt'>;

export type CategoryProps = Category;

export type CategoryData = Pick<Category, 'id' | 'name'>;

export default class Category extends Entity {
    constructor(id: string, public name: string, public description: string, createdAt: number, updatedAt: number) {
        super(id, createdAt, updatedAt);
    }

    static async create(payload: Payload<CreateCategory>, validator: CreateEntityValidator<CreateCategory>) {
        await validator.validateBeforeCreate(payload);
        const id = generateId();
        const currentTimeStamp = Date.now();
        return new Category(id, payload.name as string, payload.description as string, currentTimeStamp, currentTimeStamp);
    }

    static async update(props: CategoryProps, payload: Payload<UpdateCategory>, validator: UpdateEntityValidator<CategoryProps, UpdateCategory>) {
        await validator.validateBeforeUpdate(props, payload);
        const currentTimeStamp = Date.now();
        return new Category(props.id, payload.name as string, payload.description as string, props.createdAt, currentTimeStamp);
    }
}
