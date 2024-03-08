"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleLoader = void 0;
const module_loader_result_1 = require("@lib/cm.module/module.loader-result");
/**
 * A class for loading npm modules dynamically.
 * @template T - The type of the loaded module.
 */
class ModuleLoader {
    constructor() {
        this.cache = {};
        this.retryAttempts = 3;
    }
    /**
     * Get the singleton instance of the class
     * @returns {ModuleLoader<T>} - The instance of the class
     */
    static getInstance() {
        if (!ModuleLoader.instance) {
            ModuleLoader.instance = new ModuleLoader();
        }
        return ModuleLoader.instance;
    }
    /**
     * Set a fallback module to be used if the module fails to load
     * @param fallback - The fallback module
     */
    setFallbackModule(fallback) {
        this.fallbackModule = fallback;
    }
    /**
     * Set the number of retry attempts
     * @param attempts - The number of retry attempts
     */
    setRetryAttempts(attempts) {
        this.retryAttempts = attempts;
    }
    /**
     * Load a module
     * @param moduleName - The name of the module
     * @returns {IModuleLoaderResult<T>} - An object with setSuccess flag, loaded module, or error
     */
    loadModule(moduleName) {
        /*const getDepsResult = getDependencies();
        const dependencies = getDepsResult.dependencies = getDepsResult.dependencies || {};

        if (!dependencies[ moduleName ]) {
            return new ModuleLoaderResult<T>(
                false,
                undefined,
                `Error: ${ moduleName } is not a dependency of this project.`
            );
        }
        */
        if (this.cache[moduleName]) {
            return new module_loader_result_1.ModuleLoaderResult(true, this.cache[moduleName]);
        }
        let attempts = this.retryAttempts;
        while (attempts > 0) {
            try {
                this.cache[moduleName] = require(moduleName);
                return new module_loader_result_1.ModuleLoaderResult(true, this.cache[moduleName]);
            }
            catch (err) {
                attempts--;
                console.error(`Error loading module ${moduleName}. ${attempts} attempts left.`);
            }
        }
        if (this.fallbackModule) {
            console.log(`Error loading module ${moduleName}, falling back to fallback module.`);
            return new module_loader_result_1.ModuleLoaderResult(true, this.fallbackModule);
        }
        return new module_loader_result_1.ModuleLoaderResult(false, undefined, `Error loading module ${moduleName} after ${this.retryAttempts} attempts`);
    }
}
exports.ModuleLoader = ModuleLoader;
