import { ApplyOptions } from "@nezuchan/decorators";
import { Command, CommandOptions } from "@clytage/liqueur";
import { unlinkSync, writeFileSync } from "fs";
import { join } from "path";
import { fileTypeFromBuffer } from "file-type";
import { botName, stickerPack } from "../../config/env.js";
import { createSticker } from "wa-sticker";
import { ArgumentStream } from "@sapphire/lexure";

import baileys from "@whiskeysockets/baileys";
const { downloadMediaMessage, proto } = baileys;

@ApplyOptions<CommandOptions>({
    aliases: [],
    name: "sticker",
    description: "Convert image to sticker",
    usage: "{prefix}sticker <image/video/gif> [sticker pack name]",
    preconditions: []
})
export class StickerCommand extends Command {
    public async messageRun(data: baileys.proto.IWebMessageInfo, args: ArgumentStream): Promise<any> {
        const packName = args.many().unwrapOr([]).map(x => x.value);
        if (data.message?.imageMessage ?? data.message?.videoMessage) {
            if ((data.message.videoMessage?.seconds ?? 0) >= 10) {
                await this.container.client.socket?.sendMessage(data.key.remoteJid!, {
                    text: "Please use Video or GIF with duration under 10 seconds."
                });
                return undefined;
            }
            return this.convertToSticker(data.key.remoteJid!, data, data, packName);
        }
        if (data.message?.documentWithCaptionMessage) {
            if (
                (data.message.documentWithCaptionMessage.message?.videoMessage
                    ?.seconds ?? 0) >= 10
            ) {
                await this.container.client.socket?.sendMessage(data.key.remoteJid!, {
                    text: "Please use Video or GIF with duration under 10 seconds."
                });
                return undefined;
            }
            return this.convertToSticker(
                data.key.remoteJid!,
                proto.WebMessageInfo.create({
                    ...data,
                    message: data.message.documentWithCaptionMessage.message
                }),
                data,
                packName
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
                await this.container.client.socket?.sendMessage(data.key.remoteJid!, {
                    text: "Please use Video or GIF with duration under 10 seconds."
                });
                return undefined;
            }
            return this.convertToSticker(
                data.key.remoteJid!,
                proto.WebMessageInfo.create({
                    ...data,
                    message:
                        data.message.extendedTextMessage.contextInfo
                            .quotedMessage
                }),
                data,
                packName
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
                await this.container.client.socket?.sendMessage(data.key.remoteJid!, {
                    text: "Please use Video or GIF with duration under 10 seconds."
                });
                return undefined;
            }
            return this.convertToSticker(
                data.key.remoteJid!,
                proto.WebMessageInfo.create({
                    ...data,
                    message:
                        data.message.extendedTextMessage.contextInfo
                            .quotedMessage.documentWithCaptionMessage.message
                }),
                data,
                packName
            );
        }
        await this.container.client.socket?.sendMessage(
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
        message: baileys.proto.IWebMessageInfo,
        from: baileys.proto.IWebMessageInfo,
        args?: string[]
    ): Promise<void> {
        const convertingMessage = await this.container.client.socket?.sendMessage(Jid, {
            text: "_Converting to sticker..._"
        });

        const buffer = (await downloadMediaMessage(
            message,
            "buffer",
            {}
        )) as Buffer;

        const fileType = await fileTypeFromBuffer(buffer);
        const fileName = `${Date.now()}.${fileType?.ext}`;
        const filePath = join(process.cwd(), fileName);

        writeFileSync(filePath, buffer);

        let quality = 100 - ((buffer.length / 2) * 100) / 1_000_000;

        const stickerOptions = {
            crop: false,
            metadata: {
                publisher: botName,
                packname: args?.length
                    ? args.join(" ")
                    : stickerPack
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

        await this.container.client.socket?.sendMessage(Jid, sticker, { quoted: from });
        await this.container.client.socket?.sendMessage(Jid, {
            delete: convertingMessage!.key
        });
    }
}
