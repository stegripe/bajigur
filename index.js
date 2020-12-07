const whatsapp = require("@open-wa/wa-automate");
const { decryptMedia } = require("@open-wa/wa-decrypt");
const uaOverride = "WhatsApp/2.2029.4 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36";
const prefix = "/";

whatsapp.create().then(bot => start(bot));

function start(bot) {
    bot.onMessage(async msg => {
        if (!msg.body.startsWith(prefix)) return;
        const args = msg.body.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();
        if (command == "ping") bot.sendText(msg.from, "🏓 *|* PONG!");
        if (command == "sticker") {
            if (msg.quotedMsgObj == null || msg.quotedMsgObj.type != "image") return bot.sendText(msg.from, "Please quote a picture!");
            decryptMedia(msg.quotedMsgObj, uaOverride).then((media) => bot.sendImageAsSticker(msg.from, `data:image/jpeg;base64,${media.toString("base64")}`));
        };
    });
};