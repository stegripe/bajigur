import { ICommandComponent } from "../types";
import { WhatsAppBot } from "./WhatsAppBot";
import { proto } from "@adiwajshing/baileys";

export abstract class BaseCommand implements ICommandComponent {
    public constructor(
        public client: WhatsAppBot,
        public readonly meta: ICommandComponent["meta"]
    ) {}

    public executeCommand(args: string[], data: proto.IWebMessageInfo): void {}
}
