import { proto } from "@adiwajshing/baileys";
import { BaseCommand } from "../../structures/BaseCommand";
import { ICommandComponent } from "../../types";
import { ApplyMetadata } from "../../utils/decorators";

@ApplyMetadata<ICommandComponent>({
    name: "ping",
    aliases: ["p"],
    description: "Ping the bot",
    usage: "{PREFIX}ping"
})
export default class PingCommand extends BaseCommand {
    public async executeCommand(
        _: string[],
        data: proto.IWebMessageInfo
    ): Promise<void> {
        await this.client.socket?.sendMessage(data.key.remoteJid!, {
            text: "Pong!"
        });
    }
}
