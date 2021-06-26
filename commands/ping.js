const { prefix } = require("../config.json");

exports.run = (bot, message) => {
    bot.reply(message.from, `REST Latency: ${Date.now() - message.restTimestamp}ms`, message.id);
};

exports.help = {
    name: "Ping",
    description: "PING PONG",
    usage: `${prefix}ping`,
    cooldown: 5
};
