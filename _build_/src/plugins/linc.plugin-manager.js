"use strict";
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-12
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
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LincPluginManager = void 0;
const linc_di_types_1 = require("../types/linc.di.types");
const tsyringe_1 = require("tsyringe");
const linc_global_1 = require("@root/linc.global");
const cm_result_1 = require("@lib/cm.common/cm.result");
const linc_server_1 = require("@server/linc.server");
const linc_logger_1 = require("@shared/linc.logger");
let LincPluginManager = class LincPluginManager {
    constructor(server) {
        this.server = server;
        this.plugins = [];
        this.plugins = [];
    }
    addPlugin(plugin) {
        this.plugins.push(plugin);
    }
    removePlugin(plugin) {
        let index = this.plugins.indexOf(plugin);
        if (index > -1) {
            this.plugins.splice(index, 1);
        }
    }
    /**
     * Initialize plugins
     *
     * @returns {Promise<IResult>}
     */
    async initPlugins() {
        const result = new cm_result_1.CMResult(true);
        try {
            let pluginList = [];
            if (tsyringe_1.container.isRegistered(linc_global_1.MetaKeys.Plugin, true)) {
                pluginList = tsyringe_1.container.resolveAll(linc_global_1.MetaKeys.Plugin) ?? [];
            }
            else {
                linc_logger_1.log.debug("LincPluginManager :: No plugins found");
            }
            pluginList.forEach((plugin) => async () => {
                linc_logger_1.log.debug("Plugin ::", plugin);
                await plugin.initialize(this.server);
            });
        }
        catch (err) {
            console.log("InitPlugin :: Error", err);
            result.success = false;
            result.error = err;
        }
        return result;
    }
};
LincPluginManager = __decorate([
    (0, linc_di_types_1.Service)(),
    __metadata("design:paramtypes", [linc_server_1.LincServer])
], LincPluginManager);
exports.LincPluginManager = LincPluginManager;
