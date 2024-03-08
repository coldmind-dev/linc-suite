/**
 * Copyright (c)  Coldmind AB - All Rights Reserved
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 *
 * Please refer to the LICENSE file for licensing information
 * regarding this software.
 */

export interface ITSConfig<T = any> {
	compilerOptions?: ICompilerOptions;
	coldmind?: T;
	compileOnSave?: boolean;
}

export interface ICompilerOptions {
	rootDir: string;
	target?: string[];
	outDir: string;
	inlineSources?: boolean;
	newLine?: string
	declaration?: boolean;
	emitDecoratorMetadata?: boolean;
	experimentalDecorators?: boolean;
	module?: string;
	moduleResolution?: string;
	noFallthroughCasesInSwitch?: boolean;
	noImplicitAny?: boolean;
	noImplicitReturns?: boolean;
	removeComments?: boolean;
	sourceMap?: boolean;
	strictNullChecks?: boolean;
}
