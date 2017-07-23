import * as path from "path";
import * as fs from "mz/fs";

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
  public recipes: SeedRecipe[] = [];

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
  }

  /**
   * Loads seeds from directory.
   * @param dirPath Path to a folder with seed files.
   */
  public async addDir(dirPath: string) {
    let fileNames = await fs.readdir(dirPath);

    fileNames.filter((fileName) => {
      return path.extname(fileName) === ".js";
    }).forEach((fileName) => {
      this.add(require(path.join(dirPath, fileName)));
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
    let lastIndex = -1;
    let recipes = this.recipes.sort((a, b) => {
      return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0);
    });

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
