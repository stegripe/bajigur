import { WhatsappBot } from "../../structures/WhatsappBot.js";
import { ICommandComponent } from "../../types/index.js";
import { Utils } from "../Utils.js";
import { Collection } from "@discordjs/collection";
import { Message } from "@open-wa/wa-automate";

export class CommandHandler extends Collection<string, ICommandComponent> {
    public readonly aliases: Collection<string, string> = new Collection();
    public constructor(
        public readonly whatsappbot: WhatsappBot,
        public readonly path: string
    ) {
        super();
    }

    public async load(): Promise<void> {
        const fileCommands = Utils.readdirRecursive(this.path);
        try {
            this.whatsappbot.logger.info(
                "command handler",
                `Loading ${fileCommands.length} command(s).`
            );
            for (const file of fileCommands) {
                const command = await Utils.import<ICommandComponent>(
                    file,
                    this.whatsappbot
                );
                if (command === undefined) {
                    this.whatsappbot.logger.error(
                        "command handler",
                        `File ${file} is not valid command file`
                    );
                    return;
                }
                if (this.has(command.meta.name)) {
                    this.whatsappbot.logger.warn(
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
                Object.freeze(Object.assign(command.meta, {
                    category,
                    path
                }));
                this.set(command.meta.name, command);
            }
        } catch (e) {
            this.whatsappbot.logger.error(
                "command handler",
                `COMMAND_LOADER_ERR: `,
                (e as Error).stack ?? (e as Error).message
            );
        } finally {
            this.whatsappbot.logger.info(
                "command handler",
                `Done Registering ${fileCommands.length} command(s).`
            );
        }
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async handle(message: Message, prefix: string): Promise<void> {
        const args = (message.caption || message.body)
            .substring(prefix.length)
            .trim()
            .split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        const command =
            this.get(commandName!) ??
            this.find(cmd => cmd.meta.aliases.includes(commandName!));
        if (!command) {
            this.whatsappbot.queue.shift();
            return undefined;
        }
        try {
            if (command.meta.disabled) {
                this.whatsappbot.queue.shift();
                return undefined;
            }
            return command.execute(message, args);
        } catch (e) {
            this.whatsappbot.queue.shift();
            this.whatsappbot.logger.error(
                "command handler",
                `COMMAND_HANDLER_ERR: `,
                (e as Error).stack ?? (e as Error).message
            );
        } finally {
            this.whatsappbot.queue.shift();
            this.whatsappbot.logger.info(
                "command handler",
                `Executing command: ${command.meta.name}`
            );
        }
    }
}
