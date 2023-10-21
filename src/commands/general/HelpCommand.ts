import { ApplyOptions } from "@nezuchan/decorators";
import { Command, CommandOptions } from "@clytage/liqueur";
import { ArgumentStream } from "@sapphire/lexure";
import { proto } from "@whiskeysockets/baileys";
import { botName } from "../../config/env.js";

@ApplyOptions<CommandOptions>({
    aliases: ["?", "h"],
    name: "help",
    description: "Get help with the bot",
    usage: "{prefix}help [command name]",
    preconditions: []
})
export class HelpCommand extends Command {
    public async messageRun(data: proto.IWebMessageInfo, args: ArgumentStream): Promise<any> {
        const commandName = args.single().unwrapOr(undefined);
        if (!commandName) {
            let commandList = "";
            const commands = this.container.stores.get("commands");
            const categories = [
                ...new Set([...commands.values()].flatMap(x => x.fullCategory[0])).values()
            ].sort();
    
            for (const category of categories) {
                const cmds = commands.filter(x => x.fullCategory[0] === category)
                    .sort((a, b) => a.options.name!.localeCompare(b.name, "en", { sensitivity: "base" }))
                    .map(x => x.options.name)
                    .join(", ");
                commandList += `*${category.toUpperCase()}*\n\`\`\`${cmds}\`\`\``
            }

            return this.container.client.socket?.sendMessage(data.key.remoteJid!, {
                text: `*${botName}* - Command List\n\n${commandList}`
            });
        }

        const command = this.container.client.stores.get("commands").get(commandName);
        if (!command) {
            return this.container.client.socket?.sendMessage(data.key.remoteJid!, {
                text: "Command not found."
            });
        }

        await this.container.client.socket?.sendMessage(data.key.remoteJid!, {
            text: `*${botName}* - ${command.options.name}

${command.options.description || "No description was provided."}
Usage: ${(command.options.usage ?? "No usage was provided.")
    .replace(
        "{prefix}",
        await this.container.client.options.fetchPrefix(data)
    )}`
        });

    }
}
