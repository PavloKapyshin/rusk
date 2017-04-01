import React, { Component } from "react";

import Random from "./Random";
import Message from "./Message";
import PersistenceManager from "./Persistence";
import format from "./Format";


function answerIsCorrect(answerIndex, question) {
    return question.c.indexOf(answerIndex) >= 0;
}


function formatQuestion(question, questionKindTemplates) {
    return format(  // translation is the default kind
        questionKindTemplates[question.k || "tr"],
        {text: question.t});
}


class QuizLapOptions extends Component {
    render() {
        const options = this.props.question.o.map((optionText, idx) => {
            let className = "";
            if (this.props.checked) {  // submitted answer, can't change mind
                className = answerIsCorrect(
                    idx, this.props.question) ? "correct" : "incorrect";
            }
            return (
                <li key={idx} className={className}>
                    <label>
                        <input
                            type="radio" value={idx} name="same"
                            onClick={this.props.handler} autoComplete="off"
                            checked={idx === this.props.checkedAnswerIndex} />
                        {" "}
                        {optionText}
                    </label>
                </li>
            );
        });
        return (
            <ol className="quiz-lap-options">{options}</ol>
        );
    }
}


class QuizLapSubmit extends Component {
    render() {
        const strs = this.props.strings;

        var handler, text;
        if (this.props.checked) {
            handler = this.props.reportHandler;
            text = strs.report;
        } else {
            handler = this.props.checkHandler;
            text = strs.check;
        }
        return (
            <div className="btn-wrapper">
                <button
                    className="btn submit"
                    onClick={handler}>{text}</button>
            </div>
        );
    }
}


class QuizLapMessage extends Component {
    render() {
        const message = this.props.message;
        if (!message) {
            return null;
        }
        const className = "quiz-lap-message " + message.level;
        return <div className={className}>{message.value}</div>;
    }
}


const Verdict = {
    correct: strs => {return Message.success(strs.correct)},
    incorrect: strs => {return Message.error(strs.incorrect)},
    chooseSomething: strs => {return Message.info(strs.chooseSomething)},
    null: (strs) => null
};


class QuizLap extends Component {
    constructor(props) {
        super(props);
        this.initialState = {
            answerIndex: null, verdict: Verdict.null, checked: false};
        this.state = this.initialState;
        this.handleAnswer = this.handleAnswer.bind(this);
        this.checkAnswer = this.checkAnswer.bind(this);
        this.reportAnswer = this.reportAnswer.bind(this);
    }

    reportAnswer(evt) {
        const answerIndex = this.state.answerIndex;
        this.props.reporter({
            index: answerIndex,
            correct: answerIsCorrect(answerIndex, this.props.question)
        });
        this.setState(this.initialState);
    }

    handleAnswer(evt) {
        if (!this.state.checked) {
            const answerIndex = parseInt(evt.target.value, 10);
            this.setState({answerIndex: answerIndex});
        }
    }

    checkAnswer(evt) {
        var verdict, checked;
        const answerIndex = this.state.answerIndex;
        if (typeof answerIndex !== "number") {  // no answer
            verdict = Verdict.chooseSomething;
            checked = false;
        } else {
            checked = true;
            if (answerIsCorrect(answerIndex, this.props.question)) {
                verdict = Verdict.correct;
            } else {
                verdict = Verdict.incorrect;
            }
        }
        this.setState({verdict: verdict, checked: checked});
    }

    render() {
        const strs = this.props.strings;

        const question = this.props.question;
        const questionText = formatQuestion(
            question, this.props.questionKindTemplates);

        const answerWasChecked = this.state.checked;

        return (
            <div className="quiz-lap">
                <p className="quiz-lap-question">{questionText}</p>
                <QuizLapOptions
                    question={question} handler={this.handleAnswer}
                    checkedAnswerIndex={this.state.answerIndex}
                    checked={answerWasChecked} />
                <QuizLapSubmit
                    checked={answerWasChecked} checkHandler={this.checkAnswer}
                    reportHandler={this.reportAnswer} strings={strs.submit} />
                <QuizLapMessage message={this.state.verdict(strs.messages)} />
            </div>
        );
    }
}


class QuizLearningModeTrigger extends Component {
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(evt) {
        this.props.changeHandler(evt.target.checked);
    }

    render() {
        const strs = this.props.strings;

        return (
            <label className="quiz-learning-mode-trigger">
                <input
                    type="checkbox"
                    checked={this.props.checked}
                    onChange={this.handleChange} />
                {" "}
                {strs.trigger}
            </label>
        );
    }
}


class QuizLearningModeQADisplay extends Component {
    render() {
        const strs = this.props.strings;
        const questionKindTemplates = this.props.questionKindTemplates;

        var qa = [];
        this.props.questions.forEach((question, idx) => {
            const questionText = formatQuestion(
                question, questionKindTemplates);
            qa.push(<dt key={`q-${idx}`}>{questionText}</dt>);

            const correctAnswers = question.c.map(
                answerIndex => question.o[answerIndex]);
            const className = (correctAnswers.length > 1) ? "multiple" : "";
            correctAnswers.forEach((answer, answerIdx) => {
                qa.push(
                    <dd className={className} key={`q-${idx}-a-${answerIdx}`}>
                        {answer}
                    </dd>
                );
            });
        });

        return (
            <div className="quiz-learning-mode-qa-display">
                <dl className="qa">{qa}</dl>
                <div className="btn-wrapper">
                    <button
                        className="btn finish-learning"
                        onClick={this.props.learningHandler}>
                        {strs.finishLearning}
                    </button>
                </div>
            </div>
        );
    }
}


export default class Quiz extends Component {
    constructor(props) {
        super(props);
        this.learningModePersister = new PersistenceManager({
            factory: () => window.localStorage,
            key: "learningMode",
            default: false
        });
        this.state = {
            questionIndex: -1, correctCount: 0,
            learningMode: this.learningModePersister.get(),
            didLearn: false};
        this.questions = null;
        this.startQuiz = this.startQuiz.bind(this);
        this.handleLap = this.handleLap.bind(this);
        this.handleLearningMode = this.handleLearningMode.bind(this);
        this.handleLearning = this.handleLearning.bind(this);
    }

    startQuiz(evt) {
        this.setState({questionIndex: 0, correctCount: 0, didLearn: false});
        this.questions = Random.sample(
            this.props.questions, this.props.askCount);
    }

    handleLap(data) {
        this.setState(prevState => {
            var correctCount = prevState.correctCount;
            if (data.correct) {
                correctCount++;
            }
            return {
                questionIndex: prevState.questionIndex + 1,
                correctCount: correctCount
            };
        });
    }

    handleLearningMode(checked) {
        this.setState({learningMode: checked});
        this.learningModePersister.set(checked);
    }

    handleLearning() {
        this.setState({didLearn: true});
    }

    render() {
        const strs = this.props.strings;

        const isOngoing = this.state.questionIndex >= 0;
        const isDone = this.state.questionIndex === this.props.askCount;
        const shouldLearn = this.state.learningMode && !this.state.didLearn;

        var inner;

        if (isOngoing && !isDone) {  // there is "current question"
            if (shouldLearn) {
                inner = (
                    <QuizLearningModeQADisplay
                        questions={this.questions}
                        learningHandler={this.handleLearning}
                        strings={strs.learningMode}
                        questionKindTemplates={strs.questionKindTemplates} />
                );
            } else {
                const question = this.questions[this.state.questionIndex];
                inner = (
                    <QuizLap
                        question={question} reporter={this.handleLap}
                        strings={strs.lap}
                        questionKindTemplates={strs.questionKindTemplates} />
                );
            }
        } else if (isDone) {  // no more questions left, quiz is finished
            const repl = {
                correct: this.state.correctCount, total: this.props.askCount};
            inner = (
                <div className="quiz-outro">
                    <p className="quiz-outro-description">
                        {format(strs.done, repl)}
                    </p>
                    <QuizLearningModeTrigger
                        checked={this.state.learningMode}
                        changeHandler={this.handleLearningMode}
                        strings={strs.learningMode} />
                    <div className="btn-wrapper">
                        <button
                            className="btn start"
                            onClick={this.startQuiz}>{strs.startAgain}</button>
                    </div>
                </div>
            );
        } else {  // have not started yet
            const repl = {total: this.props.askCount};
            inner = (
                <div className="quiz-intro">
                    <p className="quiz-intro-description">
                        {format(strs.description, repl)}
                    </p>
                    <QuizLearningModeTrigger
                        checked={this.state.learningMode}
                        changeHandler={this.handleLearningMode}
                        strings={strs.learningMode} />
                    <div className="btn-wrapper">
                        <button
                            className="btn start"
                            onClick={this.startQuiz}>{strs.start}</button>
                    </div>
                </div>
            );
        }
        return <div className="quiz">{inner}</div>;
    }
}
