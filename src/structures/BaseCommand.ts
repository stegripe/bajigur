/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */
import { ICommandComponent } from "../types";
import { WhatsappBot } from "./WhatsappBot";

export class BaseCommand implements ICommandComponent {
    public constructor(
        public readonly whatsappbot: WhatsappBot,
        public readonly meta: ICommandComponent["meta"]
    ) {}

    public execute(...args: any): void {}
}
