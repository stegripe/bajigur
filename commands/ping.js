const prefix = require("../config.json").prefix;

exports.run = (bot, message) => {
    bot.sendText(message.from, "🏓 PONG!");
};

exports.help = {
    name: "Ping",
    description: "PING PONG",
    usage: `${prefix}ping`,
    cooldown: 5
};
