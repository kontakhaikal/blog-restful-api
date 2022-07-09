import Category, { CreateCategory, UpdateCategory } from '../entity/category';
import { UserCredentials } from '../entity/user';

export type AddCategory = {
    payload: CreateCategory;
    userCredentials: UserCredentials;
};

export type ChangeCategory = {
    id: Category['id'];
    payload: UpdateCategory;
    userCredentials: UserCredentials;
};
