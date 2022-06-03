import { ApplyMetadata } from "../../structures/ApplyMetadata.js";
import { BaseCommand } from "../../structures/BaseCommand.js";
import { ICommandComponent } from "../../types/index.js";
import { Message, MessageTypes } from "@open-wa/wa-automate";
import { inspect } from "node:util";

@ApplyMetadata<ICommandComponent>({
    name: "eval",
    description: "Evaluated javascript code",
    usage: "eval <code>",
    aliases: [],
    devOnly: true,
    disabled: false
})
export default class EvalCommand extends BaseCommand {
    public async execute(message: Message, args: string[]): Promise<void> {
        if ((message.quotedMsg || message).type !== MessageTypes.TEXT) {
            await this.whatsappbot.client.sendText(
                message.chatId,
                "This command only works on text."
            );
            return undefined;
        }

        const code = args.join(" ");
        const isAsync = code.includes("--async");
        const isSilent = code.includes("--silent");
        const toExecute =
            isAsync || isSilent ? code.replace(/--async|--silent/g, "") : code;

        try {
            const outputCode = inspect(
                // eslint-disable-next-line no-eval
                await eval(
                    isAsync ? `(async () => { ${toExecute} })()` : toExecute
                ), {
                    depth: 0
                }
            );
            if (outputCode.length > 60) {
                const result = `${await this.hastebin(outputCode)}.js`;
                if (!isSilent)
                    await this.whatsappbot.client.sendText(
                        message.chatId,
                        result
                    );
                return undefined;
            }
            if (!isSilent)
                await this.whatsappbot.client.sendText(
                    message.chatId,
                    outputCode
                );
        } catch (e) {
            const stringify = String(e);
            if (stringify.length > 60) {
                const result = `${await this.hastebin(stringify)}.js`;
                if (!isSilent)
                    await this.whatsappbot.client.sendText(
                        message.chatId,
                        result
                    );
                return undefined;
            }
            if (!isSilent)
                await this.whatsappbot.client.sendText(
                    message.chatId,
                    stringify
                );
        }
    }

    private async hastebin(text: string): Promise<string> {
        const result = await this.whatsappbot.request
            .post("https://bin.clytage.org/documents", {
                body: text
            })
            .json < {
                key: string
            } > ();

        return `https://bin.clytage.org/${result.key}`;
    }
}
