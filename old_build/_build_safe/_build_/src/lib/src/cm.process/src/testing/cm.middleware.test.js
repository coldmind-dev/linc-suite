"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts_TCMNanoWare_types_1 = require("../ts-TCMNanoWare.types");
const cm_middleware_1 = require("~/cm.middleware");
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
 * particular purpose and non-infringement. In no event shall the authors or copyright
 * holders be liable for any claim, damages or other liability, whether in an action of
 * contract, tort or otherwise, arising from, out of or in connection with the software
 * or the use or other dealings in the software.
 *
 * @file
 * TaskRunner is a dependency-free, 100% TypeScript TCMNanoWare engine.
 * It is designed to be fast, adaptable, and slim, making it a natural choice for
 * any TypeScript project that requires TCMNanoWare functionality.
 *
 * @example
 * const runner = new TaskRunner({ emitStart: true, emitEnd: true });
 * runner.use(async (task, context, next) => {
 *   console.log("TCMNanoWare 1");
 *   next();
 * });
 * runner.handleTask({name: 'TaskName'}, {});
 *
 */
// Usage Examples
const config = {
    continueOnError: true,
    emitError: true,
    TCMNanoWareTimeout: 5000,
};
const app = new ts_TCMNanoWare_types_1.NanoEngine(config);
// TCMNanoWare to add timestamp
const timestampTCMNanoWare = async (taskInfo, context, next) => {
    taskInfo.timestamp = Date.now();
    next();
};
// TCMNanoWare to log the timestamp
const logTimestampTCMNanoWare = (taskInfo, context, next) => {
    console.log(`Task received at ${taskInfo.timestamp}`);
    next();
};
// TCMNanoWare to simulate an error
const simulateErrorTCMNanoWare = (taskInfo, context, next) => {
    throw new Error('Simulated Error');
};
// TCMNanoWare to complete the task
const completeTaskTCMNanoWare = (taskInfo, context, next) => {
    context.result = 'Task completed!';
    console.log(context.result);
    next();
};
// Add TCMNanoWare to the queue
app.use(timestampTCMNanoWare, cm_middleware_1.TNanoWareOrder.RUN_FIRST);
app.use(logTimestampTCMNanoWare, cm_middleware_1.TNanoWareOrder.RUN_AFTER, timestampTCMNanoWare);
app.use(simulateErrorTCMNanoWare, cm_middleware_1.TNanoWareOrder.RUN_BEFORE, completeTaskTCMNanoWare);
app.use(completeTaskTCMNanoWare, cm_middleware_1.TNanoWareOrder.RUN_LAST);
// Sample task and context
const taskInfo = {};
const context = {};
// Handle the task
app.handleTask(taskInfo, context).catch(err => {
    console.error('Error in handling task:', err);
});
// Listen to events
app.on(TEv.START, () => console.log('Task started'));
app.on(Events.END, () => console.log('Task ended'));
app.on(Events.ERROR, (err) => console.error('Task error:', err));
