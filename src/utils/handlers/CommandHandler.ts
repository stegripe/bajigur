import { WhatsappBot } from "../../structures/WhatsappBot.js";
import { ICommandComponent } from "../../types/index.js";
import { Utils } from "../Utils.js";
import { Collection } from "@discordjs/collection";
import { resolve } from "node:path";

export class CommandHandler extends Collection<string, unknown> {
    public constructor(
        public readonly client: WhatsappBot,
        public readonly path: string
    ) {
        super();
    }

    public async load(): Promise<void> {
        const fileCommands = Utils.readdirRecursive(this.path);
        try {
            for (const file of fileCommands) {
                const command = await Utils.import<ICommandComponent>(
                    resolve(file),
                    this.client
                );
                if (command === undefined) {
                    this.client.logger.error(
                        "command handler",
                        `File ${file} is not valid command file`
                    );
                    return;
                }
                if (this.has(command.meta.name)) {
                    this.client.logger.warn(
                        "command handler",
                        `Duplicate command name detected: ${command.meta.name}, path: ${file}`
                    );
                    return;
                }
                const parseCategory = file.substring(0, file.lastIndexOf("/"));
                const category = parseCategory
                    .substring(parseCategory.lastIndexOf("/") + 1)
                    .toLowerCase();
                const path = file;
                Object.freeze(Object.assign(command.meta, { category, path }));
                this.set(command.meta.name, command);
            }
        } catch (e) {
            this.client.logger.error(
                "command handler",
                `COMMAND_LOADER_ERR: `,
                (e as Error).stack ?? (e as Error).message
            );
        } finally {
            this.client.logger.info(
                "command handler",
                `Done Registering ${fileCommands.length} command(s).`
            );
        }
    }
}
