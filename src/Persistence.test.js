import PersistenceManager from "./Persistence";


class LocalStorage {
    constructor() {
        this._data = {};
    }

    getItem(key) {
        return this._data[key] || null;
    }

    setItem(key, value) {
        this._data[key] = value;
    }
}


it("can get default", () => {
    const defaultValue = [];
    const man = new PersistenceManager({
        factory: () => new LocalStorage(),
        key: "something",
        default: defaultValue
    });
    expect(man.get()).toEqual(defaultValue);
});

it("can get what was set", () => {
    const defaultValue = [];
    const man = new PersistenceManager({
        factory: () => new LocalStorage(),
        key: "something",
        default: defaultValue
    });
    const value = [0];
    man.set(value);
    expect(man.get()).toEqual(value);
});

it("works when factory raises", () => {
    const defaultValue = "thing";
    const man = new PersistenceManager({
        factory: () => {throw new Error("just error")},
        key: "somekey",
        default: defaultValue
    });
    const value = [0];
    man.set(value);
    expect(man.get()).toEqual(defaultValue);
});

it("saves value into and reads value from storage", () => {
    const storage = new LocalStorage();
    const key = "somek";
    const defaultValue = [];
    const man = new PersistenceManager({
        factory: () => storage,
        key: key,
        default: defaultValue
    });
    const value = [0];

    expect(storage.getItem(key)).toBeNull();
    expect(man.get()).toEqual(defaultValue);
    expect(storage.getItem(key)).toBeNull();
    man.set(value);
    expect(storage.getItem(key)).toEqual(JSON.stringify(value));
    expect(man.get()).toEqual(value);
});

it("gets value set into same storage", () => {
    const storage = new LocalStorage();
    const args = {
        factory: () => storage,
        key: "otherk",
        default: []
    };
    const value = [0];

    const man1 = new PersistenceManager(args);
    expect(man1.get()).toEqual(args.default);
    man1.set(value);
    expect(man1.get()).toEqual(value);

    const man2 = new PersistenceManager(args);
    expect(man2.get()).toEqual(value);
});
