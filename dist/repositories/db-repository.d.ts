export declare class DBRepository<Entity> {
    table: string;
    url: string;
    apiKey: string;
    constructor(table: string, url: string, apiKey: string);
    create(requestData: Partial<Entity>): Promise<string>;
    readOne<K extends keyof Entity>(query: Record<K, Entity[K]>, selector?: (keyof Entity)[]): Promise<Entity>;
    readAll<K extends keyof Entity>(query: Record<K, Entity[K]>, selector?: (keyof Entity)[]): Promise<Entity[]>;
    readExcept<K extends keyof Entity>(query: Record<K, Entity[K]>, selector: K[]): Promise<Entity[]>;
    readInclude<K extends keyof Entity>(query: string, selector?: K[]): Promise<Entity[]>;
    update(id: string, requestData: Partial<Entity>): Promise<void>;
    deleteByID(id: string): Promise<void>;
    deleteAll<K extends keyof Entity>(query: Record<K, Entity[K]>): Promise<void>;
    count<K extends keyof Entity>(query: Record<K, Entity[K]>): Promise<number>;
}
