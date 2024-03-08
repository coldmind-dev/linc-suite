/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */

import { EventEmitter } from "events";
import { CMError }      from "~/error/cm.error";
import { TErrorCodes }  from "~/error/cm.error.types";

interface CancellationToken {
	isCancellationRequested: boolean;
	register(callback: () => void): void;
}

class SimpleCancellationToken implements CancellationToken {
	isCancellationRequested = false;
	private callbacks: Array<() => void> = [];

	register(callback: () => void) {
		this.callbacks.push(callback);
	}

	cancel() {
		this.isCancellationRequested = true;
		this.callbacks.forEach(cb => cb());
	}
}

interface ICMError {
	message: string;
	code: TErrorCodes;
	error?: ICMError | any;
}

type TNextFunction = (err?: ICMError) => void;
type TCMNextFunc = TNextFunction;
type TCMNanoWare<Task = {}, Context = {}> = (taskInfo: Task, context: Context, next: TCMNextFunc, ct: CancellationToken) => Promise<void> | void;

// ... Other types and interfaces remain the same

abstract class NanoEngine<Task = any, Context = any> extends EventEmitter {
	// ... Other members remain the same

	private async runMiddleware(
		nanoWare: TCMNanoWare<Task, Context>,
		taskInfo: Task,
		context: Context,
		next: TNextFunction,
		cancellationToken: CancellationToken
	): Promise<void> {
		const middlewarePromise = new Promise<void>((resolve, reject) => {
			cancellationToken.register(() => reject(new CMError(TErrorCodes.NANO_PROCESS_TIMEOUT, "Operation cancelled")));
			const result = nanoWare(taskInfo, context, next, cancellationToken);
			if (result instanceof Promise) {
				result.then(resolve).catch(reject);
			} else {
				resolve();
			}
		});

		await middlewarePromise;
	}

	public async run(taskInfo: Task, context: Context): Promise<ITaskResult> {
		const result: ITaskResult = {};
		const cancellationToken = new SimpleCancellationToken();

		if (this.config.processTimeout) {
			setTimeout(() => cancellationToken.cancel(), this.config.processTimeout);
		}

		let current = this.pipeline.head;

		while (current !== null && !cancellationToken.isCancellationRequested) {
			const { middleware } = current.data;
			await this.runMiddleware(middleware, taskInfo, context, (err) => {
				if (err) {
					this.config.globalLogger?.error(`Error: ${err.message}`);
					throw new Error(err.message);
				}
			}, cancellationToken);
			current = current.next;
		}

		return result;
	}
}

// ... Remaining code for configuring and running the NanoEngine stays the same
