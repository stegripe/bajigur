const { prefix } = require("../config.json");

exports.run = (bot, message) => {
    bot.sendText(message.from, `REST Latency: ${Date.now - message.restTimestamp}`);
};

exports.help = {
    name: "Ping",
    description: "PING PONG",
    usage: `${prefix}ping`,
    cooldown: 5
};
