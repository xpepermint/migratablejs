/**
 * Seed recipe interface.
 */
export interface SeedRecipe {
  index: number;
  perform?: (ctx?: any) => (any | Promise<any>);
}

/**
 * Class for performing seed operations.
 */
export class Seeder {
  readonly ctx: any;
  protected recipes: SeedRecipe[] = [];

  /**
   * Class constructor.
   * @param ctx Context object.
   */
  public constructor({
    ctx = null,
  }: {
    ctx?: any;
  } = {}) {
    this.ctx = ctx;
  }

  /**
   * Adds seed recipe.
   * @param recipe Seed recipe.
   */
  public add(recipe: SeedRecipe) {
    this.recipes.push(recipe);

    this.recipes = this.recipes.sort((a, b) => {
      return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0);
    });
  }

  /**
   * Removes seed recipe.
   * @param index Seed recipe index.
   */
  public remove(index: number) {
    this.recipes = this.recipes.filter((recipe) => {
      return recipe.index !== index;
    });
  }

  /**
   * Runs `perform` recipe methods.
   */
  public async perform() {
    let recipes = this.recipes;
    let lastIndex = -1;

    for (let i in recipes) {
      let recipe = recipes[i];

      if (recipe.perform) {
        await recipe.perform(this.ctx);
      }

      lastIndex = recipe.index;
    }

    return lastIndex;
  }
}
