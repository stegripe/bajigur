const wa = require("@open-wa/wa-automate");
const moment = require("moment-timezone");

const start = async (bot) => {
    console.log(moment.tz("Asia/Jakarta").format() + " => Sticker bot has been started up!");
    // Force-curr session
    bot.onStateChanged((state) => {
        console.log("statechanged", state);
        if (state === "CONFLICT") bot.forceRefocus();
    });
    // Message handler
    bot.onMessage(async (message) => {
        // Hello world
        if (message.body === "#hi" || message.body === "#hai" || message.body === "#halo" || message.body === "#hello") {
            bot.sendText(message.from, `Hi *${message.sender.pushname}*, if you want to make a sticker instantly, please send/quote some image attachments with caption \`\`\`#sticker\`\`\``);
        };
        // Attachment using #sticker
        if (message.type === "image" && message.caption === "#sticker") {
            console.log(moment.tz("Asia/Jakarta").format() + " => Someone just generated a sticker: " + message.from + " ( " + message.sender.pushname + " | " + message.chat.name + " )");
            const mediaData = await wa.decryptMedia(message);
            const imageBase64 = `data:${message.mimetype};base64,${mediaData.toString("base64")}`;
            bot.sendImageAsSticker(message.from, imageBase64);
        };
        // Quoted attachment using #sticker
        if (message.quotedMsg && message.quotedMsg.type === "image" && message.body === "#sticker") {
            console.log(moment.tz("Asia/Jakarta").format() + " => Someone just generated a sticker: " + message.from + " ( " + message.sender.pushname + " | " + message.chat.name + " )");
            const mediaData = await wa.decryptMedia(message.quotedMsg);
            const imageBase64 = `data:${message.quotedMsg.mimetype};base64,${mediaData.toString("base64")}`;
            bot.sendImageAsSticker(message.from, imageBase64);
        };
    });
};

// Start the bot
wa.create()
    .then((bot) => start(bot))
    .catch((error) => console.log(error));