export interface MigrationRecipe {
    index: number;
    upgrade?: (ctx?: any) => (any | Promise<any>);
    downgrade?: (ctx?: any) => (any | Promise<any>);
}
export declare class Migrator {
    readonly ctx: any;
    readonly cacheFilePath: string;
    protected recipes: MigrationRecipe[];
    constructor({ctx, cacheFilePath}?: {
        ctx?: any;
        cacheFilePath?: string;
    });
    add(recipe: MigrationRecipe): void;
    remove(index: number): void;
    lastIndex(): Promise<number>;
    upgrade(steps?: number): Promise<number>;
    downgrade(steps?: number): Promise<number>;
}
