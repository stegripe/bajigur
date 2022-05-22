import { ApplyMetadata } from "../../structures/ApplyMetadata.js";
import { BaseCommand } from "../../structures/BaseCommand.js";
import { ICommandComponent } from "../../types/index.js";
import { decryptMedia, Message, MessageTypes } from "@open-wa/wa-automate";

@ApplyMetadata<ICommandComponent>({
    name: "sticker",
    description: "Generates a sticker from image.",
    usage: "sticker",
    aliases: [],
    devOnly: false,
    disabled: false
})
export default class StickerCommand extends BaseCommand {
    public async execute(message: Message): Promise<void> {
        const isQuotedImage =
            message.quotedMsg && message.quotedMsg.type === MessageTypes.IMAGE;
        const isQuotedVideo =
            message.quotedMsg && message.quotedMsg.type === MessageTypes.VIDEO;

        if (message.type === MessageTypes.IMAGE || isQuotedImage) {
            const wait = (await this.whatsappbot.client.reply(
                message.chatId,
                "_Generating sticker..._",
                message.id
            )) as Message["id"];
            await this.create(message, wait, isQuotedImage!, false);
        } else if (
            message.quotedMsg &&
            message.quotedMsg.type === "document" &&
            ["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(
                message.quotedMsg.mimetype!
            )
        ) {
            const wait = (await this.whatsappbot.client.reply(
                message.chatId,
                "_Generating sticker..._",
                message.id
            )) as Message["id"];
            await this.create(message, wait, true, false);
        } else if (message.type === "video" || isQuotedVideo) {
            if (
                (Number(message.duration) ||
                    Number(message.quotedMsg!.duration)) >= 11
            ) {
                await this.whatsappbot.client.reply(
                    message.chatId,
                    "Please use video/gif with duration under/equal to 10 seconds and try again.",
                    message.id
                );
                return undefined;
            }
            const wait = (await this.whatsappbot.client.reply(
                message.chatId,
                "_Generating sticker..._ (sometimes it takes 1-5 minutes to process)",
                message.id
            )) as Message["id"];
            await this.create(message, wait, isQuotedVideo!, true);
        } else {
            await this.whatsappbot.client.reply(
                message.chatId,
                `Please send a image/video/gif with */sticker* caption or reply it on the file! You can also send a image as document then reply it with */sticker*`,
                message.id
            );
        }
    }

    private async create(
        message: Message,
        waitMsg: Message["id"],
        isQuoted: boolean,
        isGif = false
    ): Promise<void> {
        try {
            const msg = isQuoted ? message.quotedMsg! : message;
            const media = await decryptMedia(msg);
            const imageBase64 = `data:${
                msg.mimetype!
            };base64,${media.toString("base64")}`;

            if (isGif) {
                await this.whatsappbot.client.sendMp4AsSticker(
                    message.chatId,
                    media.toString("base64"),
                    { crop: false, startTime: "00:00:00.0" },
                    {
                        keepScale: true,
                        author: "Clytage Bot",
                        pack: "Sticker Creator"
                    }
                );
                await this.whatsappbot.client.deleteMessage(
                    message.chatId,
                    waitMsg
                );
                return undefined;
            }

            await this.whatsappbot.client.sendImageAsSticker(
                message.chatId,
                imageBase64,
                {
                    keepScale: true,
                    author: "Clytage Bot",
                    pack: "Sticker Creator"
                }
            );
            await this.whatsappbot.client.deleteMessage(
                message.chatId,
                waitMsg
            );
        } catch (e) {
            await this.whatsappbot.client.deleteMessage(
                message.chatId,
                waitMsg
            );
            await this.whatsappbot.client.reply(
                message.chatId,
                `An error occured when trying to create the sticker. ${
                    isGif ? "try again with shorter video/gif" : ""
                }`,
                message.id
            );
            this.whatsappbot.logger.error(e);
        }
    }
}
