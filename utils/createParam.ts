export function createParam(): string {
    let result = "?";
    const base = `{key}={value}&`;
    for (let i = 0; i < 10; i++) {
        result += base.replace("{key}", Math.random().toString(36).substring(2, 8)).replace("{value}", Math.random().toString(36).substring(2, 8).repeat(40));
    }
    return result;
}