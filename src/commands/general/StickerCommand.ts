import { decryptMedia, Message, MessageTypes } from "@open-wa/wa-automate";
import { ApplyMetadata } from "../../structures/ApplyMetadata.js";
import { BaseCommand } from "../../structures/BaseCommand.js";
import { ICommandComponent } from "../../types/index.js";

@ApplyMetadata<ICommandComponent>({
    name: "sticker",
    description: "Generate sticker from image",
    usage: "sticker",
    aliases: [],
    devOnly: false,
    disabled: false
})
export default class StickerCommand extends BaseCommand {
    public async execute(message: Message): Promise<void> {
        if ((message.quotedMsg?.type ?? message.type) !== MessageTypes.IMAGE) {
            await this.whatsappbot.client.sendText(
                message.chatId,
                "This command only works on images."
            );
            return;
        }
        const mediaType = await decryptMedia(message.quotedMsg ?? message);
        const dataSticker = `data:${
            message.quotedMsg?.mimetype ?? message.mimetype!
        };base64,${mediaType.toString("base64")}`;
        await this.whatsappbot.client.sendImageAsSticker(
            message.chatId,
            dataSticker,
            {
                author: "Clytage Bot",
                pack: "Sticker Generation",
                keepScale: true
            }
        );
    }
}
