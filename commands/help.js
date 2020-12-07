const fs = require("fs");

exports.run = (message, bot) => {
    let tmpMessage = [];
    fs.readdir("./", (e, files) => {
        console.log(files);
        console.log("files");
        if (e) console.error(e);
        files.forEach(jsFile => {
            console.log(jsFile);
            console.log("jsFile");
            const cmdFile = require(`./${jsFile}`);
            let tmpFile = {};
            tmpFile[jsFile.replace(".js", "")].name = cmdFile.help.name;
            tmpFile[jsFile.replace(".js", "")].description = cmdFile.help.description;
            tmpFile[jsFile.replace(".js", "")].usage = cmdFile.help.usage;
            tmpMessage.push(tmpFile);
            console.log(tmpFile);
        });
        console.log(tmpMessage);
    });
};

exports.help = {
    name: "Help",
    description: "Show the bot command list",
    usage: "help",
    cooldown: 5
};