import { DEVS, ISDEV, PREFIX } from "#bajigur/config.js";
import { ICommand } from "#bajigur/types/index.js";
import ImportClass from "#bajigur/utils/ImportClass.js";
import ReadDirRecursive from "#bajigur/utils/ReadDirRecursive.js";
import { Collection } from "@discordjs/collection";
import { mergeDefault } from "@sapphire/utilities";
import { WAProto } from "@whiskeysockets/baileys";
import { resolve } from "node:path";
import BajigurClient from "./BajigurClient.js";

export default abstract class Command implements ICommand {
    public constructor(
        public client: BajigurClient,
        public readonly meta: ICommand["meta"]
    ) {}

    public run(_args: string[], _data: WAProto.IWebMessageInfo): void {
        this.client.logger.info(`Command ${this.meta.name} is not yet implemented.`);
    }
}

const DefaultCommandMetadata: ICommand["meta"] = {
    aliases: [],
    description: "",
    devOnly: false,
    category: "",
    name: "",
    usage: ""
};

export class CommandHandler extends Collection<string, ICommand> {
    public categories: Record<string, ICommand[] | undefined> = {};
    public readonly aliases = new Collection<string, string>();
    public isReady = false;

    public constructor(
        public readonly client: BajigurClient,
        public readonly path: string
    ) {
        super();
    }

    public async init(): Promise<void> {
        try {
            const files = ReadDirRecursive(this.path);
            this.client.logger.info(`Found ${files.length} commands, registering...`);
            for (const path of files) {
                const command = await ImportClass<ICommand>(resolve(path), this.client);
                if (command) {
                    command.meta = mergeDefault(DefaultCommandMetadata, command.meta);
                    const category = path.split(/\/|\\/g).slice(0, -1).pop()!.toLowerCase();
                    Object.freeze(Object.assign(command.meta, { category, path }));
                    this.set(command.meta.name, command);
                    if (command.meta.aliases?.length) {
                        command.meta.aliases.map(alias =>
                            this.aliases.set(alias, command.meta.name)
                        );
                    }
                    this.client.logger.info(
                        `Registered ${command.meta.name} in category ${category}.`
                    );
                } else {
                    this.client.logger.warn(`Invalid command file: ${path}.`);
                }
            }
        } catch (err) {
            this.client.logger.error("COMMAND_HANDLER_ERROR", err);
        } finally {
            this.categories = this.reduce<Record<string, ICommand[] | undefined>>((a, b) => {
                a[b.meta.category!] = a[b.meta.category!] ?? [];
                a[b.meta.category!]?.push(b);
                return a;
            }, {});
            this.client.logger.info("All categories has been registered.");
            this.isReady = true;
        }
    }

    public handle(content: string, message: WAProto.IWebMessageInfo): void {
        const parseArgs = content.slice(PREFIX.length).trim().split(/ +/g);
        const commandArgs = parseArgs.shift()?.toLowerCase() ?? "";
        const getCommand = this.get(commandArgs) ?? this.get(this.aliases.get(commandArgs) ?? "");

        if (getCommand) {
            try {
                if (
                    (getCommand.meta.devOnly ?? ISDEV) &&
                    !DEVS.includes(message.key.remoteJid!.split("@")[0])
                )
                    return;
                getCommand.run(parseArgs, message);
            } catch (err) {
                this.client.logger.error("COMMAND_HANDLER_ERR:", err);
            } finally {
                if (
                    (getCommand.meta.devOnly ?? ISDEV) &&
                    !DEVS.includes(message.key.remoteJid!.split("@")[0])
                )
                    // eslint-disable-next-line no-unsafe-finally
                    return;
                this.client.logger.info(
                    `${message.pushName}(${message.key.remoteJid!}) is using ${
                        getCommand.meta.name
                    } command from ${getCommand.meta.category!} category on chat ${message.key
                        .remoteJid!}.`
                );
            }
        }
    }
}
