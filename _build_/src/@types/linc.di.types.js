"use strict";
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-09
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Service = exports.Server = exports.Client = exports.registerSingletonAs = void 0;
const tsyringe_1 = require("tsyringe");
/**
 * Decorator that marks a class as injectable.
 * It registers the class in the DI container without specifying it as a singleton.
 */
function Injectable() {
    return function (constructor) {
        (0, tsyringe_1.injectable)()(constructor);
    };
}
/**
 * Decorator that marks a class as a singleton and registers it in the DI container.
 */
function Singleton() {
    return function (constructor) {
        (0, tsyringe_1.singleton)()(constructor);
    };
}
/**
 * Registers the class as a singleton in the DI container and tags it as a specific type.
 * @param type The type of class being registered (e.g., 'Client', 'Server', 'Service').
 */
function registerSingletonAs(type) {
    return function (constructor) {
        (0, tsyringe_1.singleton)()(constructor);
        tsyringe_1.container.registerSingleton(type, constructor);
    };
}
exports.registerSingletonAs = registerSingletonAs;
/**
 * Custom decorator for marking a class as a client component.
 * Registers the class as a singleton and tags it as 'Client'.
 */
function Client() {
    return registerSingletonAs('CNClient');
}
exports.Client = Client;
/**
 * Custom decorator for marking a class as a server component.
 * Registers the class as a singleton and tags it as 'Server'.
 */
function Server(config) {
    return registerSingletonAs('CMServer');
}
exports.Server = Server;
/**
 * Custom decorator for marking a class as a service component.
 * Registers the class as a singleton and tags it as 'Service'.
 */
function Service() {
    return registerSingletonAs('CMService');
}
exports.Service = Service;
