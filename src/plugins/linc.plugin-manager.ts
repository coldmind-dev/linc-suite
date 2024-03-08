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

import { Service }             from "@CmTypes/linc.di.types";
import { ILincPlugin }         from "@plugins/linc.plugin.type";
import { container }           from "tsyringe";
import { DependencyContainer } from "tsyringe";
import { LincServer }          from "@server/linc.server";
import { log }                 from "@shared/linc.logger";
import { IResult }             from "@lib/cm.common/tstypes/cm.result.type";
import { CMResult }            from "@lib/cm.common/cm.result";
import { MetaKeys }            from "../linc.global";

@Service()
export class LincPluginManager {
	private pluginContainer: DependencyContainer | undefined;
	private plugins: ILincPlugin[] = [];

	constructor(public server: LincServer) {
		this.plugins = [];
	}

	public addPlugin(plugin: any) {
		this.plugins.push(plugin);
	}

	public removePlugin(plugin: any) {
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
	public async initPlugins(): Promise<IResult> {
		const result = new CMResult(true);

		try {
			let pluginList: ILincPlugin[] = []

			if (container.isRegistered<ILincPlugin>(MetaKeys.Plugin, true)) {
				pluginList = container.resolveAll<ILincPlugin>(MetaKeys.Plugin) ?? [];
			}
			else {
				log.debug("LincPluginManager :: No plugins found");
			}

			pluginList.forEach((plugin: ILincPlugin) => async () => {
				log.debug("Plugin ::", plugin);
				await plugin.initialize(this.server);
			});
		}
		catch (err) {
			console.log("InitPlugin :: Error", err);
			result.success = false;
			result.error   = err;
		}

		return result;
	}
}
