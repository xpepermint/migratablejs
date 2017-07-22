![Build Status](https://travis-ci.org/xpepermint/migratablejs.svg?branch=master)&nbsp;[![NPM Version](https://badge.fury.io/js/migratable.svg)](https://badge.fury.io/js/migratable)&nbsp;[![Dependency Status](https://gemnasium.com/xpepermint/migratablejs.svg)](https://gemnasium.com/xpepermint/migratablejs)

# Migratable.js

> General purpose migration framework.

This is a light weight open source package for NodeJS written with [TypeScript](https://www.typescriptlang.org). It's actively maintained, well tested and already used in production environments. The source code is available on [GitHub](https://github.com/xpepermint/migratablejs) where you can also find our [issue tracker](https://github.com/xpepermint/migratablejs/issues).

## Installation

Run the command below to install the package.

```
$ npm install --save migratable
```

This package uses promises thus you need to use [Promise polyfill](https://github.com/taylorhakes/promise-polyfill) when promises are not supported.

## Usage

The package provides two core classes. The `Migrator` class is used for running migrations and the `Seeder` is used for performing seed operations.

### Migrations

Migrations are performed in a sequence based on the `index` parameter. If you pass a context object into `Migrator` class the object will be passed to each migration method. Methods `upgrade` and `downgrade` runs migration recipes and memorizes the last successfully performed migration `index` value inside the `./migratable.cache` file (don't forget to add this path to `.gitignore`).

```js
import { Migrator } from 'migratable';

// initialize migration class
const migrator = new Migrator({
  ctx: { foo: "foo" }, // optional
  cacheFilePath: "./migratable.cache", // optional
});

// register migrations (you could move this object into a separate file)
migrator.add({
  index: 0, // sequence number
  upgrade: async (ctx) => { /* do something */ },
  downgrade: async (ctx) => { /* do something */ },
});

// run `upgrade` migrations
migrator.upgrade().then((index) => { // upgrade optionally accepts the number of steps to perform
  console.log("Done!");
}).catch((err) => {
  console.log(err);
});
// or `downgrade` migrations
migrator.downgrade().then((index) => { // upgrade optionally accepts the number of steps to perform
  console.log("Done!");
}).catch((err) => {
  console.log(err);
});
```

### Seeding

Seed operations are similar to migrations. The difference is only that they can be performed multiple times.

```js
import { Seeder } from 'migratable';

// initialize migration class
const seeder = new Seeder(
  ctx: { foo: "foo" }, // optional
);

// register migrations (you could move this object into a separate file)
seeder.add({
  index: 0, // sequence number
  perform: async (ctx) => { /* do something */ },
});

// run `perform` methods
seeder.perform().then(() => {
  console.log("Done!");
}).catch((err) => {
  console.log(err);
});
```

## License (MIT)

```
Copyright (c) 2017+ Kristijan Sedlak <xpepermint@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated modelation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```
