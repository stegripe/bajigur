import { ApplyMetadata } from "../../utils/decorators/ApplyMetadata";
import { BaseCommand } from "../../structures/BaseCommand";
import { ICommandComponent } from "../../types";
import { Message } from "@open-wa/wa-automate";

@ApplyMetadata<ICommandComponent>({
    name: "ping",
    description: "Ping the bot.",
    usage: "ping"
})
export default class PingCommand extends BaseCommand {
    public async execute(message: Message): Promise<void> {
        await this.whatsappbot.client.sendText(message.chatId, "*PONG!*");
    }
}
