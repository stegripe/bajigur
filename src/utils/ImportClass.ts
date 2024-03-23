import { resolve } from "node:path";

export default async function ImportClass<T>(path: string, ...args: any[]): Promise<T | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const file = await import(`file://${resolve(path)}`).then(m => m.default);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    return file ? new file(...args) : undefined;
}
