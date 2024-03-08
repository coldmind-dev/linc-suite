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

export class CMArray<T = any> extends Array<T> {
	private index: number = 0;
	private items: T[] = [];

	constructor(items?: T[]) {
		super();

		if (items) {
			this.items = items;
		}
	}

	getItems(): T[] {
		this.items = (Array.isArray(this?.items) ? this.items : []);
		return this.items  as T[];
	}

	/**
	 * Adds an item to the array.
	 * @param item The item to add.
	 */
	add(item: T): void {
		this.items.push(item);
	}

	/**
	 * Gets the next item in the array, cycling back to the start if at the end.
	 * @returns The next item of type T.
	 */
	next(): T {
		const item = this.items[this.index];
		this.index = (this.index + 1) % this.items.length; // Cycle back to start
		return item;
	}

	/**
	 * Checks if the array is empty.
	 * @returns True if the array is empty, false otherwise.
	 */
	isEmpty(): boolean {
		return this.items.length === 0;
	}

	/**
	 * Removes and returns the first item from the array.
	 * @returns The first item of type T, or undefined if the array is empty.
	 */
	shift(next?: boolean, allowNull?: boolean): T | undefined {
		return next ? this.shiftNext(allowNull) : this.items.shift();
	}

	/**
	 * Removes and returns the first item from the array that is not null. If `allowNull` is true,
	 * it can return null when the first item is null. Continues to shift until a non-null item is found
	 * or the array is empty.
	 * @param {boolean} [allowNull=false] - Indicates if null items are allowed to be returned.
	 * @returns {T | undefined} - The first non-null item, or undefined if the array is empty or only contains null.
	 */
	shiftNext(allowNull?: boolean): T | undefined {
		let item;
		while (this.items.length > 0) {
			item = this.items.shift();
			if (item !== null || allowNull) {
				return item;
			}
		}
	}

	public shiftBack(item: T): number {
		return this.getItems().unshift(item);
	}

	/**
	 * Adds an item to the beginning of the array.
	 * @param item The item to add.
	 */
	unshift(item: T): number {
		return this.items.unshift(item);
	}

	/**
	 * Gets the current size of the array.
	 * @returns The number of items in the array.
	 */
	size(): number {
		return this.items.length;
	}

	/**
	 * Recursively processes each item in the array with a provided function.
	 * @param func The function to apply to each item.
	 * @param delay Optional delay between processing items.
	 */
	async recursiveProcess(func: (item: T) => Promise<void>, delay: number = 0): Promise<void> {
		if (this.isEmpty()) return;

		await func(this.shiftNext()!);

		if (delay > 0) {
			await new Promise(resolve => setTimeout(resolve, delay));
		}

		// Continue processing recursively
		await this.recursiveProcess(func, delay);
	}

	/**
	 * Clears the array.
	 */
	clear(): void {
		this.items = [];
		this.index = 0;
	}
}
