import { Listener, ListenerOptions } from "@clytage/liqueur";
import { ApplyOptions } from "@nezuchan/decorators";

@ApplyOptions<ListenerOptions>({
    event: "creds.update",
    emitter: "baileysEmitter"
})
export class CredsUpdate extends Listener {
    public async run(): Promise<any> {
        await this.container.authState.saveCreds();
        this.container.client.logger.info("Credentials has been updated.");
    }
}