const { readdir } = require("fs");

exports.run = (bot, message, args) => {
    let tmpFile = {};
    readdir("./commands/", (e, files) => {
        if (e) console.error(e);
        files.forEach((jsFile) => {
            const cmdFile = require(`./${jsFile}`);
            tmpFile[jsFile.replace(".js", "")] = {};
            tmpFile[jsFile.replace(".js", "")].name = cmdFile.help.name;
            tmpFile[jsFile.replace(".js", "")].description = cmdFile.help.description;
            tmpFile[jsFile.replace(".js", "")].usage = cmdFile.help.usage;
        });

        if (!args[0]) {
            // prettier-ignore
            bot.sendText(message.from, `*Available commands:* ${Object.keys(tmpFile).join(", ")}\n\n_You can run *help <command name>* to show advanced help._`);
        } else {
            const commandName = args[0];
            const { name, description, usage } = require(`./${commandName}.js`).help;
            bot.sendText(message.from, `*${name}*\n\nDescription: ${description}\nUsage: \`\`\`${usage}\`\`\``);
        };
    });
};

exports.help = {
    name: "Help",
    description: "Show the bot's commands list",
    usage: "help",
    cooldown: 5,
};