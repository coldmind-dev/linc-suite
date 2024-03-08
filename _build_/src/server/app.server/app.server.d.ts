/**
 * Copyright (c) 2021 Patrik Forsberg <patrik.forsberg@coldmind.com> - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential.
 */
import "reflect-metadata";
import { LincServer } from "@server/linc.server";
import { ILincPlugin } from "@plugins/linc.plugin.type";
import { TSocketEvent } from "@shared/linc.event.types";
import { ILincServerEvent } from "@server/linc.server-event";
import { TCloseEvent } from "@shared/linc.event.types";
import { TSocketError } from "@shared/linc.event.types";
import { TMsgEvent } from "@shared/linc.event.types";
export declare class ChatPlugin implements ILincPlugin {
    constructor();
    initialize(server?: LincServer | undefined): Promise<void>;
    onClose(event: TCloseEvent): void;
    onError(event: TSocketError): void;
    onMessage(event: TMsgEvent): void;
    onOpen(event: TSocketEvent): void;
    onServerEvent(event: ILincServerEvent): void;
}
export declare class ExtLincServer extends LincServer {
    constructor();
}
