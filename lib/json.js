const fs = require("fs");

exports.read = function(path, fallback) {
    try {
        return JSON.parse(fs.readFileSync(path, "utf-8"));
    } catch(err) {
        if (!fallback) throw err;
        return fallback(err);
    }
}

exports.write = function(path, obj) {
    fs.writeFileSync(path, JSON.stringify(obj, null, 4));
}