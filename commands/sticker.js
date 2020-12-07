const { decryptMedia } = require("@open-wa/wa-decrypt");
const uaOverride = "WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36";

exports.run = async (bot, message) => {
    if (message.quotedMsgObj == null || message.quotedMsgObj.type != "image") return bot.sendText(message.from, "❎ Please caption/quote some picture!");
    const waiting = await bot.sendText(message.from, "_⌛ Please wait..._");
    const media = await decryptMedia(message.quotedMsgObj, uaOverride);
    bot.sendImageAsSticker(message.from, `data:image/jpeg;base64,${media.toString("base64")}`).then((_) => {
        bot.deleteMessage(message.from, waiting);
    });
};

exports.help = {
    name: "Sticker",
    description: "Stickerify a picture",
    usage: "sticker",
    cooldown: 5
};