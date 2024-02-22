"use strict";
/**
 * Coldmind MicroMind
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2023-05-10
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reflector = void 0;
/**
 * Metadata utility module
 * Contains utility functions for working with metadata
 * @module MetadataUtil
 */
require("reflect-metadata");
class Reflector {
    /**
     * Retrieves the metadata value associated with a given metadata key from a target.
     * @param {string} metadataKey - The key associated with the metadata.
     * @param {any} target - The target object from which metadata is retrieved.
     * @param {string} [propKey] - The property key of the target.
     * @returns {T} - The metadata value.
     */
    static getMetadata(metadataKey, target, propKey) {
        return propKey ? Reflect.getMetadata(metadataKey, target, propKey) : null;
    }
    static getMetaDecorator(metadataKey, target, propKey) {
        return Reflect.getMetadata(metadataKey, Object.getPrototypeOf(target), propKey);
    }
    /**
     * Assigns a value to a specific metadata key on a target.
     * @param {string} metadataKey - The key associated with the metadata.
     * @param {any} target - The target object where metadata will be assigned.
     * @param {any} metadataValue - The value to be assigned to the metadata key.
     * @param {string} [propKey] - The property key of the target.
     */
    static setMetadata(metadataKey, target, metadataValue, propKey) {
        Reflect.defineMetadata(metadataKey, target, metadataValue, propKey);
    }
    /**
     * Assigns a value to a specific metadata key on a target.
     * If metadata for the key already exists, it appends the new value to the existing metadata.
     * If the existing metadata is not an array, it converts the existing metadata to an array and then appends the new value.
     * @param {string} metadataKey - The key associated with the metadata.
     * @param {any} target - The target object where metadata will be assigned.
     * @param {any} metadataValue - The value to be assigned or appended to the metadata key.
     * @param {string} [propertyKey] - The property key of the target.
     */
    static applyMetadata(metadataKey, target, metadataValue, propKey) {
        let existingMetadata = this.getMetadata(metadataKey, target, propKey);
        if (existingMetadata) {
            if (!Array.isArray(existingMetadata)) {
                existingMetadata = [existingMetadata];
            }
            existingMetadata.push(metadataValue);
        }
        else {
            existingMetadata = [metadataValue];
        }
        this.setMetadata(metadataKey, target, existingMetadata, propKey);
    }
    /**
     * Retrieves the property names of an object that have a specific Reflect Metadata key.
     * @param {object} obj - The object to retrieve property names from.
     * @param {string} metadataKey - The key of the Reflect Metadata to match.
     * @returns {string[]} An array of property names that have the specified Reflect Metadata key.
     */
    static getOwnPropNames(obj, metadataKey) {
        const propertyNames = [];
        for (const propertyName of Object.getOwnPropertyNames(obj)) {
            const metadataValue = Reflect.getMetadata(metadataKey, obj, propertyName);
            if (metadataValue !== undefined) {
                propertyNames.push(propertyName);
            }
        }
        return propertyNames;
    }
    /**
     * Retrieves the property names of an object that have a specific Reflect Metadata key.
     * Includes only properties defined directly by the user (not inherited properties).
     * @param {object} obj - The object to retrieve property names from.
     * @param {string} metadataKey - The key of the Reflect Metadata to match.
     * @returns {string[]} An array of property names that have the specified Reflect Metadata key.
     */
    static getPropNamesWithKey(obj, metadataKey) {
        const propertyNames = [];
        for (const propertyName of Object.getOwnPropertyNames(obj)) {
            if (obj.hasOwnProperty(propertyName)) {
                const metadataValue = Reflect.getMetadata(metadataKey, obj, propertyName);
                if (metadataValue !== undefined) {
                    propertyNames.push(propertyName);
                }
            }
        }
        return propertyNames;
    }
}
exports.Reflector = Reflector;
