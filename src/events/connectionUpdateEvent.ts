import { BaseListener } from "../structures/BaseListener";
import { ApplyMetadata } from "../utils/decorators";
import { IListenerComponent } from "../types";
import { BaileysEventMap, DisconnectReason } from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import { rmSync } from "node:fs";

@ApplyMetadata<IListenerComponent>({
    name: "connection.update"
})
export default class connectionUpdateEvent extends BaseListener {
    public async executeEvent({
        lastDisconnect,
        connection
    }: BaileysEventMap["connection.update"]): Promise<void> {
        const shouldReconnect =
            (lastDisconnect?.error as Boom | undefined)?.output.statusCode !==
            DisconnectReason.loggedOut;
        if (connection === "close") {
            this.client.logger.warn(
                `Connection closed due to ${lastDisconnect?.error?.message ?? "unknown reason"
                }, reconnecting ${shouldReconnect}`
            );
            if (shouldReconnect) {
                await this.client.start();
            } else {
                rmSync(`${process.cwd()}/auth_state`, {
                    recursive: true,
                    force: true
                });
            }
        } else if (connection === "open") {
            this.client.logger.info("Opened connection.");
            await this.client.commandHandler.init();
        }
    }
}
