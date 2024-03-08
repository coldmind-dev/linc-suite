/**
 * Copyright (c) 2023 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2023-10-11
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

import { EventEmitter } from "events";
import { CMError }      from "./error/cm.error";
import { TErrorCodes }  from "./error/cm.error.types";
import { TNanoEvent }   from "./cm.middleware.types";

interface ICMError {
	message: string;
	code: TErrorCodes;
	error?: ICMError | any;
}

type TNextFunction = (err?: ICMError) => void;

/**
 * Type for the next function, optionally accepting an error.
 */
type TCMNextFunc = (err?: ICMError) => void;

/**
 * Type for a middleware function.
 */
type TCMNanoWare<Task = {}, Context = {}> = (taskInfo: Task, context: Context, next: TCMNextFunc) => Promise<void> | void;

type TKeyLike = number | string | symbol;
type TVoidResult = Promise<void> | void;


/**
 * Interface for task.
 */
interface ITaskResult<T = any> extends INanoRecord<string, T> {
}


/**
 * Interface for NanoWare result.
 */
interface ICMNanoResult<K extends number | string | symbol = string, V = any> extends INanoRecord<K, V> {
}

type TNanoResult<K extends TKeyLike = string, V = any> = Promise<ICMNanoResult<K, V>> | ICMNanoResult<K, V>;

type TCMNanoWareResult = TNanoResult | TVoidResult;

/**
 * @interface INanoTaskRecord
 * Represents a record of tasks with relevant metadata.
 */
interface INanoTaskRecord {
	taskId?: string;
	status?: 'pending' | 'in-progress' | 'completed' | 'failed';
	taskBeginTimeStamp?: number;
	taskEndTimeStamp?: number;
}

/**
 * Construct a type with a set of properties K of type T
 */
type TRecord<K extends keyof any, T> = {
	[P in K]: T;
}

/**
 * Interface for task record.
 */
interface INanoRecord<K extends TKeyLike, T> {
}

/**
 * Configuration for middleware.
 */
interface INanoEngineConfig {
	debugMode?: boolean;
	continueOnError?: boolean;
	muteErrors?: boolean;
	processTimeout?: number;
}

interface INanoLog {
	debug: (message: string, ...additionalArgs: any[]) => void;
	info: (message: string, ...additionalArgs: any[]) => void;
	error: (message: string, ...additionalArgs: any[]) => void;
	warn: (message: string, ...additionalArgs: any[]) => void;
}

enum TNanoWareOrder {
	runFirst,
	runLast,
	runAfter,
	runBefore
}

/**
 * @interface NanoCoreTaskSlot
 * Defines a slot for holding middleware, its position, and reference.
 */
interface INanoTaskSlot<Task, Context> {
	middleware: TCMNanoWare<Task, Context>;
	position: TNanoWareOrder | null;
	reference: TCMNanoWare<Task, Context> | null;
}

class NanoTaskSlot<Task, Context> implements INanoTaskSlot<Task, Context> {
	constructor(public middleware: TCMNanoWare<Task, Context>,
				public position: TNanoWareOrder | null,
				public reference: TCMNanoWare<Task, Context> | null
	) {
	}
}

/////////////////////////////////////////////////////////

// IMPLEMENTATION

////////////////////////////////////////////////////////


/**
 * @class NanoEngine
 * @classdesc NanoEngine is a base engine for management of small and
 * specialized tasks.
 */
abstract class NanoEngine<Task = any, Context = any> extends EventEmitter {
	private pipeline: INanoTaskSlot<Task, Context>[] = [];
	private config: INanoEngineConfig;

	constructor(config: INanoEngineConfig) {
		super();
		this.config = config;
	}

	private insertMiddleware(
		middleware: TCMNanoWare<Task, Context>,
		order: TNanoWareOrder,
		reference: TCMNanoWare<Task, Context> | null
	) {
		const item  = new NanoTaskSlot(middleware, order, reference);
		const index = this.pipeline.findIndex(m => m.middleware === reference);

		if (order === TNanoWareOrder.runFirst) {
			this.pipeline.unshift(item);
		}
		else if (order === TNanoWareOrder.runLast) {
			this.pipeline.push(item);
		}
		else if (order === TNanoWareOrder.runAfter || order === TNanoWareOrder.runBefore) {
			if (index !== -1) {
				this.pipeline.splice(order === TNanoWareOrder.runBefore ? index : index + 1, 0, item);
			}
			else {
				throw CMError.fromCode(TErrorCodes.errRefMissing);
			}
		}
		else {
			this.pipeline.push(item);
		}
	}

	/**
	 * Add a middleware function to the pipeline.
	 *
	 * @param {TCMNanoWare<Task, Context>} middleware
	 * @param {TNanoWareOrder} position
	 * @param {TCMNanoWare<Task, Context>} reference
	 */
	public use(
		middleware: TCMNanoWare<Task, Context>,
		position?: TNanoWareOrder,
		reference?: TCMNanoWare<Task, Context>
	) {
		this.insertMiddleware(middleware, position || TNanoWareOrder.runLast, reference || null);
	}

	/**
	 * Register one or more middleware functions.
	 * @param {TMiddleware<Task, Context>} middlewares
	 */
	public register(...middlewares: TCMNanoWare<Task, Context>[]) {
		middlewares.forEach(middleware => this.use(middleware));
	}

	/**
	 * Runs a single nanoWare function.
	 * @param {TMiddleware<Task, Context>} nanoWare - The nanoWare function.
	 * @param {Task} taskInfo - The task information.
	 * @param {Context} context - The context.
	 * @param {TNextFunction} next - The next function in the nanoWare chain.
	 */
	private async runMiddleware(
		nanoWare: TCMNanoWare<Task, Context>,
		taskInfo: Task,
		context: Context,
		next: TNextFunction
	): Promise<void> {
		const middlewarePromise = nanoWare(taskInfo, context, next);
		if (middlewarePromise instanceof Promise) {
			await this.handleTimeout(middlewarePromise);
		}
	}

	/**
	 * Emits a specified event if it is enabled in the configuration.
	 * @param {TEvents} eventName - The name of the event to emit.
	 * @param {...any[]} args - Additional arguments to pass to the event listeners.
	 */
	private emitEvent(eventName: TNanoEvent, ...args: any[]): void {
		if (this.config[ `emit${ eventName.charAt(0).toUpperCase() }${ eventName.slice(1).toLowerCase() }` ]) {
			this.emit(eventName, ...args);
		}
	}

	/**
	 * Handles the middleware execution timeout.
	 * @param {Promise<void>} middlewarePromise - The middleware promise.
	 */
	private timeoutPromise(): Promise<void> {
		return new Promise<void>((_, reject) => {
			setTimeout(() => reject(CMError.create(TErrorCodes.errTimeOut, "Middleware timeout")), this.config.processTimeout);
		});
	}

	/**
	 * Handles the middleware execution timeout.
	 * @param {Promise<void>} middlewarePromise - The middleware promise.
	 */
	private async handleTimeout(middlewarePromise: Promise<void>): Promise<void> {
		await Promise.race(
			[
				middlewarePromise,
				this.timeoutPromise()
			]);
	}

	/**
	 * @method execute
	 * Executes the middleware pipeline.
	 * @private
	 * @param {number} index
	 * @param {Task} taskInfo
	 * @param {Context} context
	 * @returns {Promise<void>}
	 */
	private async execute(index: number, taskInfo: Task, context: Context): Promise<void> {
		if (index >= this.pipeline.length) {
			this.emit(TNanoEvent.END, taskInfo, context);
			return;
		}

		let nextCalled            = false;
		const next: TNextFunction = async (err?: ICMError) => {
			if (nextCalled) return;
			nextCalled = true;

			if (err && !this.config.muteErrors) this.emit(TNanoEvent.ERROR, err, taskInfo, context);
			if (this.config.continueOnError || !err) await this.execute(index + 1, taskInfo, context);
		};

		let timeOut          = this.config.processTimeout || 5000;
		const timeoutPromise = new Promise<void>((_,
												  reject
												 ) => setTimeout(() => reject(CMError.create(TErrorCodes.errTimeOut)), timeOut));

		try {
			const middlewarePromise = this.pipeline[ index ].middleware(taskInfo, context, next);
			if (middlewarePromise instanceof Promise) {
				await Promise.race([ middlewarePromise, timeoutPromise ]);
			}
		}
		catch (err) {
			if ( !nextCalled && !this.config.muteErrors) this.emit(TNanoEvent.ERROR, err, taskInfo, context);
			if ( !nextCalled && this.config.continueOnError) await this.execute(index + 1, taskInfo, context);
		}
	}

	/**
	 * @method handleTask
	 * Handles task execution through middleware pipeline.
	 * @param {Task} taskInfo
	 * @param {Context} context
	 * @returns {Promise<void>}
	 */
	async handleTask(taskInfo: Task, context: Context): Promise<void> {
		this.emit(TNanoEvent.BEGIN, taskInfo, context);
		await this.execute(0, taskInfo, context);
	}
}

class CMNanoMiddleware<Task, Context> extends NanoEngine<Task, Context> {
	constructor(config: INanoEngineConfig) {
		super(config);
	}
}

export {
	TCMNanoWare,
	TNextFunction,
	INanoEngineConfig,
	INanoTaskSlot,
	TNanoWareOrder,
	NanoEngine
};

const config: INanoEngineConfig = {
	continueOnError: true,
	muteErrors     : false,
	processTimeout : 2000,
};

type MyTaskInfo = {
	id: number;
	name: string;
};

type MyContext = {
	timestamp: number;
};

const middleware1: TCMNanoWare<MyTaskInfo, MyContext> = async (taskInfo, context, next) => {
	console.log("Middleware 1");
	console.log("Task Info:", taskInfo);
	console.log("Context:", context);
	next();
};

const middleware2: TCMNanoWare<MyTaskInfo, MyContext> = async (taskInfo, context, next) => {
	console.log("Middleware 2");
	if (taskInfo.id < 0) {
		next(CMError.create(TErrorCodes.errNoTask, "Negative ID found"));
	}
	next();
};

const middleware3: TCMNanoWare<MyTaskInfo, MyContext> = async (taskInfo, context, next) => {
	console.log("Middleware 3");
	console.log("Task Info:", taskInfo);
	console.log("Context:", context);
	next();
};

const nanoEngine = new CMNanoMiddleware<MyTaskInfo, MyContext>(config);

nanoEngine.on("start", (taskInfo, context) => {
	console.log("Start event emitted");
});

nanoEngine.on("end", (taskInfo, context) => {
	console.log("End event emitted");
});

nanoEngine.on("error", (err, taskInfo, context) => {
	console.log("Error event emitted");
	console.log(err);
});

nanoEngine.register(
	middleware1,
	middleware2,
	middleware3
);

const task: MyTaskInfo = {
	id  : 1,
	name: "First Task",
};

const context: MyContext = {
	timestamp: Date.now(),
};

nanoEngine.handleTask(task, context).catch(err => {
	console.error("Error in pipeline:", err);
});
