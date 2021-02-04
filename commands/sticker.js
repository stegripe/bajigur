/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const { decryptMedia } = require("@open-wa/wa-decrypt");
const { exec } = require("child_process");
const fs = require("fs");
const uaOverride = "WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36";

exports.run = async (bot, message) => {
    /* if (message.isMediaObj == null && message.type !== "image" || message.quotedMsgObj == null && message.quotedMsgObj.type !== "image") {
        return bot.sendText(message.from, "❎ Please caption/quote some picture!");
    }; */

    if (message.isMediaObj && message.type === "image") {
        const waiting = await bot.sendText(message.from, "_⌛ Please wait..._");
        const media = await decryptMedia(message.isMediaObj, uaOverride);
        bot.sendImageAsSticker(message.from, `data:image/jpeg;base64,${media.toString("base64")}`).then(_ => {
            bot.deleteMessage(message.from, waiting);
        });
        console.log(`[DEBUG] Sticker was generated in ${Date.now() - now}ms`);
    }

    if (message.quotedMsgObj && message.quotedMsgObj.type === "image") {
        const waiting = await bot.sendText(message.from, "_⌛ Please wait..._");
        const media = await decryptMedia(message.quotedMsgObj, uaOverride);
        bot.sendImageAsSticker(message.from, `data:image/jpeg;base64,${media.toString("base64")}`).then(_ => {
            bot.deleteMessage(message.from, waiting);
        });
        console.log(`[DEBUG] Sticker was generated in ${Date.now() - now}ms`);
    }

    if ((message.isMedia || message.isGif) || (message.mimetype === "video/mp4" || message.mimetype === "image/gif") || message.type === "video") {
        if (message.duration >= 10) return bot.reply(message.from, "❎ Your attachment is too big", message.id);
        bot.reply(message.from, "_⌛ Please wait..._", message.id);
        const mediaData = await decryptMedia(message, uaOverride);
        const filename = `./assets/stickers/sticker.${message.mimetype.split("/")[1]}`;
        fs.writeFileSync(filename, mediaData);
        try {
            await exec(`gify ./assets/stickers/sticker.mp4 ./assets/stickers/output.gif --fps=30 --scale=240:240`, async (error, stdout, stderr) => {
                const gif = fs.readFileSync("./assets/stickers/output.gif", {
                    encoding: "base64"
                });
                bot.sendImageAsSticker(message.from, `data:image/gif;base64, ${gif.toString("base64")}`, {
                    author: message.sender.pushname,
                    pack: "WhatsAppBot"
                });
            });
        } catch (error) {
            bot.reply(message.from, "Error", message.id);
        }
    }
};

exports.help = {
    name: "Sticker",
    description: "Stickerify a picture",
    usage: "sticker",
    cooldown: 5
};
