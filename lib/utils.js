module.exports = {
    arrayForEach: async function (arr, f, thisArg) {
        let i,
            count = arr.length;
        for (i = 0; i < count; i++) {
            await f.call(thisArg, arr[i], i, arr);
        }
    },
    sleepAsync: function (ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    },
    removeObjectEntry: function (obj, filter) {
        Object.keys(obj).forEach((key) => {
            if (!filter(key, obj[key])) {
                delete obj[key];
            }
        });
    },
    awaitEvent: function (eventEmitter, eventName) {
        return new Promise((resolve) => {
            eventEmitter.once(eventName, (...args) => resolve(args));
        });
    },
};
