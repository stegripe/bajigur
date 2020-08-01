const wa = require("@open-wa/wa-automate");
const moment = require("moment-timezone");

const start = async (client) => {
    console.log(moment.tz("Asia/Jakarta").format() + " => Sticker bot has been started up!");
    // Message handler
    bot.onMessage(async (message) => {
        // Hello world
        if (message.body === "#hi" || message.body === "#hai" || message.body === "#halo" || message.body === "#hello") {
            bot.sendText(message.from, "Hi, if you want to make a sticker instantly, please send/quote some image attachments with caption `#sticker`");
        }
    });
};

// Start the bot
wa.create()
    .then((bot) => start(bot))
    .catch((error) => console.log(error));