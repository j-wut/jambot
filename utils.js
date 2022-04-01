export const isMod = (tags) => {
    return tags["mod"] || tags["badges"]["broadcaster"] || tags["badges"]["moderator"]
};