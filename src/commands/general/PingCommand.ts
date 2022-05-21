import { Message } from "@open-wa/wa-automate";
import { ApplyMetadata } from "../../structures/ApplyMetadata.js";
import { BaseCommand } from "../../structures/BaseCommand.js";
import { ICommandComponent } from "../../types/index.js";

@ApplyMetadata<ICommandComponent>({
    name: "ping",
    description: "Ping command",
    usage: "ping",
    aliases: [],
    devOnly: false,
    disabled: false
})
export default class PingCommand extends BaseCommand {
    public async execute(message: Message): Promise<void> {
        await this.whatsappbot.client.sendText(message.chatId, "Pong!");
    }
}
