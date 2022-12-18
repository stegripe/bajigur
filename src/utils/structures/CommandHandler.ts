import { importClass, mergeDefault, readdirRecursive } from "../functions";
import { WhatsAppBot } from "../../structures/WhatsAppBot";
import { DefaultCommandComponent } from "../constants";
import { ICommandComponent } from "../../types";
import { Collection } from "@discordjs/collection";
import { proto } from "@adiwajshing/baileys";
import { resolve } from "node:path";

export class CommandHandler extends Collection<string, ICommandComponent> {
    public categories: Record<string, ICommandComponent[] | undefined> = {};
    public readonly aliases = new Collection<string, string>();
    public isReady = false;

    public constructor(
        public readonly client: WhatsAppBot,
        public readonly path: string
    ) {
        super();
    }

    public async init(): Promise<void> {
        try {
            const files = readdirRecursive(this.path);
            this.client.logger.info(
                `Found ${files.length} commands, registering...`
            );
            for (const path of files) {
                const command = await importClass<ICommandComponent>(
                    resolve(path),
                    this.client
                );
                if (command) {
                    command.meta = mergeDefault<ICommandComponent["meta"]>(
                        DefaultCommandComponent,
                        command.meta
                    );
                    const category = path
                        .split(/\/|\\/g)
                        .slice(0, -1)
                        .pop()!
                        .toLowerCase();
                    Object.freeze(
                        Object.assign(command.meta, { category, path })
                    );
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
            this.categories = this.reduce<
                Record<string, ICommandComponent[] | undefined>
            >((a, b) => {
                a[b.meta.category!] = a[b.meta.category!] ?? [];
                a[b.meta.category!]?.push(b);
                return a;
            }, {});
            this.client.logger.info("All categories has been registered.");
            this.isReady = true;
        }
    }

    public handle(content: string, message: proto.IWebMessageInfo): void {
        const parseArgs = content
            .slice(this.client.config.prefix.length)
            .trim()
            .split(/ +/g);
        const commandArgs = parseArgs.shift()?.toLowerCase() ?? "";
        const getCommand =
            this.get(commandArgs) ??
            this.get(this.aliases.get(commandArgs) ?? "");

        if (getCommand) {
            try {
                if (
                    (getCommand.meta.devOnly ||
                        this.client.config.mode === "dev") &&
                    !this.client.config.devs.includes(
                        message.key.remoteJid!.split("@")[0]
                    )
                )
                    return;
                getCommand.executeCommand(parseArgs, message);
            } catch (err) {
                this.client.logger.error("COMMAND_HANDLER_ERR:", err);
            } finally {
                if (
                    (getCommand.meta.devOnly ||
                        this.client.config.mode === "dev") &&
                    !this.client.config.devs.includes(
                        message.key.remoteJid!.split("@")[0]
                    )
                )
                    return;
                this.client.logger.info(
                    `${message.pushName ?? ""}(${message.key
                        .remoteJid!}) is using ${
                        getCommand.meta.name
                    } command from ${getCommand.meta
                        .category!} category on chat ${message.key.remoteJid!}.`
                );
            }
        }
    }
}
