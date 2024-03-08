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
 */

// middlewareTestingToolkit.js
const timestampMiddleware = require('./timestampMiddleware');

// Create a test context object.
const createTestContext = () => {
	return {
		// Add any properties or methods needed for testing here.
	};
};

// Create a test taskInfo object.
const createTestTaskInfo = () => {
	return {
		// Add any properties needed for testing here.
	};
};

// Create a mock for the `next` function.
const createTestNext = () => {
	return jest.fn();
};

// Test the timestampMiddleware function.
const testTimestampMiddleware = async () => {
	const taskInfo = createTestTaskInfo();
	const context = createTestContext();
	const next = createTestNext();

	// Invoke the middleware function.
	await timestampMiddleware(taskInfo, context, next);

	// Perform assertions to validate the middleware behavior.
	expect(taskInfo.timestamp).toBeDefined(); // Check if timestamp is added.
	expect(next).toHaveBeenCalledTimes(1); // Check if `next` was called once.
};

module.exports = {
	createTestContext,
	createTestTaskInfo,
	createTestNext,
	testTimestampMiddleware,
};
