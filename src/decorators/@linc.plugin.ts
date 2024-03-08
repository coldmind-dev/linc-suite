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

import "reflect-metadata";
import { container as tsyringeContainer } from 'tsyringe';
import { DependencyContainer }            from "tsyringe";
import { InjectionToken }                 from "tsyringe";
import { container }                      from "tsyringe";
import { TMiddlewareFunc }                from "@middleware/middleware-func";
import { MetaKeys }                       from "../linc.global";

export type TCtor<T = any> = { new(...args: any[]): T };

export function Singleton(metadata?: string) {
	return function <T extends TCtor>(target: T) {
		console.log(":::::::::::::::::::: SERVICE INIT ::::::::::::::::::::::::");
	}
}

@Singleton()
class CMContainer {
	private container: DependencyContainer = tsyringeContainer;

	register<T>(token: string | symbol, constructor: new () => T): void {
		this.container.registerSingleton(token, constructor);
	}

	registerSingleton<T>(token: string | symbol, constructor: new () => T): void {
		this.container.registerSingleton(token, constructor);
	}

	resolve<T>(token: InjectionToken<T>): T {
		return this.container.resolve<T>(token);
	}
}

let cmContainer: CMContainer | undefined = undefined;

function getDI(): CMContainer {
	if ( !cmContainer) {
		cmContainer = tsyringeContainer.resolve(CMContainer);
	}

	return cmContainer;
}

export interface IPluginMetaData {
	name?: string;
	version?: string;
	middlewares?: TMiddlewareFunc[];
}

export function LincPlugin(metadata: IPluginMetaData): ClassDecorator {
	return function(constructor: any) {
		container.register(MetaKeys.Plugin, constructor);
		Reflect.defineMetadata(MetaKeys.Plugin, metadata, constructor);
	}
}
