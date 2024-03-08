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
import { SocketError } from "@root/classes";
export declare enum TLincServerEvent {
    NONE = "none",
    CONNECTING = "connecting",
    CONNECTION = "connection",
    CLOSE = "close",
    ERROR = "error",
    HEADERS = "headers",
    LISTENING = "listening",
    MESSAGE = "message",
    OPEN = "open",
    UPGRADE = "upgrade",
    Ding = "ding",
    Dong = "dong",
    Ack = "ack"
}
export declare type TSocketEvent<T = any> = {
    code?: number;
    data?: T;
    error?: TSocketError;
};
export declare type TSocketError = SocketError | Error | any;
export declare type TBlobDataType = string | Blob;
export declare type TLincDataType = string | Blob | ArrayBufferLike | ArrayBufferView;
export declare type TErrorEvent = {
    data?: TSocketError;
};
export declare type TMsgEvent = {
    data: any;
};
export declare type TCloseEvent = {
    code?: number;
    reason?: string;
};
export declare type TReconnectEvent = {
    attempt?: number;
};
