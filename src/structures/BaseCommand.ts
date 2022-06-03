/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */
import { ICommandComponent } from "../types";
import { WhatsAppBot } from "./WhatsAppBot";

export class BaseCommand implements ICommandComponent {
    public constructor(
        public readonly whatsappbot: WhatsAppBot,
        public readonly meta: ICommandComponent["meta"]
    ) {}

    public execute(...args: any): void {}
}
