import * as fs from "mz/fs";
import test from "ava";
import { Seeder } from "../src";

test.serial("method `perform` runs seed operations", async (t) => {
  let count = 0;
  let seeder = new Seeder({ ctx: { val: 1 } });

  seeder.add({
    index: 1,
    perform: (ctx) => count = count + ctx.val, // also testing context
  });
  seeder.add({
    index: 3,
    perform: (ctx) => count = count + ctx.val,
  });

  let index = await seeder.perform();

  t.is(count, 2);
  t.is(index, 3);
});

test.serial("method `addDir` loads seeds from directory", async (t) => {
  let seeder = new Seeder();
  await seeder.addDir(`${__dirname}/assets/seeds`);

  t.is(seeder.recipes.length, 1);
  t.is(seeder.recipes[0].index, 0);
});
