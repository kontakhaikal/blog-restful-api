import { DeleteEntity, RequestDTO, ResponseDTO } from '../dto';
import { AddCategory, ChangeCategory } from '../dto/category.dto';
import { CategoryProps } from '../entity/category';

export default interface ICategoryService {
    getCategoryList(): Promise<ResponseDTO<CategoryProps[]>>;
    addCategory(request: RequestDTO<AddCategory>): Promise<ResponseDTO>;
    changeCategory(request: RequestDTO<ChangeCategory>): Promise<ResponseDTO>;
    deleteCategory(request: RequestDTO<DeleteEntity>): Promise<RequestDTO>;
}
