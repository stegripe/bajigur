import { CommandHandler } from "../utils/handlers/CommandHandler.js";
import { ListenerHandler } from "../utils/handlers/ListenerHandler.js";
import { Logger } from "../utils/structures/Logger.js";
import { Utils } from "../utils/Utils.js";
import { Client, ConfigObject, create } from "@open-wa/wa-automate";
import { AsyncQueue } from "@sapphire/async-queue";
import { resolve } from "node:path";
import got from "got";
import * as Config from "../config";

export class WhatsappBot {
    public client!: Client;
    public readonly config = Config;
    public readonly logger = new Logger();
    public readonly request = got;
    public readonly queue = new AsyncQueue();
    public readonly commands = new CommandHandler(
        this,
        resolve(Utils.importURLToString(import.meta.url), "../commands")
    );

    public readonly listeners = new ListenerHandler(
        this,
        resolve(Utils.importURLToString(import.meta.url), "../listeners")
    );

    public constructor(config?: ConfigObject) {
        void create(config).then(whatsappClient => this.start(whatsappClient));
    }

    public async start(whatsappClient: Client): Promise<void> {
        this.client = whatsappClient;
        await this.listeners.load();
        await this.commands.load();
        await whatsappClient.onMessage(async message => {
            if (
                (message.caption || message.body).startsWith(this.config.prefix)
            ) {
                await this.queue.wait();
                await this.commands.handle(message, this.config.prefix);
            }
        });
    }
}
