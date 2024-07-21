import ApplyMetadata from "#bajigur/decorators/ApplyMetadata.js";
import Command from "#bajigur/structures/Command.js";
import { ICommand } from "#bajigur/types/index.js";
import { WAProto } from "@whiskeysockets/baileys";
import { cast } from "@sapphire/utilities";

@ApplyMetadata<ICommand>({
    name: "ping",
    aliases: ["p", "pang", "pung", "peng", "pong"],
    description: "Ping the bot",
    usage: "{PREFIX}ping"
})
export default class PingCommand extends Command {
    public async run(_: string[], data: WAProto.IWebMessageInfo): Promise<void> {
        const latency = Date.now() - new Date(cast<number>(data.messageTimestamp) * 1000).getTime();
        await this.client.socket?.sendMessage(data.key.remoteJid!, {
            text: `🏓 Took me \`\`\`${latency.toFixed(0)}ms\`\`\` to respond`
        });
    }
}
