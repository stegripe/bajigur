import { Command, Events, Listener, ListenerOptions, UserError } from "@clytage/liqueur";
import { ApplyOptions } from "@nezuchan/decorators";
import { proto } from "@whiskeysockets/baileys";

@ApplyOptions<ListenerOptions>({
    event: Events.MessageCommandDenied
})
export class messageCommandDenied extends Listener {
    public async run(res: UserError, { msg }: { msg: proto.IWebMessageInfo; command: Command; rawArgs: string[] }): Promise<any> {
        if (!res.message || Reflect.get(msg, "silent") !== undefined) return;
        return this.container.client.socket?.sendMessage(msg.key.remoteJid!, {
            text: res.message
        });
    }
}