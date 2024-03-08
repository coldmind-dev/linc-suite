"use strict";
/**
 * Copyright (c) 2024 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2024-03-08
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
/**
 * Represents a custom URL class for parsing, constructing, and manipulating URLs.
 */
class CmUrl {
    //////////////////////////////////////////////////////////
    //
    // Getters and setters
    // C#'s auto-props, nooo, remember that this is still JavaScript :)
    //
    /////////////////////////////////////////////////////////
    // Protocol
    get protocol() {
        return this._protocol;
    }
    set protocol(value) {
        this._protocol = value;
    }
    // Host
    get host() {
        return this._host;
    }
    set host(value) {
        this._host = value;
    }
    // Port
    get port() {
        return this._port;
    }
    set port(value) {
        this._port = value;
    }
    // Paths
    get paths() {
        return this._paths;
    }
    set paths(value) {
        this._paths = value;
    }
    //////////////////////////////////////////////////////////
    /**
     * Constructs a CmUrl instance, optionally parsing a provided URL string.
     *
     * @param value - The URL string to parse (optional).
     * @param defaults - Default values for protocol, host, and port.
     */
    constructor(value, defaults = { port: 80, protocol: 'http', host: 'localhost' }) {
        this._protocol = 'http';
        this._host = 'localhost';
        this._paths = [];
        this.params = new Map();
        this.init(defaults);
        if (value) {
            this.parse(value);
        }
    }
    init(defaults) {
        this.port = defaults.port;
        this.protocol = defaults.protocol;
        this.host = defaults.host;
    }
    /**
     * Parses a URL string, extracting its components.
     *
     * @param value - The URL string to parse.
     * @private
     */
    parse(value) {
        const url = new URL(value);
        this.protocol = url.protocol.slice(0, -1); // Remove trailing colon
        this.host = url.hostname;
        this.port = url.port !== '' ? parseInt(url.port, 10) : this.port;
        this.paths = url.pathname.split('/').filter(Boolean);
        url.searchParams.forEach((v, k) => {
            this.params.set(k, v);
        });
    }
    /**
     * Sets the protocol for the URL.
     *
     * @param protocol - The protocol to set.
     * @returns The instance of CmUrl for chaining.
     */
    setProtocol(protocol) {
        this.protocol = protocol;
        return this;
    }
    /**
     * Sets the host for the URL.
     *
     * @param host - The host to set.
     * @returns The instance of CmUrl for chaining.
     */
    setHost(host) {
        this.host = host;
        return this;
    }
    /**
     * Sets the port for the URL.
     *
     * @param port - The port number to set.
     * @returns The instance of CmUrl for chaining.
     */
    setPort(port) {
        this.port = port;
        return this;
    }
    /**
     * Appends a path segment to the URL's pathname.
     *
     * @param segment - The path segment to append.
     * @returns The instance of CmUrl for chaining.
     */
    appendPath(segment) {
        this.paths.push(segment);
        return this;
    }
    /**
     * Appends a query parameter to the URL.
     *
     * @param key - The key of the query parameter.
     * @param value - The value of the query parameter.
     * @returns The instance of CmUrl for chaining.
     */
    appendParam(key, value) {
        this.params.set(key, value);
        return this;
    }
    /**
     * Constructs the URL string from its components.
     *
     * @returns The constructed URL string.
     */
    toString() {
        const portPart = this.port ? `:${this.port}` : '';
        const pathPart = this.paths.join('/');
        const paramsPart = Array.from(this.params).map(([key, value]) => `${key}=${value}`).join('&');
        return `${this.protocol}://${this.host}${portPart}/${pathPart}${paramsPart ? '?' + paramsPart : ''}`;
    }
}
exports.default = CmUrl;
