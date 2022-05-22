import { ApplyMetadata } from "../../structures/ApplyMetadata.js";
import { BaseCommand } from "../../structures/BaseCommand.js";
import { ICommandComponent } from "../../types/index.js";
import { Message } from "@open-wa/wa-automate";

@ApplyMetadata<ICommandComponent>({
    name: "help",
    description: "Display help message.",
    usage: "help [command]",
    aliases: [],
    devOnly: false,
    disabled: false
})
export default class HelpCommand extends BaseCommand {
    public async execute(message: Message, args: string[]): Promise<void> {
        if (args[0]) {
            const command =
                this.whatsappbot.commands.get(args[0]) ??
                this.whatsappbot.commands.get(
                    this.whatsappbot.commands.aliases.get(args[0]) ?? ""
                );

            if (!command) {
                await this.whatsappbot.client.sendText(
                    message.chatId,
                    "Command not found."
                );
                return undefined;
            }

            await this.whatsappbot.client.sendText(
                message.chatId,
                `*${this.whatsappbot.config.botName}* - ${command.meta.name}\n\n${command.meta.description}\nUsage: ${command.meta.usage}`
            );
        } else {
            let commmandList = "";
            Object.values(this.whatsappbot.commands.categories)
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
                    commmandList += `*${category.toUpperCase()}*\n${cmds}\n`;
                });
            await this.whatsappbot.client.sendText(
                message.chatId,
                `*${this.whatsappbot.config.botName}* - Command List\n\n${commmandList}`
            );
        }
    }
}
