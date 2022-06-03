/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */
import { IListenerComponent } from "../types";
import { WhatsAppBot } from "./WhatsAppBot";

export class BaseListener implements IListenerComponent {
    public constructor(
        public readonly whatsappbot: WhatsAppBot,
        public readonly meta: IListenerComponent["meta"]
    ) {}

    public execute(...args: any): void {}
}
