import { IListenerComponent } from "../types";
import { WhatsAppBot } from "./WhatsAppBot";
import { AuthenticationCreds, BaileysEvent, BaileysEventMap } from "@adiwajshing/baileys";

export abstract class BaseListener implements IListenerComponent {
    public constructor(
        public client: WhatsAppBot,
        public readonly meta: IListenerComponent["meta"]
    ) {}

    public executeEvent(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        data: BaileysEventMap<AuthenticationCreds>[BaileysEvent]
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ): void {}
}
