"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cm_signal_hub_1 = require("@root/lib/cm.signal/cm.signal-hub");
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
// Create an instance of the EnhancedSubject
const dataSubject = new cm_signal_hub_1.CMSignalHub();
// Function to simulate data updates
function simulateDataUpdates() {
    setTimeout(() => dataSubject.next("Data 1"), 1000); // Emit data after 1 second
    setTimeout(() => dataSubject.next("Data 2"), 2000); // Emit more data after 2 seconds
    setTimeout(() => dataSubject.error(new Error("An error occurred")), 3000); // Emit an error after 3 seconds
}
// Subscribe to the subject to receive data updates
const dataSubscription = dataSubject.subscribe(data => console.log(`Received data: ${data}`), error => console.error(`Error received: ${error.message}`), () => console.log('Data stream completed.'));
// Subscribe again to demonstrate multiple observers
const anotherDataSubscription = dataSubject.subscribe(data => console.log(`Another subscription received data: ${data}`), error => console.error(`Another subscription error received: ${error.message}`), () => console.log('Another data stream completed.'));
// Demonstrate promise consumption for one-off operation
dataSubject.asPromise().then(data => console.log(`Promise resolved with data: ${data}`), error => console.error(`Promise rejected with error: ${error.message}`)).catch(error => console.error(`Catch block for promise: ${error.message}`));
// Start simulating data updates
simulateDataUpdates();
// Simulate cleanup by unsubscribing from the subject
setTimeout(() => {
    dataSubscription.unsubscribe();
    console.log('Unsubscribed from data updates.');
}, 4000); // Unsubscribe after 4 seconds
// Note: In this example, the error will occur before the unsubscribe due to the simulation timing.
// The promise will also resolve or reject based on the subject's behavior before the unsubscribe call.
