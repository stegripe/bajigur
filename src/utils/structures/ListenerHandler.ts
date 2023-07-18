import { importClass, readdirRecursive } from "../functions";
import { WhatsAppBot } from "../../structures/WhatsAppBot";
import { IListenerComponent } from "../../types";
import { resolve } from "path";

export class ListenerHandler {
    public constructor(
        public readonly client: WhatsAppBot,
        public readonly path: string
    ) { }

    public async init(): Promise<void> {
        try {
            const files = readdirRecursive(this.path);
            this.client.logger.info(
                `Found ${files.length} listeners, registering...`
            );
            for (const file of files) {
                const event = await importClass<IListenerComponent>(
                    resolve(file),
                    this.client
                );
                if (event) {
                    this.client.socket?.ev.on(event.meta.name, (...args) =>
                        event.executeEvent(...args)
                    );
                    this.client.logger.info(
                        `Registered ${event.meta.name} listener.`
                    );
                } else {
                    this.client.logger.warn(`Invalid event file: ${file}.`);
                }
            }
        } catch (err) {
            this.client.logger.error("EVENT_HANDLER_ERROR", err);
        } finally {
            this.client.logger.info("Done loading events.");
        }
    }
}
