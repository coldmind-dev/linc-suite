/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { CMBuildModuleFormat } from "./cm.module-format.type";

export enum CMBuildType {
	"Standard" = "std",
	"NpmModule" = "npm",
}

// This is the interface
export interface IStdBuildSpec {
	builds: [{
		type?: CMBuildType;
		name?: string;
		stripComments?: boolean;
		minify?: boolean;
		source?: string[];
		output?: IJsonBuildSpecOutput;
	}];
}

export interface INpmBuildSpec extends IStdBuildSpec {
	npmModule: {
		dir?: string;
	}
}

export interface IJsonBuildSpecOutput {
	globalVar: string;
	bundleName?: string;
	bundleFormat?: CMBuildModuleFormat | string;
	globals?: { [ id: string ]: string } | ( (id: string) => string )
}
