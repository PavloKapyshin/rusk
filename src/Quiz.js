import React, { Component } from "react";
import Random from "./Random";
import Message from "./Message";
import format from "./Format";


class QuizLapOptions extends Component {
    render() {
        const options = this.props.question.o.map((optionText, idx) => {
            return (
                <li key={idx}>
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
            <ol>{options}</ol>
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
        return <button onClick={handler}>{text}</button>;
    }
}


class QuizLapMessage extends Component {
    render() {
        const message = this.props.message;
        if (!message) {
            return null;
        }
        const className = "message " + message.level;
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

    isCorrect(answerIndex) {
        return this.props.question.c.indexOf(answerIndex) >= 0;
    }

    reportAnswer(evt) {
        const answerIndex = this.state.answerIndex;
        this.props.reporter({
            index: answerIndex,
            correct: this.isCorrect(answerIndex)
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
        if (typeof answerIndex !== "number") {  /* no answer */
            verdict = Verdict.chooseSomething;
            checked = false;
        } else {
            checked = true;
            if (this.isCorrect(answerIndex)) {
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

        return (
            <div>
                <span>{question.t}</span>
                <QuizLapOptions
                    question={question} handler={this.handleAnswer}
                    checkedAnswerIndex={this.state.answerIndex} />
                <QuizLapSubmit
                    checked={this.state.checked} checkHandler={this.checkAnswer}
                    reportHandler={this.reportAnswer} strings={strs.submit} />
                <QuizLapMessage message={this.state.verdict(strs.messages)} />
            </div>
        );
    }
}


export default class Quiz extends Component {
    constructor(props) {
        super(props);
        this.state = {questionIndex: -1, correctCount: 0};
        this.questions = null;
        this.startQuiz = this.startQuiz.bind(this);
        this.handleLap = this.handleLap.bind(this);
    }

    startQuiz(evt) {
        this.setState({questionIndex: 0, correctCount: 0});
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

    render() {
        const strs = this.props.strings;

        const isOngoing = this.state.questionIndex >= 0;
        const isDone = this.state.questionIndex === this.props.askCount;

        if (isOngoing && !isDone) {  /* there is "current question" */
            const question = this.questions[this.state.questionIndex];
            return (
                <QuizLap
                    question={question} reporter={this.handleLap}
                    strings={strs.lap} />
            );
        } else if (isDone) {  /* no more questions left, quiz is finished */
            const repl = {
                correct: this.state.correctCount, total: this.props.askCount};
            return (
                <div>
                    <p>{format(strs.done, repl)}</p>
                    <button onClick={this.startQuiz}>{strs.startAgain}</button>
                </div>
            );
        } else {  /* have not started yet */
            return (
                <div>
                    <p>{strs.description}</p>
                    <button onClick={this.startQuiz}>{strs.start}</button>
                </div>
            );
        }
    }
}
