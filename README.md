# rusk
[![Build Status](https://travis-ci.org/PavloKapyshin/rusk.svg?branch=master)](https://travis-ci.org/PavloKapyshin/rusk)

`rusk` is a single-page application made to help Russian-speaking people
learn Slovak language. It can also be used by Slovaks to learn Russian :).


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
