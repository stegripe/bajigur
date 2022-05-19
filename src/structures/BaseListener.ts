/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
import { IListenerComponent } from "../types";
import { WhatsappBot } from "./WhatsappBot";

export class BaseListener implements IListenerComponent {
    public constructor(
        public readonly client: WhatsappBot,
        public readonly meta: IListenerComponent["meta"]
    ) {}

    public execute(...args: any): void {}
}
