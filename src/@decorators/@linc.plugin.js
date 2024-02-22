"use strict";
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-11
 *
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/.
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * The software is provided "as is", without warranty of any kind, express or implied,
 * including but not limited to the warranties of merchantability, fitness for a
 * particular purpose and noninfringement. In no event shall the authors or copyright
 * holders be liable for any claim, damages or other liability, whether in an action of
 * contract, tort or otherwise, arising from, out of or in connection with the software
 * or the use or other dealings in the software.
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LincPlugin = exports.Singleton = void 0;
var tsyringe_1 = require("tsyringe");
var tsyringe_2 = require("tsyringe");
var link_const_1 = require("@/link.const");
function Singleton(metadata) {
    return function (target) {
        console.log(":::::::::::::::::::: SERVICE INIT ::::::::::::::::::::::::");
    };
}
exports.Singleton = Singleton;
var CMContainer = /** @class */ (function () {
    function CMContainer() {
        this.container = tsyringe_1.container;
    }
    CMContainer.prototype.register = function (token, constructor) {
        this.container.registerSingleton(token, constructor);
    };
    CMContainer.prototype.registerSingleton = function (token, constructor) {
        this.container.registerSingleton(token, constructor);
    };
    CMContainer.prototype.resolve = function (token) {
        return this.container.resolve(token);
    };
    CMContainer = __decorate([
        Singleton()
    ], CMContainer);
    return CMContainer;
}());
var cmContainer = undefined;
function getDI() {
    if (!cmContainer) {
        cmContainer = tsyringe_1.container.resolve(CMContainer);
    }
    return cmContainer;
}
function LincPlugin(metadata) {
    return function (constructor) {
        tsyringe_2.container.register(link_const_1.MetaKeys.Plugin, constructor);
        Reflect.defineMetadata(link_const_1.MetaKeys.Plugin, metadata, constructor);
    };
}
exports.LincPlugin = LincPlugin;
