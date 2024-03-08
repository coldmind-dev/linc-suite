/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-02-08
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
export declare class CMArray<T = any> extends Array<T> {
    private index;
    private items;
    constructor(items?: T[]);
    getItems(): T[];
    /**
     * Adds an item to the array.
     * @param item The item to add.
     */
    add(item: T): void;
    /**
     * Gets the next item in the array, cycling back to the start if at the end.
     * @returns The next item of type T.
     */
    next(): T;
    /**
     * Checks if the array is empty.
     * @returns True if the array is empty, false otherwise.
     */
    isEmpty(): boolean;
    /**
     * Removes and returns the first item from the array.
     * @returns The first item of type T, or undefined if the array is empty.
     */
    shift(next?: boolean, allowNull?: boolean): T | undefined;
    /**
     * Removes and returns the first item from the array that is not null. If `allowNull` is true,
     * it can return null when the first item is null. Continues to shift until a non-null item is found
     * or the array is empty.
     * @param {boolean} [allowNull=false] - Indicates if null items are allowed to be returned.
     * @returns {T | undefined} - The first non-null item, or undefined if the array is empty or only contains null.
     */
    shiftNext(allowNull?: boolean): T | undefined;
    shiftBack(item: T): number;
    /**
     * Adds an item to the beginning of the array.
     * @param item The item to add.
     */
    unshift(item: T): number;
    /**
     * Gets the current size of the array.
     * @returns The number of items in the array.
     */
    size(): number;
    /**
     * Recursively processes each item in the array with a provided function.
     * @param func The function to apply to each item.
     * @param delay Optional delay between processing items.
     */
    recursiveProcess(func: (item: T) => Promise<void>, delay?: number): Promise<void>;
    /**
     * Clears the array.
     */
    clear(): void;
}
