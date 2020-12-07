exports.run = (message, bot) => {
    console.log(message);
};

exports.help = {
    name: "Log",
    description: "Developer-only command",
    usage: "log",
    cooldown: 1
};