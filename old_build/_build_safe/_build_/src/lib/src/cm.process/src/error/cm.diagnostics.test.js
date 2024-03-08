"use strict";
/**
 * Copyright (c) 2023 Coldmind AB
 *
 * @author Patrik Forsberg
 * @contact patrik.forsberg@coldmind.com
 * @date 2023-10-12
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
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const cm_diagnostics_1 = require("./cm.diagnostics");
describe('Diagnostics', () => {
    it('should create an instance of Diagnostics', () => {
        const error = new cm_diagnostics_1.CMDiagnostics('Test message', TErrorCodes.errTest);
        (0, chai_1.expect)(error).to.be.an.instanceOf(cm_diagnostics_1.CMDiagnostics);
    });
    it('should correctly capture and parse the stack trace', () => {
        const error = new Diagnostics('Test message', TErrorCodes.errTest);
        const stackFrames = error.parseStackTrace();
        // Add assertions to test stackFrames.
        // For example, you can check the length or specific properties of stackFrames.
        (0, chai_1.expect)(stackFrames).to.be.an('array');
        (0, chai_1.expect)(stackFrames).to.have.lengthOf.at.least(1);
        // Add more assertions as needed.
    });
    // Add more test cases as needed.
});
