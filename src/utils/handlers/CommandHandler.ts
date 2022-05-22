import { Collection } from "@discordjs/collection";
import { Message } from "@open-wa/wa-automate";
import { WhatsappBot } from "../../structures/WhatsappBot.js";
import { ICommandComponent } from "../../types/index.js";
import { Utils } from "../Utils.js";

export class CommandHandler extends Collection<string, ICommandComponent> {
    public readonly aliases: Collection<string, string> = new Collection();
    public categories!: Record<
        "developers" | "general",
        ICommandComponent[] | undefined
    >;

    public constructor(
        public readonly whatsappbot: WhatsappBot,
        public readonly path: string
    ) {
        super();
    }

    public async load(): Promise<void> {
        const fileCommands = Utils.readdirRecursive(this.path);
        let unableToLoad = 0;
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
                    unableToLoad++;
                    continue;
                }
                if (this.has(command.meta.name)) {
                    this.whatsappbot.logger.warn(
                        "command handler",
                        `Duplicate command name detected: ${command.meta.name}, path: ${file}`
                    );
                    unableToLoad++;
                    continue;
                }
                const category = file
                    .split(/\/|\\/g)
                    .slice(0, -1)
                    .pop()!
                    .toLowerCase();
                const path = file;
                Object.freeze(
                    Object.assign(command.meta, {
                        category,
                        path
                    })
                );
                this.set(command.meta.name, command);
            }
        } catch (e) {
            this.whatsappbot.logger.error(
                "command handler",
                `COMMAND_LOADER_ERR:`,
                (e as Error).stack ?? (e as Error).message
            );
        } finally {
            this.categories = this.reduce<
                Record<string, ICommandComponent[] | undefined>
            >((a, b) => {
                a[b.meta.category!] = a[b.meta.category!] ?? [];
                a[b.meta.category!]?.push(b);
                return a;
            }, {});
            this.whatsappbot.logger.info(
                "command handler",
                `Done Registering ${
                    fileCommands.length - unableToLoad
                } command(s).`
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

            if (
                command.meta.devOnly &&
                !this.whatsappbot.config.devs.includes(
                    message.sender.id.split("@")[0]
                )
            ) {
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
