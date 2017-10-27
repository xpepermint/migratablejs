"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var path = require("path");
var fs = require("mz/fs");
var Migrator = (function () {
    function Migrator(_a) {
        var _b = _a === void 0 ? {} : _a, _c = _b.ctx, ctx = _c === void 0 ? null : _c, _d = _b.cacheFilePath, cacheFilePath = _d === void 0 ? './migratable.cache' : _d;
        this.recipes = [];
        this.ctx = ctx;
        this.cacheFilePath = cacheFilePath;
    }
    Migrator.prototype.add = function (recipe) {
        this.recipes.push(recipe);
    };
    Migrator.prototype.addDir = function (dirPath) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var fileNames;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, fs.readdir(dirPath)];
                    case 1:
                        fileNames = _a.sent();
                        fileNames.forEach(function (fileName) {
                            var recipe;
                            try {
                                recipe = require(path.join(dirPath, fileName));
                            }
                            catch (e) { }
                            var isValid = (!!recipe
                                && typeof recipe.index !== 'undefined'
                                && typeof recipe.upgrade !== 'undefined'
                                && typeof recipe.downgrade !== 'undefined');
                            if (isValid) {
                                _this.add(recipe);
                            }
                        });
                        return [2];
                }
            });
        });
    };
    Migrator.prototype.remove = function (index) {
        this.recipes = this.recipes.filter(function (recipe) {
            return recipe.index !== index;
        });
    };
    Migrator.prototype.lastIndex = function () {
        return __awaiter(this, void 0, void 0, function () {
            var exists, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4, fs.exists(this.cacheFilePath)];
                    case 1:
                        exists = _b.sent();
                        if (!exists) return [3, 3];
                        _a = parseInt;
                        return [4, fs.readFile(this.cacheFilePath)];
                    case 2: return [2, _a.apply(void 0, [_b.sent()])];
                    case 3: return [2, -1];
                }
            });
        });
    };
    Migrator.prototype.upgrade = function (steps) {
        if (steps === void 0) { steps = -1; }
        return __awaiter(this, void 0, void 0, function () {
            var stepsPerformed, lastIndex, recipes, _a, _b, _i, i, recipe;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        if (steps === -1) {
                            steps = this.recipes.length;
                        }
                        stepsPerformed = 0;
                        return [4, this.lastIndex()];
                    case 1:
                        lastIndex = _c.sent();
                        recipes = this.recipes.sort(function (a, b) {
                            return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0);
                        });
                        _a = [];
                        for (_b in recipes)
                            _a.push(_b);
                        _i = 0;
                        _c.label = 2;
                    case 2:
                        if (!(_i < _a.length)) return [3, 7];
                        i = _a[_i];
                        recipe = recipes[i];
                        if (steps <= stepsPerformed) {
                            return [3, 7];
                        }
                        if (recipe.index <= lastIndex) {
                            return [3, 6];
                        }
                        if (!recipe.upgrade) return [3, 4];
                        return [4, recipe.upgrade(this.ctx)];
                    case 3:
                        _c.sent();
                        _c.label = 4;
                    case 4: return [4, fs.writeFile(this.cacheFilePath, recipe.index)];
                    case 5:
                        _c.sent();
                        lastIndex = recipe.index;
                        stepsPerformed++;
                        _c.label = 6;
                    case 6:
                        _i++;
                        return [3, 2];
                    case 7: return [2, lastIndex];
                }
            });
        });
    };
    Migrator.prototype.downgrade = function (steps) {
        if (steps === void 0) { steps = -1; }
        return __awaiter(this, void 0, void 0, function () {
            var stepsPerformed, lastIndex, recipes, i, recipe, nextRecipe;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (steps === -1) {
                            steps = this.recipes.length;
                        }
                        stepsPerformed = 0;
                        return [4, this.lastIndex()];
                    case 1:
                        lastIndex = _a.sent();
                        recipes = this.recipes.sort(function (a, b) {
                            return (a.index > b.index) ? 1 : ((b.index > a.index) ? -1 : 0);
                        });
                        i = recipes.length - 1;
                        _a.label = 2;
                    case 2:
                        if (!(i >= 0)) return [3, 7];
                        recipe = recipes[i];
                        if (steps <= stepsPerformed) {
                            return [3, 7];
                        }
                        if (recipe.index > lastIndex) {
                            return [3, 6];
                        }
                        if (!recipe.downgrade) return [3, 4];
                        return [4, recipe.downgrade(this.ctx)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        nextRecipe = recipes[i - 1];
                        lastIndex = nextRecipe ? nextRecipe.index : -1;
                        stepsPerformed++;
                        return [4, fs.writeFile(this.cacheFilePath, lastIndex)];
                    case 5:
                        _a.sent();
                        _a.label = 6;
                    case 6:
                        i--;
                        return [3, 2];
                    case 7: return [2, lastIndex];
                }
            });
        });
    };
    return Migrator;
}());
exports.Migrator = Migrator;
//# sourceMappingURL=migratings.js.map