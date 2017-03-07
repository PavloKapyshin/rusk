import React from "react";
import { shallow, render } from "enzyme";

import Copyrights from "./Copyrights";


it("renders text in correct order (ru)", () => {
    const result = render(
        <Copyrights
            language="ru"
            startYear={2008} endYear={2010}
            name="Some name" url="http://example.org" />
    );
    expect(result.text()).toEqual("© Some name, 2008—2010");
});

it("renders text in correct order (en)", () => {
    const result = render(
        <Copyrights
            language="en"
            startYear={2008} endYear={2010}
            name="Some name" url="http://example.org" />
    );
    expect(result.text()).toEqual("© 2008–2010 Some name");
});

it("has link with name and url", () => {
    const result = shallow(
        <Copyrights
            language="ru"
            startYear={2008} endYear={2010}
            name="Some name" url="http://example.org" />
    );
    const link = <a href="http://example.org">Some name</a>;
    expect(result.contains(link)).toEqual(true);
});

it("uses mdash for years range (ru)", () => {
    const result = shallow(
        <Copyrights
            language="ru"
            startYear={2008} endYear={2010}
            name="Some name" url="http://example.org" />
    );
    expect(result.contains("2008—2010")).toEqual(true);
});

it("not uses mdash for same year (ru)", () => {
    const result = shallow(
        <Copyrights
            language="ru"
            startYear={2008} endYear={2008}
            name="Some name" url="http://example.org" />
    );
    expect(result.contains("2008—2008")).not.toEqual(true);
    expect(result.contains("2008")).toEqual(true);
});

it("uses ndash for years range (en)", () => {
    const result = shallow(
        <Copyrights
            language="en"
            startYear={2008} endYear={2010}
            name="Some name" url="http://example.org" />
    );
    expect(result.contains("2008–2010")).toEqual(true);
});

it("not uses ndash for same year (en)", () => {
    const result = shallow(
        <Copyrights
            language="en"
            startYear={2008} endYear={2008}
            name="Some name" url="http://example.org" />
    );
    expect(result.contains("2008–2008")).not.toEqual(true);
    expect(result.contains("2008")).toEqual(true);
});
