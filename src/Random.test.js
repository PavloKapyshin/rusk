import Random from "./Random";


it("chooses one element from array", () => {
    const arr = ["one", "two", "three", "four"];
    const result = Random.choice(arr);
    const indexOfResult = arr.indexOf(result);
    expect(indexOfResult).toBeGreaterThanOrEqual(0);
    expect(indexOfResult).toBeLessThan(arr.length);
});

it("chooses k elements from array", () => {
    const arr = ["el one", "two", "el three", "four"];
    const k = 3;
    const result = Random.sample(arr, k);
    expect(result.length).toEqual(k);
});

it("does not repeat elements in resulting sample", () => {
    const arr = ["el one", "two", "el three", "four"];
    const k = 2;
    for (let i = 0; i < 1000; i++) {
        let resultElements = new Set(Random.sample(arr, k));
        expect(resultElements.size).toEqual(k);
    }
});

it("throws an error when k is larger than population", () => {
    const arr = ["el one", "two"];
    const k = 3;
    expect(() => {
        Random.sample(arr, k)
    }).toThrowError("sample is larger than population");
});

it("chooses zero elements from empty array", () => {
    const arr = [];
    const k = 0;
    const result = Random.sample(arr, k);
    expect(result.length).toEqual(0);
});

it("chooses zero elements from non-empty array when k = 0", () => {
    const arr = ["el one", "two", "el three", "four"];
    const k = 0;
    const result = Random.sample(arr, k);
    expect(result.length).toEqual(0);
});
