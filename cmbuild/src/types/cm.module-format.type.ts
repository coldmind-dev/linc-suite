/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-25
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

export enum CMBuildModuleFormat {
	AMD      = 'amd',
	CommonJS = 'cjs',
	ES       = 'es',
	IIFE     = 'iife',
	System   = 'system',
	UMD      = 'umd'
}

export const TModuleFormat = {
	AMD: {
		name: CMBuildModuleFormat.AMD,
		aliases: ['amd']
	},
	CommonJS: {
		name: CMBuildModuleFormat.CommonJS,
		aliases: ['commonjs', 'cjs', 'node']
	},
	ES: {
		name: CMBuildModuleFormat.ES,
		aliases: ['es', 'esm']
	},
	IIFE: {
		name: CMBuildModuleFormat.IIFE,
		aliases: ['iife', 'function']
	},
	System: {
		name: CMBuildModuleFormat.System,
		aliases: ['system', 'systemjs']
	},
	UMD: {
		name: CMBuildModuleFormat.UMD,
		aliases: ['umd', 'universal']
	}
}
