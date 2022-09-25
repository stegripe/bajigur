import { Collection } from "@discordjs/collection";
import { Message } from "@open-wa/wa-automate";
import { WhatsappBot } from "../../structures/WhatsappBot";
import { ICommandComponent } from "../../types";
import { DefaultCommandComponent } from "../constants/DefaultCommandComponent";
import { ProjectUtils } from "./ProjectUtils";

export class CommandHandler extends Collection<string, ICommandComponent> {
    public readonly aliases = new Collection<string, string>();
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
        let unableToLoad = 0;
        const fileCommands = ProjectUtils.readdirRecursive(this.path);
        try {
            this.whatsappbot.logger.info(
                "command handler",
                `Loading ${fileCommands.length} command(s).`
            );
            for (const path of fileCommands) {
                const command = await ProjectUtils.import<ICommandComponent>(
                    path,
                    this.whatsappbot
                );
                if (command) {
                    if (this.has(command.meta.name)) {
                        this.whatsappbot.logger.warn(
                            "command handler",
                            `Duplicate command name detected: ${command.meta.name}, path: ${path}`
                        );
                        unableToLoad++;
                        continue;
                    }
                    command.meta = ProjectUtils.mergeDefault<
                        ICommandComponent["meta"]
                    >(DefaultCommandComponent, command.meta);
                    const category = path
                        .split(/\/|\\/g)
                        .slice(0, -1)
                        .pop()!
                        .toLowerCase();
                    Object.freeze(
                        Object.assign(command.meta, {
                            category,
                            path
                        })
                    );
                    this.set(command.meta.name, command);
                    if (command.meta.aliases?.length) {
                        command.meta.aliases.map(alias =>
                            this.aliases.set(alias, command.meta.name)
                        );
                    }
                } else {
                    this.whatsappbot.logger.error(
                        "command handler",
                        `File ${path} is not valid command file`
                    );
                    unableToLoad++;
                    continue;
                }
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
                `Done Registering ${fileCommands.length - unableToLoad}/${
                    fileCommands.length
                } command(s).`
            );
        }
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    public async handle(message: Message): Promise<void> {
        const args = (message.caption || message.body)
            .substring(this.whatsappbot.config.prefix.length)
            .trim()
            .split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        const command =
            this.get(commandName!) ?? this.get(this.aliases.get(commandName!)!);

        if (command) {
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
                    `Command ${command.meta.name} has been executed by ${
                        message.sender.id.split("@")[0]
                    } in chat ${message.chatId.split("@")[0]}`
                );
            }
        } else {
            this.whatsappbot.queue.shift();
            return undefined;
        }
    }
}
