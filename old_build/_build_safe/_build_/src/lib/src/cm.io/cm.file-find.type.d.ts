/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
export interface IFileFindResult<T = any> {
    path?: string;
    filename?: string;
    fullFilename?: string;
    fileContent?: T;
}
export declare type TFileFindResult<T = any> = IFileFindResult<T> | null;
