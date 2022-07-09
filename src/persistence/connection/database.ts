export default interface Database {
    connect(): Promise<void>;
    closeConnection(): Promise<void>;
}
