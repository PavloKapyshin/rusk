import format from "./Format";


it("works with {{", () => {
    const tmpl = "test1 {{thing}} test2";
    const result = format(tmpl, {thing: "here"});
    expect(result).toEqual("test1 {here} test2");
});

it("works at the beginning of template", () => {
    const tmpl = "{thing} test2";
    const result = format(tmpl, {thing: "simple"});
    expect(result).toEqual("simple test2");
});

it("works at the end of template", () => {
    const tmpl = "test1 {thing}";
    const result = format(tmpl, {thing: "simple"});
    expect(result).toEqual("test1 simple");
});

it("works in the middle of template", () => {
    const tmpl = "test1 {thing} test2";
    const result = format(tmpl, {thing: "simple"});
    expect(result).toEqual("test1 simple test2");
});

it("throws an error if key does not exist", () => {
    const tmpl = "test1 {thing} test2";
    expect(() => {
        format(tmpl)
    }).toThrowError("missing key: thing");
});

it("works with multiple different keys", () => {
    const tmpl = "test1 {thing} {test2}";
    const result = format(tmpl, {thing: "simple", test2: "THING"});
    expect(result).toEqual("test1 simple THING");
});

it("works with multiple uses of single key", () => {
    const tmpl = "test1 {thing} {thing}";
    const result = format(tmpl, {thing: "simple"});
    expect(result).toEqual("test1 simple simple");
});
