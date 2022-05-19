import { Client, ConfigObject, create } from "@open-wa/wa-automate";
import { resolve } from "node:path";
import { CommandHandler } from "../utils/handlers/CommandHandler.js";
import { Logger } from "../utils/structures/Logger.js";
import { Utils } from "../utils/Utils.js";

export class WhatsappBot {
    public client!: Client;
    public logger = new Logger();
    public commands = new CommandHandler(
        this,
        resolve(Utils.importURLToString(import.meta.url), "../commands")
    );

    public listeners = new CommandHandler(
        this,
        resolve(Utils.importURLToString(import.meta.url), "../listeners")
    );

    public constructor(public readonly config?: ConfigObject) {
        void create(config).then(
            WhatsappClient => (this.client = WhatsappClient)
        );
    }
}
