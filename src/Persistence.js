function makeStorage(factory) {
    try {
        return factory()
    } catch (e) {
        return null;
    }
}


export default class PersistenceManager {
    constructor(args) {
        this._defaultValue = args.default;
        this._key = args.key;
        this._storage = makeStorage(args.factory);
    }

    get() {
        const defaultValue = this._defaultValue;
        const storage = this._storage;
        if (!storage) {
            return defaultValue;
        }
        var value = storage.getItem(this._key);
        if (!value) {
            return defaultValue;
        }
        return JSON.parse(value);
    }

    set(value) {
        const storage = this._storage;
        if (storage) {
            storage.setItem(this._key, JSON.stringify(value));
        }
    }
}
