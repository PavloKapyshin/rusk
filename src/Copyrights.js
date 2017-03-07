import React, { Component } from "react";

import getYearsString from "./Years";


export default class Copyrights extends Component {
    render() {
        const isRu = this.props.language === "ru";

        const yearsSep = isRu ? "—" : "–";
        const years = getYearsString(
            this.props.startYear, this.props.endYear, yearsSep);

        const link = <a href={this.props.url}>{this.props.name}</a>;

        var first, sep, second;
        if (isRu) {
            first = link;
            sep = ", ";
            second = years;
        } else {
            first = years;
            sep = " ";
            second = link;
        }
        return <span>© {first}{sep}{second}</span>;
    }
}
