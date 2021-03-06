# rusk
[![Build Status](https://travis-ci.org/PavloKapyshin/rusk.svg?branch=master)](https://travis-ci.org/PavloKapyshin/rusk)

`rusk` is a single-page quiz application made to help Russian-speaking people
learn Slovak language (and vice versa).


## Features
- uses React framework
- UI is in English or Russian, selected language is saved into `localStorage`
- even for multiple-answer questions, only one answer can be selected
- questions are random, previously answered ones may be asked again


## Preparation
```console
$ npm install
```


## Running tests
```console
$ npm test
```


## Getting coverage
Collect info and view report:

```console
$ npm test -- --coverage
```

View HTML report:

```console
$ sensible-browser coverage/lcov-report/index.html
```


## Running development server
Start server:

```console
$ npm start
```

View it in browser:

```console
$ sensible-browser http://127.0.0.1:3000
```


## Building for production
```console
$ npm run build
```


## Updating `react-scripts`
This project uses [`create-react-app`](https://github.com/facebookincubator/create-react-app),
which uses `react-scripts`.

1. Look at [changelog](https://github.com/facebookincubator/create-react-app/blob/master/CHANGELOG.md).
2. Look at versions in `package.json`.
3. If needed, follow migration instructions.


## Format of `src/questions.json`
`src/questions.json` contains list of question objects. Each question
object has three mandatory fields (and one optional):

```json
{"t": "mačka", "o": ["майка", "матч", "пирожок", "кошка"], "c": [3]}
```


### `t`
Text of question. Usually a word in Russian on Slovak, e.g. `"mačka"`.


### `o`
List of answers. Usually a list of words in Russian or Slovak, e.g.
`["майка", "матч", "пирожок", "кошка"]`.


### `c`
List of indexes of correct answers in `o` list, e.g. `[3]`.


### `k`
Kind of question. Currently only one kind (`"tr"`—translation) is
available, and it is default in case `k` is not specified for question
object.


## Linting questions
After adding questions it may be useful to check them with auxiliary
Python script:

```console
$ ./scripts/check-questions.py
```

If any error is detected, message and number of question (due to “one
question object per line” policy, it is also a line number) are printed
to `stderr`:

```
>= 1 correct index is required (14)
```
