/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { CMProjectManager } from "./cm.project-manager";

const projectManager = CMProjectManager.instance();

projectManager.init(
	process.cwd()
);

/*
"paths":                            {
	"@classes/*": [
		"./classes/*"
	],
		"@helpers/*":  [
		"./helpers/*"
	],
		"@lib/*":     [
		"./lib/*"
	],
		"@shared/*":  [
		"./shared/*"
	],
		"@core/*":  [
		"./core/*"
	],
		"@middleware/*":  [
		"./middleware/*"
	],
		"@decorators/*":  [
		"./decorators/*"
	],
		"@libTypes/*":    [
		"./types/*"
	],
		"@plugins/*":  [
		"./plugins/*"
	],
		"@server/*":  [
		"./server/*"
	],
		"@msg/*":     [
		"./messages/*"
	],
		"./*":  [
		"./*"
	]
}
*/
