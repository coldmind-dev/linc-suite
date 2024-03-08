import { IColdmindOptions } from "../../../cmbuild/cmbuild-core/types/cm.project.type";
export interface ITSConfig {
    compilerOptions?: ICompilerOptions;
    coldmind?: IColdmindOptions;
    compileOnSave?: boolean;
}
export interface ICompilerOptions {
    rootDir: string;
    target?: string[];
    outDir: string;
    inlineSources?: boolean;
    newLine?: string;
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
