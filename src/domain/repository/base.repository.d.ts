export default interface BaseRepository<T> {
    getOneById(id: string): Promise<T | null>;
    saveOne(props: T): Promise<boolean>;
    updateOne(props: T): Promise<boolean>;
    deleteOne(id: string): Promise<boolean>;
}
