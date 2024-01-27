export function isURL(maybeUrl: string) {
    try {
        new URL(maybeUrl);
        return true;
    } catch (_) {
        return false;
    }
}