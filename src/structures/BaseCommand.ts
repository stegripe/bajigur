import { proto } from "@whiskeysockets/baileys";
import { ICommandComponent } from "../types";
import { WhatsAppBot } from "./WhatsAppBot";

export abstract class BaseCommand implements ICommandComponent {
    public constructor(
        public client: WhatsAppBot,
        public readonly meta: ICommandComponent["meta"]
    ) { }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public executeCommand(args: string[], data: proto.IWebMessageInfo): void { }
}
