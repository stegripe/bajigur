/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
import { ICommandComponent } from "../types";
import { WhatsappBot } from "./WhatsappBot";

export class BaseCommand implements ICommandComponent {
    public constructor(
        public readonly client: WhatsappBot,
        public readonly meta: ICommandComponent["meta"]
    ) {}

    public execute(...args: any): void {}
}
