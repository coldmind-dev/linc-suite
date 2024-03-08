"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoublyLinkedList = exports.DoublyLinkedListNode = void 0;
/**
 * Represents a doubly linked list node.
 * @template T - The type of data stored in the node.
 */
class DoublyLinkedListNode {
    constructor(value, prev = null, next = null) {
        this.value = value;
        this.prev = prev;
        this.next = next;
    }
}
exports.DoublyLinkedListNode = DoublyLinkedListNode;
/**
 * Represents a doubly linked list.
 * @template T - The type of data stored in the list.
 */
class DoublyLinkedList {
    constructor() {
        this.head = null;
        this.tail = null;
    }
    insertAtEnd(value) {
        const newNode = new DoublyLinkedListNode(value);
        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
            return;
        }
        this.tail.next = newNode;
        newNode.prev = this.tail;
        this.tail = newNode;
    }
    insertAfter(refNode, value) {
        const newNode = new DoublyLinkedListNode(value, refNode, refNode.next);
        refNode.next = newNode;
        if (newNode.next)
            newNode.next.prev = newNode;
        if (this.tail === refNode)
            this.tail = newNode;
    }
}
exports.DoublyLinkedList = DoublyLinkedList;
