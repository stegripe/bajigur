import {
    blueBright,
    bold,
    redBright,
    whiteBright,
    yellowBright
} from "colorette";
import dayjs from "dayjs";
import { Utils } from "../Utils";

export class Logger {
    public debug(...messages: any[]): void {
        this.log(messages, "debug");
    }

    public error(...messages: any[]): void {
        this.log(
            messages.map(message =>
                message instanceof String
                    ? message.replace(
                          new RegExp(
                              `${Utils.importURLToString(import.meta.url)}/`,
                              "g"
                          ),
                          "./"
                      )
                    : message
            ),
            "error"
        );
    }

    public info(...messages: any[]): void {
        this.log(messages, "info");
    }

    public warn(...messages: any[]): void {
        this.log(messages, "warn");
    }

    private get timestamp(): string {
        return dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
    }

    private log(
        messages: any[],
        type: "debug" | "error" | "info" | "warn" = "info"
    ): void {
        let color;
        switch (type) {
            case "debug":
                color = whiteBright;
                break;
            case "error":
                color = redBright;
                break;
            case "info":
                color = blueBright;
                break;
            case "warn":
                color = yellowBright;
                break;
            default:
                color = blueBright;
                break;
        }
        console[type](
            color(
                `${bold(
                    `[${this.timestamp}] - [${
                        (messages[0] as string | undefined)
                            ?.toUpperCase()
                            .split(" ")
                            .join("_") ?? type
                    }]: ${messages
                        .slice(1)
                        .map(x => String(x))
                        .join(" ")}`
                )}`
            )
        );
    }
}
