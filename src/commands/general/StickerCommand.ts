import { downloadMediaMessage, proto } from "@adiwajshing/baileys";
import { Sticker, StickerTypes } from "wa-sticker-formatter";
import { BaseCommand } from "../../structures/BaseCommand";
import { ICommandComponent } from "../../types";
import { ApplyMetadata } from "../../utils/decorators";

@ApplyMetadata<ICommandComponent>({
    name: "sticker",
    aliases: ["stiker"],
    description: "Convert image to sticker",
    usage: "{PREFIX}sticker <image/video/gif>"
})
export default class StickerCommand extends BaseCommand {
    public async executeCommand(
        _: string[],
        data: proto.IWebMessageInfo
    ): Promise<void> {
        if (data.message?.imageMessage ?? data.message?.videoMessage) {
            if ((data.message.videoMessage?.seconds ?? 0) >= 10) {
                await this.client.socket?.sendMessage(data.key.remoteJid!, {
                    text: "Please use Video or GIF with duration under 10 seconds."
                });
                return undefined;
            }
            const buffer = await downloadMediaMessage(data, "buffer", {
                endByte: 900000
            });
            return this.convertToSticker(
                data.key.remoteJid!,
                buffer as Buffer,
                data
            );
        }
        if (data.message?.documentWithCaptionMessage) {
            if (
                (data.message.documentWithCaptionMessage.message?.videoMessage
                    ?.seconds ?? 0) >= 10
            ) {
                await this.client.socket?.sendMessage(data.key.remoteJid!, {
                    text: "Please use Video or GIF with duration under 10 seconds."
                });
                return undefined;
            }
            const buffer = await downloadMediaMessage(
                proto.WebMessageInfo.create({
                    ...data,
                    message: data.message.documentWithCaptionMessage.message
                }),
                "buffer",
                { endByte: 900000 }
            );
            return this.convertToSticker(
                data.key.remoteJid!,
                buffer as Buffer,
                data
            );
        }
        if (
            data.message?.extendedTextMessage?.contextInfo?.quotedMessage
                ?.imageMessage ??
            data.message?.extendedTextMessage?.contextInfo?.quotedMessage
                ?.videoMessage ??
            data.message?.extendedTextMessage?.contextInfo?.quotedMessage
                ?.documentMessage
        ) {
            if (
                (data.message.extendedTextMessage.contextInfo.quotedMessage
                    .videoMessage?.seconds ?? 0) >= 10 ||
                (data.message.extendedTextMessage.contextInfo.quotedMessage
                    .documentMessage?.contextInfo?.quotedMessage?.videoMessage
                    ?.seconds ?? 0) >= 10
            ) {
                await this.client.socket?.sendMessage(data.key.remoteJid!, {
                    text: "Please use Video or GIF with duration under 10 seconds."
                });
                return undefined;
            }
            const buffer = await downloadMediaMessage(
                proto.WebMessageInfo.create({
                    ...data,
                    message:
                        data.message.extendedTextMessage.contextInfo
                            .quotedMessage
                }),
                "buffer",
                { endByte: 900000 }
            );
            return this.convertToSticker(
                data.key.remoteJid!,
                buffer as Buffer,
                data
            );
        }
        if (
            data.message?.extendedTextMessage?.contextInfo?.quotedMessage
                ?.documentWithCaptionMessage
        ) {
            if (
                (data.message.extendedTextMessage.contextInfo.quotedMessage
                    .documentWithCaptionMessage.message?.videoMessage
                    ?.seconds ?? 0) >= 10
            ) {
                await this.client.socket?.sendMessage(data.key.remoteJid!, {
                    text: "Please use Video or GIF with duration under 10 seconds."
                });
                return undefined;
            }
            const buffer = await downloadMediaMessage(
                proto.WebMessageInfo.create({
                    ...data,
                    message:
                        data.message.extendedTextMessage.contextInfo
                            .quotedMessage.documentWithCaptionMessage.message
                }),
                "buffer",
                { endByte: 900000 }
            );
            return this.convertToSticker(
                data.key.remoteJid!,
                buffer as Buffer,
                data
            );
        }
        await this.client.socket?.sendMessage(
            data.key.remoteJid!,
            {
                text: "Please send an image, video, or GIF with */sticker* caption or reply it on the file. You can also send an image as document by replying it with */sticker* too."
            },
            {
                quoted: data.message?.extendedTextMessage?.contextInfo
                    ?.quotedMessage
                    ? proto.WebMessageInfo.create({
                          ...data,
                          message:
                              data.message.extendedTextMessage.contextInfo
                                  .quotedMessage
                      })
                    : data
            }
        );
    }

    private async convertToSticker(
        Jid: string,
        buffer: Buffer,
        data: proto.IWebMessageInfo
    ): Promise<void> {
        const convertingMessage = await this.client.socket?.sendMessage(Jid, {
            text: "_Converting to sticker..._"
        });
        const sticker = await new Sticker(buffer, {
            author: "Clytage Bot",
            pack: "Clytage Sticker Pack",
            type: StickerTypes.FULL,
            quality: 25
        }).toMessage();
        await this.client.socket?.sendMessage(Jid, sticker, { quoted: data });
        await this.client.socket?.sendMessage(Jid, {
            delete: convertingMessage!.key
        });
    }
}
