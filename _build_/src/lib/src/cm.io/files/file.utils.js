"use strict";
/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cmFileExistsAsync = exports.cmFileExistsSync = void 0;
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
/**
 * Synchronously checks if the concatenated arguments form a path to an existing file.
 * It does not consider directories as valid.
 *
 * @param paths Variadic strings representing parts of a path.
 * @returns boolean True if the path exists and is a file, false otherwise.
 */
function cmFileExistsSync(...paths) {
    try {
        const fullPath = path_1.default.join(...paths);
        const stats = fs.statSync(fullPath);
        return stats.isFile();
    }
    catch (error) {
        return false;
    }
}
exports.cmFileExistsSync = cmFileExistsSync;
/**
 * Asynchronously checks if the concatenated arguments form a path to an existing file.
 * It does not consider directories as valid.
 *
 * @param paths Variadic strings representing parts of a path.
 * @returns Promise<boolean> Resolves to true if the path exists and is a file, false otherwise.
 */
async function cmFileExistsAsync(...paths) {
    try {
        const fullPath = path_1.default.join(...paths);
        const stats = await fs.promises.stat(fullPath);
        return stats.isFile();
    }
    catch (error) {
        return false;
    }
}
exports.cmFileExistsAsync = cmFileExistsAsync;
