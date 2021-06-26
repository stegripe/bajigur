const { prefix } = require("../config.json");

exports.run = (bot, message) => {
    bot.sendText(message.from, "Test").then(m => {
        console.log(message);
        return bot.deleteMessage(message.from, m);
    });
};

exports.help = {
    name: "Log",
    description: "Developer-only command",
    usage: `${prefix}log`,
    cooldown: 1
};
