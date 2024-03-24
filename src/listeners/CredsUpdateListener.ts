import ApplyMetadata from "#bajigur/decorators/ApplyMetadata.js";
import Listener from "#bajigur/structures/Listener.js";
import { IListener } from "#bajigur/types/index.js";

@ApplyMetadata<IListener>({
    name: "creds.update"
})
export default class CredsUpdateListener extends Listener {
    public async run(): Promise<void> {
        await this.client.authState?.saveCreds();
        this.client.logger.info("Credentials updated.");
    }
}
