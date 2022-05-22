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
        const isMessageImage = message.type === MessageTypes.IMAGE;
        const isMessageVideo = message.type === MessageTypes.VIDEO;
        const isMessageDocument =
            message.type === MessageTypes.DOCUMENT &&
            ["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(
                message.mimetype!
            );
        const isQuotedImage = message.quotedMsg?.type === MessageTypes.IMAGE;
        const isQuotedVideo = message.quotedMsg?.type === MessageTypes.VIDEO;
        const isQuotedDocument =
            message.quotedMsg?.type === MessageTypes.DOCUMENT &&
            ["image/png", "image/jpg", "image/jpeg", "image/webp"].includes(
                message.quotedMsg.mimetype!
            );

        if (isMessageImage || isQuotedImage) {
            const wait = (await this.whatsappbot.client.reply(
                message.chatId,
                "_Generating sticker..._",
                message.id
            )) as Message["id"];
            await this.create(
                message,
                wait,
                isMessageImage ? false : isQuotedImage,
                false
            );

            return undefined;
        }

        if (isMessageDocument || isQuotedDocument) {
            const wait = (await this.whatsappbot.client.reply(
                message.chatId,
                "_Generating sticker..._",
                message.id
            )) as Message["id"];
            await this.create(
                message,
                wait,
                isMessageDocument ? false : isQuotedDocument,
                false
            );

            return undefined;
        }

        if (isMessageVideo || isQuotedVideo) {
            if (Number(message.quotedMsg?.duration ?? message.duration) >= 11) {
                await this.whatsappbot.client.reply(
                    message.chatId,
                    "Please use video/gif with duration under/equal to 10 seconds and try again.",
                    message.id
                );
            } else {
                const wait = (await this.whatsappbot.client.reply(
                    message.chatId,
                    "_Generating sticker..._ (sometimes it takes 1 - 5 minutes to process)",
                    message.id
                )) as Message["id"];
                await this.create(
                    message,
                    wait,
                    isMessageVideo ? false : isQuotedVideo,
                    true
                );
            }

            return undefined;
        }

        await this.whatsappbot.client.reply(
            message.chatId,
            `Please send a image/video/gif with */sticker* caption or reply it on the file! You can also send a image as document then reply it with */sticker*`,
            message.id
        );
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
            const imageBase64 = `data:${msg.mimetype!};base64,${media.toString(
                "base64"
            )}`;

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
            } else {
                await this.whatsappbot.client.sendImageAsSticker(
                    message.chatId,
                    imageBase64,
                    {
                        keepScale: true,
                        author: "Clytage Bot",
                        pack: "Sticker Creator"
                    }
                );
            }

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
            this.whatsappbot.logger.error("sticker command", e);
        }
    }
}
