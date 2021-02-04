const prefix = require("./config.json").prefix;
const whatsapp = require("@open-wa/wa-automate");
const fs = require("fs");
let args;
let command;

const availableCommands = new Set();

fs.readdir("./commands", (e, files) => {
    if (e) return console.error(e);
    files.forEach(commandFile => {
        availableCommands.add(commandFile.replace(".js", ""));
    });
});

whatsapp.create({
    useChrome: true,
    headless: false,
    chromiumArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox'
    ]
}).then((bot) => start(bot));

function start(bot) {
    bot.onStateChanged(async state => {
        console.log('[Client State]', state)
        if (state === 'CONFLICT' || state === 'UNLAUNCHED') bot.forceRefocus()
    });

    bot.onMessage(async message => {
        if (message.body.startsWith(prefix)) {
            args = message.body.slice(prefix.length).trim().split(/ +/g);
            command = args.shift().toLowerCase()
            sender = message.sender.pushname
        } else if (message.caption.startsWith(prefix)) {
            args = message.caption.slice(prefix.length).trim().split(/ +/g);
            command = args.shift().toLowerCase()
            sender = message.sender.pushname
        } else return;
        if (availableCommands.has(command)) { require(`./commands/${command}`).run(bot, message, args); }
    });
}
