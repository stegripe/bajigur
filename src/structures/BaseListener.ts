import { IListenerComponent } from "../types";
import { WhatsAppBot } from "./WhatsAppBot";
import { AuthenticationCreds, BaileysEvent, BaileysEventMap } from "@adiwajshing/baileys";

export abstract class BaseListener implements IListenerComponent {
    public constructor(
        public client: WhatsAppBot,
        public readonly meta: IListenerComponent["meta"]
    ) {}

    public executeEvent(
        data: BaileysEventMap<AuthenticationCreds>[BaileysEvent]
    ): void {}
}
