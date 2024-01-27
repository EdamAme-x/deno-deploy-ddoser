import UserAgents from "../data/useragents.json" assert { type: "json" };

export function createUA() {
    return UserAgents.useragents[Math.floor(Math.random() * UserAgents.useragents.length)].replace(/{{version}}/g, Math.floor(Math.random() * 1000).toString());
}