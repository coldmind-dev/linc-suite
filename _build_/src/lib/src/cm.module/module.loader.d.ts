/**
 * Copyright (c)  Coldmind AB - All Rights Reserved
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2023-01-19
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
import { IModuleLoaderResult } from "@lib/cm.module/module.loader-result.type";
/**
 * A class for loading npm modules dynamically.
 * @template T - The type of the loaded module.
 */
export declare class ModuleLoader {
    private static instance;
    private cache;
    private retryAttempts;
    private fallbackModule?;
    private constructor();
    /**
     * Get the singleton instance of the class
     * @returns {ModuleLoader<T>} - The instance of the class
     */
    static getInstance(): ModuleLoader;
    /**
     * Set a fallback module to be used if the module fails to load
     * @param fallback - The fallback module
     */
    setFallbackModule(fallback: any): void;
    /**
     * Set the number of retry attempts
     * @param attempts - The number of retry attempts
     */
    setRetryAttempts(attempts: number): void;
    /**
     * Load a module
     * @param moduleName - The name of the module
     * @returns {IModuleLoaderResult<T>} - An object with setSuccess flag, loaded module, or error
     */
    loadModule<T = any>(moduleName: string): IModuleLoaderResult<T>;
}
