const wa = require("@open-wa/wa-automate");
const moment = require("moment-timezone");
let { prefix, timezone } = require('./config')

const start = async (bot) => {
    console.log(`[READY] ${moment.tz(timezone).format()} => The sticker bot has been booted up!`);
    // Force-curr session
    bot.onStateChanged((state) => {
        console.log("[StateChange] StateChanged status:", state);
        if (state === "CONFLICT") bot.forceRefocus();
    });
    // Message handler
    bot.onMessage(async (message) => {
        if(!prefix) prefix = "#";
        if(!message.body.startsWith(prefix)) return;
        
        let command = message.body.toLowerCase().split(" ")[0];
        command = command.slice(prefix.length);
        
        // Hello world
        if (command === "hi" || command === "hai" || command === "halo" || command === "hello") {
            console.log(`[DEBUG] [runCmd] ${moment.tz(timezone).format()} => Someone has used 'hi' command: ${message.from} ( ${message.sender.pushname} | ${message.chat.name} )`);
            bot.sendText(message.from, `Hi *${message.sender.pushname}*, if you want to make a sticker instantly, please send/quote some image attachments with caption \`\`\`${prefix}sticker\`\`\``);
        };
        // Attachment using #sticker
        if (message.type === "image" && command === "sticker") {
            console.log(`[DEBUG] [create] ${moment.tz(timezone).format()} => Someone has just created a new sticker by attaching: ${message.from} ( ${message.sender.pushname} | ${message.chat.name} )`);
            const mediaData = await wa.decryptMedia(message);
            const imageBase64 = `data:${message.mimetype};base64,${mediaData.toString("base64")}`;
            bot.sendImageAsSticker(message.from, imageBase64);
        };
        // Quoted attachment using #sticker
        if (message.quotedMsg && message.quotedMsg.type === "image" && command === "sticker") {
            console.log(`[DEBUG] [create] ${moment.tz(timezone).format()} => Someone has just created a new sticker by quoting: ${message.from} ( ${message.sender.pushname} | ${message.chat.name} )`);
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
