import Message from "./Message";


it("constructs error message from string", () => {
    const value = "Something happened.";
    const result = Message.error(value);
    expect(result.value).toEqual(value);
    expect(result.level).toEqual("error");
});

it("constructs info message from string", () => {
    const value = "Something happened, but it does not matter.";
    const result = Message.info(value);
    expect(result.value).toEqual(value);
    expect(result.level).toEqual("info");
});

it("constructs success message from string", () => {
    const value = "Something happened, and it is good.";
    const result = Message.success(value);
    expect(result.value).toEqual(value);
    expect(result.level).toEqual("success");
});
