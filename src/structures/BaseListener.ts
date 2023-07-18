import { IListenerComponent } from "../types";
import { WhatsAppBot } from "./WhatsAppBot";
import { BaileysEvent, BaileysEventMap } from "@whiskeysockets/baileys";

export abstract class BaseListener implements IListenerComponent {
    public constructor(
        public client: WhatsAppBot,
        public readonly meta: IListenerComponent["meta"]
    ) { }

    public executeEvent(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        data: BaileysEventMap[BaileysEvent]
        // eslint-disable-next-line @typescript-eslint/no-empty-function
    ): void { }
}
