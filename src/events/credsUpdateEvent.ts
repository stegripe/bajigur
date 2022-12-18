import { BaseListener } from "../structures/BaseListener";
import { ApplyMetadata } from "../utils/decorators";
import { IListenerComponent } from "../types";

@ApplyMetadata<IListenerComponent>({
    name: "creds.update"
})
export default class credsUpdateEvent extends BaseListener {
    public async executeEvent(): Promise<void> {
        await this.client.authState?.saveCreds();
        this.client.logger.info("Credentials updated");
    }
}
