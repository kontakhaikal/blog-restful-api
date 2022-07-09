import Entity from './entity';

export enum Status {
    DRAFT = 'draft',
    PUBLISHED = 'published',
}

export default abstract class Content extends Entity {
    protected constructor(
        id: string,
        public title: string,
        public slug: string,
        public description: string,
        public pictureLink: string,
        public pictureDescription: string,
        public content: string,
        public status: Status,
        createdAt: number,
        updatedAt: number,
    ) {
        super(id, createdAt, updatedAt);
    }
}
