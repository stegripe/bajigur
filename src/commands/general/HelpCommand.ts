import ApplyMetadata from "#bajigur/decorators/ApplyMetadata.js";
import { BOT_NAME, PREFIX } from "#bajigur/config.js";
import Command from "#bajigur/structures/Command.js";
import { ICommand } from "#bajigur/types/index.js";
import { WAProto } from "@whiskeysockets/baileys";

@ApplyMetadata<ICommand>({
    name: "help",
    aliases: ["h", "?"],
    description: "Get help with the bot",
    usage: "{PREFIX}help [command]"
})
export default class HelpCommand extends Command {
    public async run(args: string[], data: WAProto.IWebMessageInfo): Promise<void> {
        if (args[0]) {
            const command =
                this.client.commands.get(args[0]) ??
                this.client.commands.get(this.client.commands.aliases.get(args[0]) ?? "");
            if (!command) {
                await this.client.socket?.sendMessage(data.key.remoteJid!, {
                    text: "Command not found."
                });
                return undefined;
            }
            await this.client.socket?.sendMessage(data.key.remoteJid!, {
                text: `*${BOT_NAME}* - ${command.meta.name}\n\n${command.meta
                    .description!}\nUsage: ${command.meta.usage!.replace("{PREFIX}", PREFIX)}`
            });
        } else {
            let commmandList = "";
            Object.values(this.client.commands.categories)
                .map(commands => commands!.filter(Boolean))
                .sort((a, b) =>
                    a[0].meta.category!.localeCompare(b[0].meta.category!, "en", {
                        sensitivity: "base"
                    })
                )
                .map(commands => {
                    const category = commands[0].meta.category!;
                    const cmds = commands.map(cmd => cmd.meta.name).join(", ");
                    commmandList += `*${category.toUpperCase()}*\n\`\`\`${cmds}\`\`\`\n`;
                });
            await this.client.socket?.sendMessage(data.key.remoteJid!, {
                text: `*${BOT_NAME}* - Command List\n\n${commmandList}`
            });
        }
    }
}
