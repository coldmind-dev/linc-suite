"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessPipeline = exports.TProcessCmd = exports.TProcessStatus = void 0;
const events_1 = __importDefault(require("events"));
var TProcessStatus;
(function (TProcessStatus) {
    TProcessStatus[TProcessStatus["ready"] = 0] = "ready";
    TProcessStatus[TProcessStatus["starting"] = 1] = "starting";
    TProcessStatus[TProcessStatus["resuming"] = 2] = "resuming";
    TProcessStatus[TProcessStatus["running"] = 3] = "running";
    TProcessStatus[TProcessStatus["suspending"] = 4] = "suspending";
    TProcessStatus[TProcessStatus["suspended"] = 5] = "suspended";
    TProcessStatus[TProcessStatus["unresponsive"] = 6] = "unresponsive";
    TProcessStatus[TProcessStatus["terminating"] = 7] = "terminating";
    TProcessStatus[TProcessStatus["terminated"] = 8] = "terminated";
})(TProcessStatus = exports.TProcessStatus || (exports.TProcessStatus = {}));
const cmdTree = {
    ready: {
        start: {
            status: TProcessStatus.starting
        }
    }
};
var TProcessCmd;
(function (TProcessCmd) {
    TProcessCmd[TProcessCmd["start"] = 0] = "start";
    TProcessCmd[TProcessCmd["stop"] = 1] = "stop";
    TProcessCmd[TProcessCmd["resume"] = 2] = "resume";
    TProcessCmd[TProcessCmd["terminate"] = 3] = "terminate";
    TProcessCmd[TProcessCmd["suspend"] = 4] = "suspend";
})(TProcessCmd = exports.TProcessCmd || (exports.TProcessCmd = {}));
class ProcessContainer {
    constructor(id, name, fn) {
        this.id = id;
        this.name = name;
        this.fn = fn;
    }
    set status(value) {
        const allowed = new Array();
        switch (value) {
            case TProcessStatus.ready:
                allowed.push(TProcessCmd.terminate, TProcessCmd.start);
        }
    }
    async run() {
    }
    start() {
    }
}
class ProcessPipeline extends events_1.default {
    constructor() {
        super();
        this.processes = new Map();
        this.processInfo = new Map();
        // Register event handlers for better event-based processing
        this.on('startProcess', this.handleStartProcess.bind(this));
        this.on('suspendProcess', this.handleSuspendProcess.bind(this));
        this.on('restartProcess', this.handleRestartProcess.bind(this));
    }
    async execute(id, ...inputData) {
        const process = this.processes.get(id);
        if (!process) {
            return { success: false, error: 'Process not found' };
        }
        try {
            const result = await process.call(inputData);
            return { success: true, data: result };
        }
        catch (error) {
            return { success: false, error: 'Process execution failed' };
        }
    }
    async registerProcess(name, process, autoStart) {
        if (typeof process !== 'function') {
            return { success: false, error: 'Invalid process signature' };
        }
        const id = ProcessPipeline.idCounter++;
        this.processes.set(id, new ProcessContainer(id, name, process));
        this.processInfo.set(id, { id, name, status: TProcessStatus.running });
        this.emit('processRegistered', id);
        return { success: true, data: id };
    }
    async getProcessList() {
        return Array.from(this.processInfo.values());
    }
    async getProcessInfo(id) {
        const info = this.processInfo.get(id);
        if (!info) {
            return { success: false, error: 'Process not found' };
        }
        return { success: true, data: info };
    }
    async handleStartProcess(id) {
        const info = this.processInfo.get(id);
        if (!info) {
            return { success: false, error: 'Process not found' };
        }
        info.status = 'running';
        return { success: true, data: true };
    }
    async handleSuspendProcess(id) {
        const info = this.processInfo.get(id);
        if (!info) {
            return { success: false, error: 'Process not found' };
        }
        info.status = 'suspended';
        return { success: true, data: true };
    }
    async handleRestartProcess(id) {
        const info = this.processInfo.get(id);
        if (!info) {
            return { success: false, error: 'Process not found' };
        }
        info.status = 'terminated';
        info.status = 'running';
        return { success: true, data: true };
    }
}
exports.ProcessPipeline = ProcessPipeline;
ProcessPipeline.idCounter = 1;
