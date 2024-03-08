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
/**
 * Defines default configuration for custom URL manipulation.
 */
export type TCmUrlDefaults = {
    port?: number;
    protocol?: string;
    host?: string;
};
/**
 * Represents a custom URL class for parsing, constructing, and manipulating URLs.
 */
declare class CmUrl {
    private _protocol;
    private _host;
    private _port?;
    private _paths;
    private params;
    get protocol(): string;
    set protocol(value: string);
    get host(): string;
    set host(value: string);
    get port(): number;
    set port(value: number);
    get paths(): string[];
    set paths(value: string[]);
    /**
     * Constructs a CmUrl instance, optionally parsing a provided URL string.
     *
     * @param value - The URL string to parse (optional).
     * @param defaults - Default values for protocol, host, and port.
     */
    constructor(value?: string, defaults?: TCmUrlDefaults);
    private init;
    /**
     * Parses a URL string, extracting its components.
     *
     * @param value - The URL string to parse.
     * @private
     */
    private parse;
    /**
     * Sets the protocol for the URL.
     *
     * @param protocol - The protocol to set.
     * @returns The instance of CmUrl for chaining.
     */
    setProtocol(protocol: string): CmUrl;
    /**
     * Sets the host for the URL.
     *
     * @param host - The host to set.
     * @returns The instance of CmUrl for chaining.
     */
    setHost(host: string): CmUrl;
    /**
     * Sets the port for the URL.
     *
     * @param port - The port number to set.
     * @returns The instance of CmUrl for chaining.
     */
    setPort(port: number): CmUrl;
    /**
     * Appends a path segment to the URL's pathname.
     *
     * @param segment - The path segment to append.
     * @returns The instance of CmUrl for chaining.
     */
    appendPath(segment: string): CmUrl;
    /**
     * Appends a query parameter to the URL.
     *
     * @param key - The key of the query parameter.
     * @param value - The value of the query parameter.
     * @returns The instance of CmUrl for chaining.
     */
    appendParam(key: string, value: string): CmUrl;
    /**
     * Constructs the URL string from its components.
     *
     * @returns The constructed URL string.
     */
    toString(): string;
}
export default CmUrl;
