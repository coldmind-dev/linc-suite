/**
 * Copyright (c) 2023 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2023-10-14
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
/// <reference types="node" />
import EventEmitter from 'events';
export declare enum TProcessStatus {
    ready = 0,
    starting = 1,
    resuming = 2,
    running = 3,
    suspending = 4,
    suspended = 5,
    unresponsive = 6,
    terminating = 7,
    terminated = 8
}
export declare enum TProcessCmd {
    start = 0,
    stop = 1,
    resume = 2,
    terminate = 3,
    suspend = 4
}
interface IProcessInfo {
    id: number;
    name: string;
    status: TProcessStatus;
}
interface IAsyncResult<T> {
    success: boolean;
    data?: T;
    error?: string;
}
declare type ProcessFn = (data: any) => Promise<any>;
declare class ProcessPipeline extends EventEmitter {
    private static idCounter;
    private processes;
    private processInfo;
    constructor();
    execute(id: number, ...inputData: any[]): Promise<IAsyncResult<any>>;
    registerProcess(name: string, process: ProcessFn, autoStart?: boolean): Promise<IAsyncResult<number>>;
    getProcessList(): Promise<IProcessInfo[]>;
    getProcessInfo(id: number): Promise<IAsyncResult<IProcessInfo>>;
    private handleStartProcess;
    private handleSuspendProcess;
    private handleRestartProcess;
}
export { ProcessPipeline, IProcessInfo, IAsyncResult };
