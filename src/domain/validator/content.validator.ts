import { Status } from '../entity/content';
import ContentRepository from '../repository/content.repository';
import BaseValidator from './base.validator';

export default abstract class ContentValidator extends BaseValidator {
    constructor(private readonly contentRepository: ContentRepository) {
        super();
    }

    protected async validateTitle(title: unknown, options: { checkDuplicate: boolean }) {
        if (!title) {
            return 'title is required';
        }
        if (typeof title !== 'string') {
            return 'title must be a string';
        }
        if (title.trim().length > 70) {
            return 'title is too long. Max 70 characters';
        }
        if (options.checkDuplicate) {
            return this.checkDuplicateTitle(title);
        }
    }

    private async checkDuplicateTitle(title: string): Promise<void | string> {
        const existedContent = await this.contentRepository.getOneByTitle(title);
        if (existedContent) {
            return 'title already in use';
        }
    }

    protected async validateSlug(slug: unknown, options: { checkDuplicate: boolean }) {
        if (!slug) {
            return 'slug is required';
        }
        if (typeof slug !== 'string') {
            return 'slug must be a string';
        }
        if (!/^[a-zA-Z0-9\-]+$/.test(slug)) {
            return 'slug is not valid';
        }
        if (options.checkDuplicate) {
            return this.checkDuplicateSlug(slug);
        }
    }

    private async checkDuplicateSlug(slug: string): Promise<void | string> {
        const existedContent = await this.contentRepository.getOneBySlug(slug);
        if (existedContent) {
            return 'slug already in use';
        }
    }

    protected validateDescription(description: unknown): void | string {
        if (!description) {
            return 'description is required';
        }
        if (typeof description !== 'string') {
            return 'description must be a string';
        }
        if (description.trim().length > 155) {
            return 'description is too long. Max 155 characters';
        }
    }

    protected validatePictureLink(pictureLink: unknown): void | string {
        if (!pictureLink) {
            return 'pictureLink is required';
        }
        if (typeof pictureLink !== 'string') {
            return 'pictureLink must be a string';
        }
        if (!/^(http:\/\/|https:\/\/)/.test(pictureLink)) {
            return 'pictureLink is not a valid url';
        }
    }

    protected validatePictureDescription(pictureDescription: unknown): void | string {
        if (!pictureDescription) {
            return 'pictureDescription is required';
        }
        if (typeof pictureDescription !== 'string') {
            return 'pictureDescription must be a string';
        }
        if (pictureDescription.trim().length > 155) {
            return 'pictureDescription is too long. Max 155 characters';
        }
    }

    protected validateContent(content: unknown): void | string {
        if (!content) {
            return 'content is required';
        }
        if (typeof content !== 'string') {
            return 'content must be a string';
        }
        if (content.trim().length > 100_000) {
            return 'content is too long. Max 100.000 characters';
        }
    }

    protected validateStatus(status: unknown): void | string {
        if (status !== Status.DRAFT && status !== Status.PUBLISHED) {
            return "status must be either 'draft' or 'published'";
        }
    }
}
