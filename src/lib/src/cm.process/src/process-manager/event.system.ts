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

import EventEmitter from 'events';



export enum TProcessStatus {
	ready,
	starting,
	resuming,
	running,
	suspending,
	suspended,
	unresponsive,
	terminating,
	terminated
}

const cmdTree = {
	ready: {
		start: {
			status: TProcessStatus.starting
		}
	}
}


export enum TProcessCmd {
	start,
	stop,
	resume,
	terminate,
	suspend
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

type ProcessFn = (data: any) => Promise<any>;

class ProcessContainer {
	private _prevStatus: TProcessStatus.ready;
	private _currStatus: TProcessStatus.ready;

	constructor(
		public id: number,
		public name: string,
		private fn: ProcessFn
	) {
	}

	set status(value: TProcessStatus) {
		const allowed = new Array<TProcessCmd>();
		switch (value) {
			case TProcessStatus.ready:
				allowed.push(TProcessCmd.terminate, TProcessCmd.start)
		}
	}

	public async run() {

	}


	public start() {

	}
}


class ProcessPipeline extends EventEmitter {
	private static idCounter = 1;
	private processes: Map<number, ProcessContainer> = new Map();
	private processInfo: Map<number, IProcessInfo> = new Map();

	constructor() {
		super();
		// Register event handlers for better event-based processing
		this.on('startProcess', this.handleStartProcess.bind(this));
		this.on('suspendProcess', this.handleSuspendProcess.bind(this));
		this.on('restartProcess', this.handleRestartProcess.bind(this));
	}

	async execute(id: number, ...inputData: any[]): Promise<IAsyncResult<any>> {
		const process = this.processes.get(id);
		if (!process) {
			return { success: false, error: 'Process not found' };
		}

		try {
			const result = await process.call(inputData);
			return { success: true, data: result };
		} catch (error) {
			return { success: false, error: 'Process execution failed' };
		}
	}

	async registerProcess(name: string, process: ProcessFn, autoStart?: boolean): Promise<IAsyncResult<number>> {
		if (typeof process !== 'function') {
			return { success: false, error: 'Invalid process signature' };
		}

		const id = ProcessPipeline.idCounter++;
		this.processes.set(id, new ProcessContainer(id, name, process));
		this.processInfo.set(id, { id, name, status: TProcessStatus.running });

		this.emit('processRegistered', id);

		return { success: true, data: id };
	}

	async getProcessList(): Promise<IProcessInfo[]> {
		return Array.from(this.processInfo.values());
	}

	async getProcessInfo(id: number): Promise<IAsyncResult<IProcessInfo>> {
		const info = this.processInfo.get(id);
		if (!info) {
			return { success: false, error: 'Process not found' };
		}
		return { success: true, data: info };
	}

	private async handleStartProcess(id: number): Promise<IAsyncResult<boolean>> {
		const info = this.processInfo.get(id);
		if (!info) {
			return { success: false, error: 'Process not found' };
		}
		info.status = 'running';
		return { success: true, data: true };
	}

	private async handleSuspendProcess(id: number): Promise<IAsyncResult<boolean>> {
		const info = this.processInfo.get(id);
		if (!info) {
			return { success: false, error: 'Process not found' };
		}
		info.status = 'suspended';
		return { success: true, data: true };
	}

	private async handleRestartProcess(id: number): Promise<IAsyncResult<boolean>> {
		const info = this.processInfo.get(id);
		if (!info) {
			return { success: false, error: 'Process not found' };
		}
		info.status = 'terminated';
		info.status = 'running';
		return { success: true, data: true };
	}
}

export { ProcessPipeline, IProcessInfo, IAsyncResult };
