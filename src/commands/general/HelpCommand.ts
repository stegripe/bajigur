import { proto } from "@whiskeysockets/baileys";
import { BaseCommand } from "../../structures/BaseCommand";
import { ICommandComponent } from "../../types";
import { ApplyMetadata } from "../../utils/decorators";

@ApplyMetadata<ICommandComponent>({
    name: "help",
    aliases: ["h", "?"],
    description: "Get help with the bot",
    usage: "{PREFIX}help [command]"
})
export default class HelpCommand extends BaseCommand {
    public async executeCommand(
        args: string[],
        data: proto.IWebMessageInfo
    ): Promise<void> {
        if (args[0]) {
            const command =
                this.client.commandHandler.get(args[0]) ??
                this.client.commandHandler.get(
                    this.client.commandHandler.aliases.get(args[0]) ?? ""
                );
            if (!command) {
                await this.client.socket?.sendMessage(data.key.remoteJid!, {
                    text: "Command not found"
                });
                return undefined;
            }
            await this.client.socket?.sendMessage(data.key.remoteJid!, {
                text: `*${this.client.config.botName}* - ${command.meta.name
                    }\n\n${command.meta
                        .description!}\nUsage: ${command.meta.usage!.replace(
                            "{PREFIX}",
                            this.client.config.prefix
                        )}`
            });
        } else {
            let commmandList = "";
            Object.values(this.client.commandHandler.categories)
                .map(commands => commands!.filter(Boolean))
                .sort((a, b) =>
                    a[0].meta.category!.localeCompare(
                        b[0].meta.category!,
                        "en",
                        {
                            sensitivity: "base"
                        }
                    )
                )
                .map(commands => {
                    const category = commands[0].meta.category!;
                    const cmds = commands.map(cmd => cmd.meta.name).join(", ");
                    commmandList += `*${category.toUpperCase()}*\n\`\`\`${cmds}\`\`\`\n`;
                });
            await this.client.socket?.sendMessage(data.key.remoteJid!, {
                text: `*${this.client.config.botName}* - Command List\n\n${commmandList}`
            });
        }
    }
}
