import { CategoryProps } from '../entity/category';
import BaseRepository from './base.repository';

export default interface CategoryRepository extends BaseRepository<CategoryProps> {
    getOneByName(name: string): Promise<CategoryProps | null>;
    getMany(): Promise<CategoryProps[]>;
}
