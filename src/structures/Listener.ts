import readdirRecursive from "#bajigur/utils/ReadDirRecursive.js";
import importClass from "#bajigur/utils/ImportClass.js";
import { IListener } from "#bajigur/types/index.js";
import BajigurClient from "./BajigurClient.js";
import { BaileysEvent, BaileysEventMap } from "@whiskeysockets/baileys";
import { Collection } from "@discordjs/collection";
import { resolve } from "path";

export default abstract class Listener implements IListener {
    public constructor(
        public readonly client: BajigurClient,
        public readonly meta: IListener["meta"]
    ) {}

    public run(_data: BaileysEventMap[BaileysEvent]): void {
        this.client.logger.info(`Event ${this.meta.name} is not yet implemented.`);
    }
}

export class ListenerHandler {
    public readonly list = new Collection<string, IListener>();

    public constructor(
        public readonly client: BajigurClient,
        public readonly path: string
    ) {}

    public async init(): Promise<void> {
        try {
            const files = readdirRecursive(this.path);
            this.client.logger.info(`Found ${files.length} listeners, registering...`);
            for (const file of files) {
                const event = await importClass<IListener>(resolve(file), this.client);
                if (event) {
                    this.client.socket?.ev.on(event.meta.name, (...args) => event.run(...args));
                    this.client.logger.info(`Registered ${event.meta.name} listener.`);
                    this.list.set(event.meta.name, event);
                } else {
                    this.client.logger.warn(`Invalid event file: ${file}.`);
                }
            }
        } catch (err) {
            this.client.logger.error(err);
        } finally {
            this.client.logger.info("Done loading events.");
        }
    }

    public disconnectAll(): void {
        this.list.map(event => {
            this.client.socket?.ev.off(event.meta.name, event.run);
            this.client.logger.info(`Unregistered ${event.meta.name} listener.`);
        });
    }
}
