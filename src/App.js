import React, { Component } from "react";

import Quiz from "./Quiz";
import PersistenceManager from "./Persistence";
import Copyrights from "./Copyrights";

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
            const active = language === this.props.active;
            const className = active ? "active" : "";
            return (
                <li key={language} onClick={handler} className={className}>
                    {strings[language].__language__.displayName}
                </li>
            );
        });
        return <ol className="language-chooser">{items}</ol>;
    }
}


export default class App extends Component {
    constructor(props) {
        super(props);
        this.languagePersister = new PersistenceManager({
            factory: () => window.localStorage,
            key: "language",
            default: "en"
        });
        this.state = {language: this.languagePersister.get()};
        this.handleLanguage = this.handleLanguage.bind(this);
    }

    handleLanguage(language) {
        this.setState({language: language});
        this.languagePersister.set(language);
    }

    render() {
        const lang = this.state.language;
        const strs = strings[lang];
        return (
            <div className="outer">
                <div className="inner">
                    <LanguageChooser
                        languages={["en", "ru"]}
                        reporter={this.handleLanguage}
                        active={lang} />
                    <Quiz
                        questions={questions} askCount={2}
                        strings={strs.quiz} />
                </div>
                <ol className="footer">
                    <li>
                        <Copyrights
                            startYear={2017}
                            endYear={new Date().getFullYear()}
                            language={lang}
                            name={strs.copyrightsName}
                            url="http://93z.org" />
                    </li>
                    <li>
                        <a href="https://github.com/PavloKapyshin/rusk">
                            GitHub
                        </a>
                    </li>
                </ol>
            </div>
        );
    }
}
