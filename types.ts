export interface L7RequestBody {
    targetUrl: string,
    method: "GET" | "POST",
    timeout: number
}