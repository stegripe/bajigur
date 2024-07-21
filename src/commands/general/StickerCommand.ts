import { BOT_NAME, STICKER_PACK_NAME } from "#bajigur/config.js";
import ApplyMetadata from "#bajigur/decorators/ApplyMetadata.js";
import Command from "#bajigur/structures/Command.js";
import { ICommand } from "#bajigur/types/index.js";
import GetMediaTypeFromBuffer from "#bajigur/utils/GetMediaTypeFromBuffer.js";
import { WAProto, downloadMediaMessage } from "@whiskeysockets/baileys";
import { unlinkSync, writeFileSync } from "fs";
import { createSticker } from "wa-sticker";
import { join } from "path";

@ApplyMetadata<ICommand>({
    name: "sticker",
    aliases: ["stiker"],
    description: "Convert image to sticker",
    usage: "{PREFIX}sticker <image/video/gif> [sticker pack name]"
})
export default class StickerCommand extends Command {
    public async run(args: string[], data: WAProto.WebMessageInfo): Promise<void> {
        if (data.message?.imageMessage ?? data.message?.videoMessage) {
            if ((data.message.videoMessage?.seconds ?? 0) >= 10) {
                await this.client.socket?.sendMessage(data.key.remoteJid!, {
                    text: "Please use Video or GIF with duration under 10 seconds."
                });
                return undefined;
            }
            return this.convertToSticker(data.key.remoteJid!, data, data, args);
        }
        if (data.message?.documentWithCaptionMessage) {
            if (
                (data.message.documentWithCaptionMessage.message?.videoMessage?.seconds ?? 0) >= 10
            ) {
                await this.client.socket?.sendMessage(data.key.remoteJid!, {
                    text: "Please use Video or GIF with duration under 10 seconds."
                });
                return undefined;
            }
            return this.convertToSticker(
                data.key.remoteJid!,
                WAProto.WebMessageInfo.create({
                    ...data,
                    message: data.message.documentWithCaptionMessage.message
                }),
                data,
                args
            );
        }
        if (
            data.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ??
            data.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage ??
            data.message?.extendedTextMessage?.contextInfo?.quotedMessage?.documentMessage
        ) {
            if (
                (data.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage?.seconds ??
                    0) >= 10 ||
                (data.message.extendedTextMessage.contextInfo.quotedMessage.documentMessage
                    ?.contextInfo?.quotedMessage?.videoMessage?.seconds ?? 0) >= 10
            ) {
                await this.client.socket?.sendMessage(data.key.remoteJid!, {
                    text: "Please use Video or GIF with duration under 10 seconds."
                });
                return undefined;
            }
            return this.convertToSticker(
                data.key.remoteJid!,
                WAProto.WebMessageInfo.create({
                    ...data,
                    message: data.message.extendedTextMessage.contextInfo.quotedMessage
                }),
                data,
                args
            );
        }
        if (
            data.message?.extendedTextMessage?.contextInfo?.quotedMessage
                ?.documentWithCaptionMessage
        ) {
            if (
                (data.message.extendedTextMessage.contextInfo.quotedMessage
                    .documentWithCaptionMessage.message?.videoMessage?.seconds ?? 0) >= 10
            ) {
                await this.client.socket?.sendMessage(data.key.remoteJid!, {
                    text: "Please use Video or GIF with duration under 10 seconds."
                });
                return undefined;
            }
            return this.convertToSticker(
                data.key.remoteJid!,
                WAProto.WebMessageInfo.create({
                    ...data,
                    message:
                        data.message.extendedTextMessage.contextInfo.quotedMessage
                            .documentWithCaptionMessage.message
                }),
                data,
                args
            );
        }
        await this.client.socket?.sendMessage(
            data.key.remoteJid!,
            {
                text: "Please send an image, video, or GIF with */sticker* caption or reply it on the file. You can also send an image as document by replying it with */sticker* too."
            },
            {
                quoted: data.message?.extendedTextMessage?.contextInfo?.quotedMessage
                    ? WAProto.WebMessageInfo.create({
                          ...data,
                          message: data.message.extendedTextMessage.contextInfo.quotedMessage
                      })
                    : data
            }
        );
    }

    private async convertToSticker(
        Jid: string,
        message: WAProto.IWebMessageInfo,
        from: WAProto.IWebMessageInfo,
        args?: string[]
    ): Promise<void> {
        const convertingMessage = await this.client.socket?.sendMessage(Jid, {
            text: "_Converting to sticker..._"
        });

        const buffer = (await downloadMediaMessage(message, "buffer", {})) as Buffer;

        const fileExtension = GetMediaTypeFromBuffer(buffer);
        const fileName = `${Date.now()}.${fileExtension}`;
        const filePath = join(process.cwd(), fileName);

        writeFileSync(filePath, buffer);

        let quality = 100 - ((buffer.length / 2) * 100) / 1_000_000;

        const stickerOptions = {
            crop: false,
            metadata: {
                publisher: BOT_NAME,
                packname: args?.length ? args.join(" ") : STICKER_PACK_NAME
            }
        };

        let stickerBuffer = await createSticker([filePath], {
            quality,
            ...stickerOptions
        });

        while (stickerBuffer.length >= 1_000_000) {
            quality -= 10;
            stickerBuffer = await createSticker([filePath], {
                quality,
                ...stickerOptions
            });
        }

        const sticker = {
            sticker: stickerBuffer
        };

        unlinkSync(filePath);

        await this.client.socket?.sendMessage(Jid, sticker, { quoted: from });
        await this.client.socket?.sendMessage(Jid, {
            delete: convertingMessage!.key
        });
    }
}
