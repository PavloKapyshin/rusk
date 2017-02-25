import getYearsString from "./Years";


it("formats single year for same year", () => {
    const result = getYearsString(2017, 2017, "--");
    expect(result).toEqual("2017");
});

it("formats two years for next year", () => {
    const result = getYearsString(2017, 2018, "--");
    expect(result).toEqual("2017--2018");
});

it("formats two years for distant years", () => {
    const result = getYearsString(2010, 2017, "--");
    expect(result).toEqual("2010--2017");
});

it("formats two years with specified seperator", () => {
    const result = getYearsString(2010, 2017, "|");
    expect(result).toEqual("2010|2017");
});
