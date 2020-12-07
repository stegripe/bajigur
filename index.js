const prefix = require("./config.json").prefix;
const whatsapp = require("@open-wa/wa-automate");
const fs = require("fs");

const availableCommands = new Set();

fs.readdir("./commands", (e, files) => {
    if (e) return console.error(e);
    files.forEach((commandFile) => {
        availableCommands.add(commandFile.replace(".js", ""));
    });
});

whatsapp.create().then((bot) => start(bot));

function start(bot) {
    bot.onMessage(async (message) => {
        if (!message.body.startsWith(prefix)) return;
        const args = message.body.slice(prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        if (availableCommands.has(command))
            require(`./commands/${command}`).run(bot, message, args);
    });
};