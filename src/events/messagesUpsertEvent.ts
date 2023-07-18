import { BaseListener } from "../structures/BaseListener";
import { ApplyMetadata } from "../utils/decorators";
import { IListenerComponent } from "../types";
import { BaileysEventMap } from "@whiskeysockets/baileys";

@ApplyMetadata<IListenerComponent>({
    name: "messages.upsert"
})
export default class messagesUpsertEvent extends BaseListener {
    public executeEvent({
        messages
    }: BaileysEventMap["messages.upsert"]): void {
        const messageData = messages[0];
        const findMessage = messageData.message?.conversation?.length
            ? messageData.message.conversation
            : messageData.message?.extendedTextMessage?.text ??
            messageData.message?.imageMessage?.caption ??
            messageData.message?.videoMessage?.caption ??
            messageData.message?.documentWithCaptionMessage?.message
                ?.documentMessage?.caption ??
            messageData.message?.groupInviteMessage?.caption ??
            messageData.message?.liveLocationMessage?.caption;

        if (
            findMessage?.startsWith(this.client.config.prefix) &&
            !messageData.key.fromMe &&
            this.client.commandHandler.isReady
        ) {
            this.client.commandHandler.handle(findMessage, messageData);
        }
    }
}
