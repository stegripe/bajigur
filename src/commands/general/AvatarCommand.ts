import { ApplyMetadata } from "../../utils/decorators/ApplyMetadata";
import { BaseCommand } from "../../structures/BaseCommand";
import { ICommandComponent } from "../../types";
import { Contact, Message } from "@open-wa/wa-automate";

@ApplyMetadata<ICommandComponent>({
    name: "avatar",
    description: "Get the user's profile picture.",
    usage: "avatar [user]",
    aliases: ["ava", "av", "pfp", "pp"]
})
export default class AvatarCommand extends BaseCommand {
    public async execute(message: Message): Promise<void> {
        const getMentionedFirst = (await this.whatsappbot.client.getContact(
            message.mentionedJidList[0]
        )) as unknown as Contact | null;
        if (
            message.mentionedJidList.length &&
            !getMentionedFirst?.profilePicThumbObj.imgFull
        ) {
            await this.whatsappbot.client.sendText(
                message.chatId,
                `No avatar found for ${
                    getMentionedFirst?.pushname ?? "Unknown User"
                }.`
            );
            return undefined;
        }
        const getAvatarFromMentionOrSender =
            getMentionedFirst?.profilePicThumbObj.imgFull ??
            message.sender.profilePicThumbObj.imgFull;
        console.log(message, getMentionedFirst);
        await this.whatsappbot.client.sendImage(
            message.chatId,
            getAvatarFromMentionOrSender,
            "avatar.png",
            `Avatar of ${getMentionedFirst?.name ?? message.sender.pushname}.`
        );
    }
}
