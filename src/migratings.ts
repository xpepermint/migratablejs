import * as path from 'path';
import * as fs from 'mz/fs';

/**
 * Migration recipe interface.
 */
export interface MigrationRecipe {
  index: number;
  upgrade?: (ctx?: any) => (any | Promise<any>);
  downgrade?: (ctx?: any) => (any | Promise<any>);
}

/**
 * Class for performing migrations.
 */
export class Migrator {
  readonly ctx: any;
  readonly cacheFilePath: string;
  public recipes: MigrationRecipe[] = [];

  /**
   * Class constructor.
   * @param ctx Context object.
   * @param cacheFilePath Path to the cache file.
   */
  public constructor({
    ctx = null,
    cacheFilePath = './migratable.cache',
  }: {
    ctx?: any;
    cacheFilePath?: string;
  } = {}) {
    this.ctx = ctx;
    this.cacheFilePath = cacheFilePath;
  }

  /**
   * Adds migration recipe.
   * @param recipe Migration recipe.
   */
  public add(recipe: MigrationRecipe) {
    this.recipes.push(recipe);
  }

  /**
   * Loads migrations from directory.
   * @param dirPath Path to a folder with migration files.
   */
  public async addDir(dirPath: string) {
    let fileNames = await fs.readdir(dirPath);

    fileNames.forEach((fileName) => {
      let recipe;
      try { recipe = require(path.join(dirPath, fileName)); } catch (e) {}

      const isValid = (
        !!recipe
        && typeof recipe.index !== 'undefined'
        && typeof recipe.upgrade !== 'undefined'
        && typeof recipe.downgrade !== 'undefined'
      );
      if (isValid) {
        this.add(recipe);
      }
    });
  }

  /**
   * Removes migration recipe.
   * @param index Migration recipe index.
   */
  public remove(index: number) {
    this.recipes = this.recipes.filter((recipe) => {
      return recipe.index !== index;
    });
  }

  /**
   * Returns last performed migration index.
   */
  public async lastIndex() {
    let exists = await fs.exists(this.cacheFilePath);

    if (exists) {
      return parseInt(await fs.readFile(this.cacheFilePath));
    } else {
      return -1;
    }
  }

  /**
   * Runs `upgrade` migration recipe methods.
   * @param steps How many migrations to run.
   */
  public async upgrade(steps: number = -1) {
    if (steps === -1) {
      steps = this.recipes.length;
    }

    let stepsPerformed = 0;
    let lastIndex = await this.lastIndex();
    let recipes = this.recipes.sort((a, b) => {
      return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0);
    });

    for (let i in recipes) {
      let recipe = recipes[i];

      if (steps <= stepsPerformed) {
        break;
      }
      if (recipe.index <= lastIndex) {
        continue;
      }

      if (recipe.upgrade) {
        await recipe.upgrade(this.ctx);
      }
      await fs.writeFile(this.cacheFilePath, recipe.index);

      lastIndex = recipe.index;
      stepsPerformed++;
    }

    return lastIndex;
  }

  /**
   * Runs `downgrade` migration recipe methods.
   * @param steps How many migrations to run.
   */
  public async downgrade(steps: number = -1) {
    if (steps === -1) {
      steps = this.recipes.length;
    }

    let stepsPerformed = 0;
    let lastIndex = await this.lastIndex();
    let recipes = this.recipes.sort((a, b) => {
      return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0);
    });

    for (let i = recipes.length - 1; i >= 0; i--) {
      let recipe = recipes[i];

      if (steps <= stepsPerformed) {
        break;
      }
      if (recipe.index > lastIndex) {
        continue;
      }

      if (recipe.downgrade) {
        await recipe.downgrade(this.ctx);
      }

      let nextRecipe = recipes[i - 1];
      lastIndex = nextRecipe ? nextRecipe.index : -1;
      stepsPerformed++;

      await fs.writeFile(this.cacheFilePath, lastIndex);
    }

    return lastIndex;
  }
}
