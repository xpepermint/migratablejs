export interface SeedRecipe {
    index: number;
    perform?: (ctx?: any) => (any | Promise<any>);
}
export declare class Seeder {
    readonly ctx: any;
    protected recipes: SeedRecipe[];
    constructor({ctx}?: {
        ctx?: any;
    });
    add(recipe: SeedRecipe): void;
    remove(index: number): void;
    perform(): Promise<number>;
}
