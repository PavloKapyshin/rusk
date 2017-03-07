import React, { Component } from "react";


export default class LanguageChooser extends Component {
    handleChoice(language, evt) {
        this.props.reporter(language);
    }

    render() {
        const items = this.props.languages.map(language => {
            const handler = this.handleChoice.bind(this, language)
            const active = language === this.props.active;
            const className = active ? "active" : "";
            return (
                <li key={language} onClick={handler} className={className}>
                    {this.props.strings[language].__language__.displayName}
                </li>
            );
        });
        return <ol className="language-chooser">{items}</ol>;
    }
}
