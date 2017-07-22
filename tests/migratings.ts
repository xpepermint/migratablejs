import * as fs from "mz/fs";
import test from "ava";
import { Migrator } from "../src";

const cacheFilePath = "./tmp/migratable.cache";

test.beforeEach(async (t) => {
  try { await fs.unlink(cacheFilePath); } catch (e) {}
});
test.afterEach(async (t) => {
  try { await fs.unlink(cacheFilePath); } catch (e) {}
});

test.serial("method `upgrade` runs migrations", async (t) => {
  let count = 0;
  let migrator = new Migrator({ cacheFilePath, ctx: { val: 1 } });

  migrator.add({
    index: 1,
    upgrade: (ctx) => count = count + ctx.val, // also testing context
  });
  migrator.add({
    index: 3,
    upgrade: (ctx) => count = count + ctx.val,
  });

  let index = await migrator.upgrade();

  t.is(count, 2);
  t.is(index, 3);
});

test.serial("method `upgrade` runs only new migrations", async (t) => {
  let count = 0;
  let migrator = new Migrator({ cacheFilePath });

  await fs.writeFile(cacheFilePath, 1); // migration index=1 has already been executed

  migrator.add({
    index: 1,
    upgrade: () => count++,
  });
  migrator.add({
    index: 3,
    upgrade: () => count++,
  });

  let index = await migrator.upgrade();

  t.is(count, 1);
  t.is(index, 3);
});

test.serial("method `upgrade` performs only a certain number of migrations", async (t) => {
  let count = 0;
  let migrator = new Migrator({ cacheFilePath });

  migrator.add({
    index: 1,
    upgrade: () => count++,
  });
  migrator.add({
    index: 3,
    upgrade: () => count++,
  });

  let index = await migrator.upgrade(1); // passing number of steps

  t.is(count, 1);
  t.is(index, 1);
});

test.serial("method `downgrade` runs migrations", async (t) => {
  let count = 0;
  let migrator = new Migrator({ cacheFilePath, ctx: { val: 1 } });

  await fs.writeFile(cacheFilePath, 6); // migration index=6 has already been executed

  migrator.add({
    index: 1,
    downgrade: (ctx) => count = count + ctx.val, // also testing context
  });
  migrator.add({
    index: 3,
    downgrade: (ctx) => count = count + ctx.val, // also testing context
  });
  migrator.add({
    index: 6,
    downgrade: (ctx) => count = count + ctx.val, // also testing context
  });

  let index = await migrator.downgrade();

  t.is(count, 3);
  t.is(index, -1);
});

test.serial("method `downgrade` performs only a certain number of migrations", async (t) => {
  let count = 0;
  let migrator = new Migrator({ cacheFilePath });

  await fs.writeFile(cacheFilePath, 6); // migration index=6 has already been executed

  migrator.add({
    index: 1,
    downgrade: () => count++,
  });
  migrator.add({
    index: 3,
    downgrade: () => count++,
  });
  migrator.add({
    index: 6,
    downgrade: () => count++,
  });

  let index = await migrator.downgrade(2);

  t.is(count, 2);
  t.is(index, 1);
});
