export default class Random {
    static choice(arr, arrLen) {
        arrLen = arrLen || arr.length;
        return arr[Math.floor(Math.random() * arrLen)];
    }

    static sample(arr, k) {
        const arrLen = arr.length;
        if (arrLen < k) {
            throw new RangeError("sample is larger than population");
        }
        if (k === 0 || arrLen === 0) {
            return [];
        }
        var selected = new Set([]);
        for (let i = 0; i < k; i++) {
            let choice;
            do {
                choice = this.choice(arr, arrLen)
            } while (selected.has(choice));
            selected.add(choice);
        }
        return Array.from(selected);
    }
}
