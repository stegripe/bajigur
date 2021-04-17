const { readdir } = require("fs");
const prefix = require("../config.json").prefix;

exports.run = (bot, message, args) => {
    const tmpFile = {};
    readdir("./commands/", (e, files) => {
        if (e) console.error(e);
        files.forEach(jsFile => {
            const cmdFile = require(`./${jsFile}`);
            tmpFile[jsFile.replace(".js", "")] = {};
            tmpFile[jsFile.replace(".js", "")].name = cmdFile.help.name;
            tmpFile[jsFile.replace(".js", "")].description = cmdFile.help.description;
            tmpFile[jsFile.replace(".js", "")].usage = cmdFile.help.usage;
        });

        // eslint-disable-next-line no-negated-condition
        if (!args[0]) {
            bot.sendText(message.from, `*Available commands:* ${Object.keys(tmpFile).join(", ")}\n\n_You can run *help <command name>* to show advanced help._`);
        } else {
            const commandName = args[0];
            const { name, description, usage } = require(`./${commandName}.js`).help;
            bot.sendText(message.from, `*${name}*\n\nDescription: ${description}\nUsage: \`\`\`${usage}\`\`\``);
        }
    });
};

exports.help = {
    name: "Help",
    description: "Show the bot's commands list",
    usage: `${prefix}help`,
    cooldown: 5
};
