import ApplyMetadata from "#bajigur/decorators/ApplyMetadata.js";
import Listener from "#bajigur/structures/Listener.js";
import { IListener } from "#bajigur/types/index.js";
import { Boom } from "@hapi/boom";
import { cast } from "@sapphire/utilities";
import { BaileysEventMap, DisconnectReason } from "@whiskeysockets/baileys";
import { rmSync } from "node:fs";

@ApplyMetadata<IListener>({
    name: "connection.update"
})
export default class connectionUpdateEvent extends Listener {
    public override async run({
        lastDisconnect,
        connection
    }: BaileysEventMap["connection.update"]): Promise<void> {
        const shouldReconnect =
            cast<Boom>(lastDisconnect?.error).output.statusCode.toString() !==
            DisconnectReason.loggedOut.toString();
        if (connection === "close") {
            this.client.logger.warn(
                `Connection closed due to ${
                    lastDisconnect?.error?.message ?? "unknown reason"
                }, reconnecting ${shouldReconnect}`
            );

            this.client.listeners.disconnectAll();

            if (!shouldReconnect) {
                rmSync(`${process.cwd()}/auth_state`, {
                    recursive: true,
                    force: true
                });
            }

            await this.client.connect();
        } else if (connection === "open") {
            this.client.logger.info("Opened connection.");
            await this.client.commands.init();
        }
    }
}
