export interface SeedRecipe {
    index: number;
    perform?: (ctx?: any) => (any | Promise<any>);
}
export declare class Seeder {
    readonly ctx: any;
    recipes: SeedRecipe[];
    constructor({ctx}?: {
        ctx?: any;
    });
    add(recipe: SeedRecipe): void;
    addDir(dirPath: string): Promise<void>;
    remove(index: number): void;
    perform(): Promise<number>;
}
