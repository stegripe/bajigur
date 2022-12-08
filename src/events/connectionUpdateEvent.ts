import {
    AuthenticationCreds,
    BaileysEventMap,
    DisconnectReason
} from "@adiwajshing/baileys";
import { Boom } from "@hapi/boom";
import { rmSync } from "node:fs";
import { BaseListener } from "../structures/BaseListener";
import { IListenerComponent } from "../types";
import { ApplyMetadata } from "../utils/decorators";

@ApplyMetadata<IListenerComponent>({
    name: "connection.update"
})
export default class connectionUpdateEvent extends BaseListener {
    public async executeEvent({
        lastDisconnect,
        connection
    }: BaileysEventMap<AuthenticationCreds>["connection.update"]): Promise<void> {
        const shouldReconnect =
            (lastDisconnect?.error as Boom | undefined)?.output.statusCode !==
            DisconnectReason.loggedOut;
        if (connection === "close") {
            this.client.logger.warn(
                `Connection closed due to ${
                    lastDisconnect?.error?.message ?? "unknown reason"
                }, reconnecting ${shouldReconnect}`
            );
            // reconnect if not logged out
            if (shouldReconnect) {
                await this.client.start();
            } else {
                rmSync(`${process.cwd()}/auth_state`, {
                    recursive: true,
                    force: true
                });
            }
        } else if (connection === "open") {
            this.client.logger.info("opened connection");
            await this.client.commandHandler.init();
        }
    }
}
