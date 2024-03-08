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
exports.ErrorCodes = void 0;
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes[ErrorCodes["errNone"] = 0] = "errNone";
    ErrorCodes[ErrorCodes["errUnknown"] = 1] = "errUnknown";
    ErrorCodes[ErrorCodes["errTimeOut"] = 2] = "errTimeOut";
    ErrorCodes[ErrorCodes["errNanoWareMissing"] = 3] = "errNanoWareMissing";
    ErrorCodes[ErrorCodes["errRefMissing"] = 4] = "errRefMissing";
    ErrorCodes[ErrorCodes["errNoTask"] = 5] = "errNoTask";
    ErrorCodes[ErrorCodes["errNoContext"] = 6] = "errNoContext";
    ErrorCodes[ErrorCodes["errTest"] = 7] = "errTest";
})(ErrorCodes = exports.ErrorCodes || (exports.ErrorCodes = {}));
