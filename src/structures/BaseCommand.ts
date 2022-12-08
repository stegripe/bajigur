/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */
import { proto } from "@adiwajshing/baileys";
import { ICommandComponent } from "../types";
import { WhatsappBot } from "./WhatsappBot";

export abstract class BaseCommand implements ICommandComponent {
    public constructor(
        public client: WhatsappBot,
        public readonly meta: ICommandComponent["meta"]
    ) {}

    public executeCommand(args: string[], data: proto.IWebMessageInfo): void {}
}
