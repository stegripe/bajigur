import { BaseCommand } from "../../structures/BaseCommand";
import { ApplyMetadata } from "../../utils/decorators";
import { ICommandComponent } from "../../types";
import { proto } from "@whiskeysockets/baileys";

@ApplyMetadata<ICommandComponent>({
    name: "ping",
    aliases: ["p", "pang", "pung", "peng", "pong"],
    description: "Ping the bot",
    usage: "{PREFIX}ping"
})
export default class PingCommand extends BaseCommand {
    public async executeCommand(
        _: string[],
        data: proto.IWebMessageInfo
    ): Promise<void> {
        await this.client.socket?.sendMessage(data.key.remoteJid!, {
            text: "🏓 PONG!"
        });
    }
}
