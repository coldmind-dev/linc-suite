const DEFAULT_PORT = 80;
/**
 * @author: Patrik Forsberg <patrik.forsberg@coldmind.com>
 * @date: 2024-03-08 15:38
 */
function fromUrl(url) {
    let wsUrl = "";
    try {
        const urlObj = new URL(url);
        let protocol = urlObj?.protocol.toLowerCase();
        if (!protocol)
            protocol = "ws";
        if (!["ws", "wss", "http", "https"].includes(protocol)) {
            throw new Error("Invalid protocol");
        }
        if (!urlObj.port)
            urlObj.port = JSON.stringify(DEFAULT_PORT);
        wsUrl = urlObj.toString();
    }
    catch (e) {
        console.error("Invalid URL:: ", e);
        return null;
    }
    return wsUrl;
}
console.log("fromUrl ::", fromUrl("localhost"));
