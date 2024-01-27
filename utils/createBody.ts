import { Buffer } from "npm:buffer";

export function createBody(): string {
    return Buffer.alloc(2 * 1024 * 1024 * 45).toString("UTF-8"); 
}