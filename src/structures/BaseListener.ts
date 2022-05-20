/* eslint-disable @typescript-eslint/no-empty-function, @typescript-eslint/no-unused-vars */
import { IListenerComponent } from "../types";
import { WhatsappBot } from "./WhatsappBot";

export class BaseListener implements IListenerComponent {
    public constructor(
        public readonly client: WhatsappBot,
        public readonly meta: IListenerComponent["meta"]
    ) {}

    public execute(...args: any): void {}
}
