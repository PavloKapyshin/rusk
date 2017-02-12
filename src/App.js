import React, { Component } from "react";

import Quiz from "./Quiz";

import "./App.css";
import questions from "./questions.json";
import strings from "./strings.json";


class LanguageChooser extends Component {
    handleChoice(language, evt) {
        this.props.reporter(language);
    }

    render() {
        const items = this.props.languages.map(language => {
            const handler = this.handleChoice.bind(this, language)
            return (
                <li key={language} onClick={handler}>
                    {strings[language].__language__.displayName}
                </li>
            );
        });
        return <ol>{items}</ol>;
    }
}


export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {language: "dummy"};
        this.handleLanguage = this.handleLanguage.bind(this);
    }

    handleLanguage(language) {
        this.setState({language: language});
    }

    render() {
        return (
            <div>
                <LanguageChooser
                    languages={["en", "ru"]}
                    reporter={this.handleLanguage} />
                <Quiz
                    questions={questions} askCount={2}
                    strings={strings[this.state.language].quiz} />
            </div>
        );
    }
}
