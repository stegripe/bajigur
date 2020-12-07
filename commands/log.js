exports.run = (bot, message) => {
    bot.sendText(message.from, "Test").then(m => {
        console.log(message);
        bot.deleteMessage(message.from, m);
    });
};

exports.help = {
    name: "Log",
    description: "Developer-only command",
    usage: "log",
    cooldown: 1
};