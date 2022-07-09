import { DeleteEntity, RequestDTO, ResponseDTO } from '../../dto';
import { AddCategory, ChangeCategory } from '../../dto/category.dto';
import Category, { CategoryProps, CreateCategory, UpdateCategory } from '../../entity/category';
import CategoryRepository from '../../repository/category.repository';
import { CreateEntityValidator, UpdateEntityValidator } from '../../validator';
import CategoryValidator from '../../validator/category.validator';
import ICategoryService from '../category.service';
import BaseService, { AuthLevel } from './base.service';

export default class CategoryService extends BaseService implements ICategoryService {
    private readonly categoryValidator: CreateEntityValidator<CreateCategory> & UpdateEntityValidator<CategoryProps, UpdateCategory>;
    constructor(private readonly categoryRepository: CategoryRepository) {
        super();
        this.categoryValidator = new CategoryValidator(categoryRepository);
    }

    async getCategoryList(): Promise<Readonly<{ success: boolean; message: string; data?: readonly Category[] }>> {
        const categoryList = await this.categoryRepository.getMany();
        return {
            success: true,
            message: 'category founded',
            data: categoryList,
        };
    }

    async addCategory(request: RequestDTO<AddCategory>): Promise<ResponseDTO> {
        this.validateAuthorization(request.userCredentials, { authLevel: AuthLevel.ADMIN, errorMessage: 'unauthorized to add category' });
        const category = await Category.create(request.payload, this.categoryValidator);
        const success = await this.categoryRepository.saveOne(category);
        return {
            success,
            message: success ? 'category added' : 'failed to add category',
        };
    }

    async changeCategory(request: RequestDTO<ChangeCategory>): Promise<ResponseDTO> {
        this.validateAuthorization(request.userCredentials, { authLevel: AuthLevel.ADMIN, errorMessage: 'unauthorized to change category' });
        const categoryProps = await this.getProps(request.id, this.categoryRepository, { errorMessage: 'category not found' });
        const updatedCategory = await Category.update(categoryProps, request.payload, this.categoryValidator);
        const success = await this.categoryRepository.updateOne(updatedCategory);
        return {
            success,
            message: success ? 'category changed' : 'failed to change category',
        };
    }

    async deleteCategory(request: RequestDTO<DeleteEntity>): Promise<ResponseDTO> {
        this.validateAuthorization(request.userCredentials, { authLevel: AuthLevel.ADMIN, errorMessage: 'unauthorized to delete category' });
        const categoryProps = await this.getProps(request.id, this.categoryRepository, { errorMessage: 'category not found' });
        const success = await this.categoryRepository.deleteOne(categoryProps.id);
        return {
            success,
            message: success ? 'category deleted' : 'failed to delete category',
        };
    }
}
