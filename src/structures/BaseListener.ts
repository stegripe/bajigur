import { BaileysEvent, BaileysEventMap } from "@adiwajshing/baileys";
import { IListenerComponent } from "../types";
import { WhatsAppBot } from "./WhatsAppBot";

export abstract class BaseListener implements IListenerComponent {
    public constructor(
        public client: WhatsAppBot,
        public readonly meta: IListenerComponent["meta"]
    ) {}

    public executeEvent(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        data: BaileysEventMap[BaileysEvent]
        // eslint-disable-next-line @typescript-eslint/no-empty-function
    ): void {}
}
