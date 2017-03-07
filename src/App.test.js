import React from "react";
import ReactDOM from "react-dom";

import App from "./App";


it("renders without crashing", () => {
    const container = document.createElement("div");
    ReactDOM.render(<App />, container);
});
