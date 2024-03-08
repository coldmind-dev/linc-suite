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

import { CMSignalHub } from "@root/lib/cm.signal/cm.signal-hub";

describe('CMSignalHub', () => {
	it('should allow subscription and receive emitted values', done => {
		const subject = new CMSignalHub<string>();
		const expectedData = 'test data';

		subject.subscribe(data => {
			expect(data).toBe(expectedData);
			done();
		});

		subject.next(expectedData);
	});

	it('should handle errors', done => {
		const subject = new CMSignalHub<string>();
		const testError = new Error('test error');

		subject.subscribe(() => {}, error => {
			expect(error).toBe(testError);
			done();
		});

		subject.error(testError);
	});

	it('should notify completion', done => {
		const subject = new CMSignalHub<string>();

		subject.subscribe(() => {}, () => {}, () => {
			done(); // No need to assert here, completion is enough to pass the test
		});

		subject.complete();
	});

	it('should resolve as a promise with the next value', async () => {
		const subject = new CMSignalHub<string>();
		const expectedData = 'promise data';

		setTimeout(() => subject.next(expectedData), 10);

		await expect(subject.asPromise()).resolves.toBe(expectedData);
	});

	it('should reject as a promise on error', async () => {
		const subject = new CMSignalHub<string>();
		const testError = new Error('promise error');

		setTimeout(() => subject.error(testError), 10);

		await expect(subject.asPromise()).rejects.toThrow(testError);
	});

	it('should stop emitting after completion', () => {
		const subject = new CMSignalHub<string>();
		const onData = jest.fn();
		const onComplete = jest.fn();

		subject.subscribe((data: any) => {}, error => {
			expect(error).toBeNull();
		});

		subject.complete();
		subject.next('should not emit');

		expect(onData).not.toHaveBeenCalled();
		expect(onComplete).toHaveBeenCalled();
	});

	it('should stop emitting after error', () => {
		const subject = new CMSignalHub<string>();
		const onData = jest.fn();
		const onError = jest.fn();

		subject.subscribe(onData, onError);
		subject.error(new Error('stop after this error'));
		subject.next('should not emit');

		expect(onData).not.toHaveBeenCalled();
		expect(onError).toHaveBeenCalled();
	});
});
