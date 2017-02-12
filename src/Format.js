const REGEX = /\{([A-Za-z0-9]+)\}/g;


export default function format(template, replacements) {
    replacements = replacements || {};
    return template.replace(REGEX, (match, key) => {
        const value = replacements[key];
        if (typeof value === "undefined") {
            throw new Error("missing key: " + key);
        }
        return value;
    });
}
