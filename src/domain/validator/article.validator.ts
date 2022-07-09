import { CreateEntityValidator, UpdateEntityValidator } from '.';
import { ArticleProps, CreateArticle, UpdateArticle } from '../entity/article';
import { Payload } from '../entity/entity';
import ArticleRepository from '../repository/article.repository';
import ContentValidator from './content.validator';

export default class ArticleValidator
    extends ContentValidator
    implements CreateEntityValidator<CreateArticle>, UpdateEntityValidator<ArticleProps, UpdateArticle>
{
    constructor(articleRepository: ArticleRepository) {
        super(articleRepository);
    }

    async validateBeforeCreate(payload: Payload<CreateArticle>): Promise<void> {
        await this.validateArticle(payload);
    }

    async validateBeforeUpdate(props: ArticleProps, payload: Payload<UpdateArticle>): Promise<void> {
        const checkDuplicateTitle = props.title !== payload.title;
        const checkDuplicateSlug = props.slug !== payload.slug;
        await this.validateArticle(payload, checkDuplicateTitle, checkDuplicateSlug);
    }

    private async validateArticle(
        payload: Payload<CreateArticle | UpdateArticle>,
        checkDuplicateTitle: boolean = true,
        checkDuplicateSlug: boolean = true,
    ) {
        this.throwErrorWhenInvalid([
            await this.validateTitle(payload.title, { checkDuplicate: checkDuplicateTitle }),
            await this.validateSlug(payload.slug, { checkDuplicate: checkDuplicateSlug }),
            this.validateDescription(payload.description),
            this.validatePictureLink(payload.pictureLink),
            this.validatePictureDescription(payload.pictureDescription),
            this.validateCategory(payload.category),
            this.validateContent(payload.content),
            this.validateStatus(payload.status),
        ]);
    }

    validateCategory(category: { id: unknown; name: unknown }): void | string {
        if (!category?.id) {
            return 'categoryId is required';
        }
        if (typeof category?.id !== 'string') {
            return 'categoryId must be a string';
        }

        if (typeof category?.name !== 'string') {
            return 'categoryId not found';
        }
    }
}
