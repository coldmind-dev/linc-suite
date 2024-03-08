/**
 * Copyright (c) 2023 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2023-10-23
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
/**
 * Represents a doubly linked list node.
 * @template T - The type of data stored in the node.
 */
export declare class DoublyLinkedListNode<T> {
    value: T;
    prev: DoublyLinkedListNode<T> | null;
    next: DoublyLinkedListNode<T> | null;
    constructor(value: T, prev?: DoublyLinkedListNode<T> | null, next?: DoublyLinkedListNode<T> | null);
}
/**
 * Represents a doubly linked list.
 * @template T - The type of data stored in the list.
 */
export declare class DoublyLinkedList<T> {
    private head;
    private tail;
    insertAtEnd(value: T): void;
    insertAfter(refNode: DoublyLinkedListNode<T>, value: T): void;
}
