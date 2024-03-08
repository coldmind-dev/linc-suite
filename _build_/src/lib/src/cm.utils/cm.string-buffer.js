"use strict";
/**
 * Coldmind Graphmin
 * This file is part of Graphmin which is released under MPL2.0.
 * See file LICENSE or go to https://github.com/duffman/graphmin.git
 * for full license details.
 *
 * THIS FILE HEADER SHALL REMAIN INTACT IN ORDER FOR LICENSE TO BE VALID
 *
 * @author Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date 2021-10-02
 *
 * Copyright (c) 2023 Coldmind AB - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmStringBuffer = void 0;
/**
 * @class CmStringBuffer
 * Class that acts as a buffer and adds various string manipulation methods
 */
class CmStringBuffer {
    /**
     * @property
     * Returns the current value of the buffer
     * @return {string} The current value of the buffer
     */
    get value() {
        return this.buffer;
    }
    /**
     * @constructor
     * @param {string} str - The string to initialize the buffer with
     */
    constructor(str = "") {
        this.charArr = [];
        this.buffer = str;
    }
    /**
     * @method
     * Removes the first character from the buffer and returns it
     * @return {string} The first character of the buffer
     */
    shift() {
        let firstChar = this.buffer[0];
        this.buffer = this.buffer.substring(1);
        return firstChar;
    }
    /**
     * @method
     * Appends a string to the end of the buffer
     * @param {string} str - The string to append to the buffer
     */
    append(str) {
        this.buffer += str;
    }
    /**
     * @method
     * Clears the buffer by setting it to an empty string
     */
    clear() {
        this.buffer = "";
    }
    /**
     * @method
     * Replaces all occurrences of a string in the buffer with another string
     * @param {string} searchValue - The string to search for in the buffer
     * @param {string} replaceValue - The string to replace `searchValue` with
     */
    replace(searchValue, replaceValue) {
        this.buffer = this.buffer.replace(searchValue, replaceValue);
    }
    /**
     * @method
     * Removes whitespaces from the beginning and end of the buffer
     */
    trim() {
        this.buffer = this.buffer.trim();
        this.charArr = this.buffer.split('');
    }
    /**
     * @method
     * Splits the buffer into an array of substrings based on a separator
     * @param {string} separator - The separator to use for splitting the buffer
     * @return {string[]} An array of substrings
     */
    split(separator) {
        return this.buffer.split(separator);
    }
    /**
     * @method
     * Reverses the order of characters in the buffer
     */
    reverse() {
        this.charArr.reverse();
        this.buffer = this.charArr.join('');
    }
    /**
     * @method
     * Returns the first index of a given substring in the buffer, or -1 if not found
     * @param {string} searchValue - The substring to search for in the buffer
     * @return {number} The index of the first occurrence of the substring, or -1 if not found
     */
    find(searchValue) {
        return this.buffer.indexOf(searchValue);
    }
    /**
     * @method
     * Counts the number of occurrences of a given substring in the buffer
     * @param {string} searchValue - The substring to search for in the buffer
     * @return {number} The number of occurrences of the substring in the buffer
     */
    count(searchValue) {
        return (this.buffer.match(new RegExp(searchValue, "g")) || []).length;
    }
    /**
     * @method
     * Checks if a given substring is present in the buffer or not
     * @param {string} searchValue - The substring to search for in the buffer
     * @return {boolean} `true` if the substring is present in the buffer, `false` otherwise
     */
    contains(searchValue) {
        return this.buffer.includes(searchValue);
    }
    /**
     * @method
     * Returns the getLength of the buffer
     * @return {number} The getLength of the buffer
     */
    getLength() {
        return this.buffer.length;
    }
    /**
     * Return the string contents
     */
    compileToString() {
        return this.buffer;
    }
    /**
     * @method
     * Returns a part of the buffer
     * @param {number} start - The index to start the substring
     * @param {number} [end??] - The index to end the substring. If not provided, it will return the rest of the string after start
     * @return {string} The substring
     */
    substring(start, end) {
        if (end) {
            return this.buffer.substring(start);
        }
        else {
            return this.buffer.substring(start);
        }
    }
    splitTrim(separator) {
        return [];
    }
}
exports.CmStringBuffer = CmStringBuffer;
