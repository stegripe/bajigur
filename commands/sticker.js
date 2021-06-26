const { prefix } = require("../config.json");
const { decryptMedia } = require("@open-wa/wa-decrypt");
const uaOverride = "WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36";

exports.run = async (bot, message) => {
    const now = Date.now();
    if (message.isMedia && message.type === "image") {
        const media = await decryptMedia(message, uaOverride);
        await bot.sendImageAsSticker(message.from, `data:image/jpeg;base64,${media.toString("base64")}`, {
            author: message.sender.pushname,
            pack: "Zhycorp Bot"
        });
        return console.log(`[DEBUG] Sticker was generated in ${Date.now() - now}ms`);
    } else if (message.quotedMsgObj && message.quotedMsgObj.type === "image") {
        const media = await decryptMedia(message.quotedMsgObj, uaOverride);
        await bot.sendImageAsSticker(message.from, `data:image/jpeg;base64,${media.toString("base64")}`, {
            author: message.sender.pushname,
            pack: "Zhycorp Bot"
        });
        return console.log(`[DEBUG] Sticker was generated in ${Date.now() - now}ms`);
    } else if ((message.isMedia || message.isGif) || (message.mimetype === "video/mp4" || message.mimetype === "image/gif") || message.type === "video") {
        if (message.duration >= 10) return bot.reply(message.from, "❎ Sorry, but your attachment size is too large", message.id);
        const mediaData = await decryptMedia(message, uaOverride);
        try {
            await bot.sendMp4AsSticker(message.from, mediaData, {}, {
                author: message.sender.pushname,
                pack: "Zhycorp Bot"
            });
        } catch (error) {
            return bot.reply(message.from, "Error", message.id);
        }
    } else {
        return bot.reply(message.from, "❎ Please caption or quote some picture", message.id);
    }
};

exports.help = {
    name: "Sticker",
    description: "Generate an custom sticker using picture",
    usage: `${prefix}sticker`,
    cooldown: 3
};
