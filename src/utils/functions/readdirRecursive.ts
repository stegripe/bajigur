import { readdirSync, statSync } from "fs";
import { join } from "path";

export const readdirRecursive = (directory: string): string[] => {
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
};
