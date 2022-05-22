/* eslint-disable @typescript-eslint/no-extraneous-class, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access */
import { readdirSync, statSync } from "fs";
import { join, resolve } from "path";
import { platform } from "node:os";

export class Utils {
    public static async import<T>(
        path: string,
        ...args: any[]
    ): Promise<T | undefined> {
        const file = await import(
            `${platform() === "win32" ? "/" : ""}${resolve(path)}`
        ).then(m => m.default);
        return file ? new file(...args) : undefined;
    }

    public static readdirRecursive(directory: string): string[] {
        const results: string[] = [];

        function read(path: string): void {
            const files = readdirSync(path);
            for (const file of files) {
                const dir = join(path, file);
                if (statSync(dir).isDirectory()) {
                    read(dir);
                } else {
                    results.push(dir);
                }
            }
        }
        read(directory);
        return results;
    }

    public static async delay(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    public static importURLToString(url: string): string {
        const pathArray = new URL(url).pathname.split(/\/|\\/g).filter(Boolean);
        const path = pathArray.slice(0, -1).join("/");
        return decodeURIComponent(
            `${platform() === "win32" ? "" : "/"}${path}`
        );
    }

    public static pathStringToURLString(path: string): string {
        return new URL(`file://${path}`).toString();
    }

    public static parseEnvValue(str: string): string[] {
        return (
            str
                .match(
                    /(?<=(?:\s+|^))(?<str>['"])?(?:.*?)\k<str>(?=(?:(?:[,;])|(?:(?:\s+)?$)))/g
                )
                ?.filter(x => Boolean(x.trim()))
                .map(x =>
                    (x.startsWith("'") && x.endsWith("'")) ||
                    (x.startsWith('"') && x.endsWith('"'))
                        ? x.slice(1, x.length - 1)
                        : x
                ) ?? []
        );
    }
}
