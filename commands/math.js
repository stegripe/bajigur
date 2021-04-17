const { evaluate } = require("mathjs");
const prefix = require("../config.json").prefix;

exports.run = async (bot, message, args) => {
    const expressions = args.join(" ");
    const answer = evaluate(expressions);
    bot.sendText(message.from, answer.toString());
};

exports.help = {
    name: "Math",
    description: "Calculate something",
    usage: `${prefix}math <expression>`,
    cooldown: 5
};
