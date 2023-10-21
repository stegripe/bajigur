import { ApplyOptions } from "@nezuchan/decorators";
import { Command, CommandOptions } from "@clytage/liqueur";
import { cast } from "@sapphire/utilities";
import { Time } from "@sapphire/time-utilities";
import { proto } from "@whiskeysockets/baileys";

@ApplyOptions<CommandOptions>({
    aliases: ["p", "pang", "pung", "peng", "pong"],
    name: "ping",
    description: "Check bot's latency",
    preconditions: []
})
export class PingCommand extends Command {
    public async messageRun(data: proto.IWebMessageInfo): Promise<any> {
        const latency = new Date(cast<number>(data.messageTimestamp) * Time.Second).getTime() - Date.now();
        return this.container.client.socket?.sendMessage(data.key.remoteJid!, {
            text: `🏓 Took me \`\`\`${latency.toFixed(0)}ms\`\`\` to respond`
        });
    }
}
