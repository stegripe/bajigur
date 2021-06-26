/* eslint-disable no-undef */
const prefix = require("./config.json").prefix;
const whatsapp = require("@open-wa/wa-automate");
const fs = require("fs");

const availableCommands = new Set();

fs.readdir("./commands", (e, files) => {
    if (e) return console.error(e);
    files.forEach(commandFile => {
        availableCommands.add(commandFile.replace(".js", ""));
    });
});

whatsapp.create({
    blockCrashLogs: true,
    chromiumArgs: ["--no-sandbox", "--disable-setuid-sandbox"],
    disableSpins: true,
    headless: true,
    hostNotificationLang: "PT_BR",
    logConsole: false,
    popup: true,
    qrTimeout: 0,
    sessionId: "ZHYCORP",
    useChrome: true
}).then(bot => start(bot));

let args;
let command;

function start(bot) {
    bot.onStateChanged(async state => {
        if (state === "CONFLICT" || state === "UNLAUNCHED") bot.forceRefocus();
        console.log("[Client State]", state);
    });

    bot.onMessage(async message => {
        message.restTimestamp = Date.now();

        try {
            if (message.body.startsWith(prefix)) {
                args = message.body.slice(prefix.length).trim().split(/ +/g);
                command = args.shift().toLowerCase();
                sender = message.sender.pushname;
            } else {
                return;
            }
            if (message.caption.startsWith(prefix)) {
                args = message.caption.slice(prefix.length).trim().split(/ +/g);
                command = args.shift().toLowerCase();
                sender = message.sender.pushname;
            } else {
                return;
            }
        // eslint-disable-next-line no-empty
        } catch {}
        if (availableCommands.has(command)) {
            require(`./commands/${command}`).run(bot, message, args);
        }
    });
}
