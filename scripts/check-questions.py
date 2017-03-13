#!/usr/bin/env python3


import os
import sys
import json
import collections
import unicodedata


TEXT_FIELD = "t"
OPTIONS_FIELD = "o"
KIND_FIELD = "k"
CORRECT_FIELD = "c"
MANDATORY_FIELDS = {TEXT_FIELD, OPTIONS_FIELD, CORRECT_FIELD}


def norm(s):
    return unicodedata.normalize("NFD", s)


def error(message, *, n):
    raise ValueError(" ".join((message, "({})".format(n))))


def check(questions):
    text_occurences = collections.defaultdict(list)

    for n, question in enumerate(questions, start=1):
        # Contains mandatory fields.
        missing = MANDATORY_FIELDS - set(question.keys())
        if missing:
            error("missing {}".format(", ".join(missing)), n=n)

        text_occurences[norm(question[TEXT_FIELD])].append(n)

        # Kind, if present, is "tr".
        if KIND_FIELD in question and question[KIND_FIELD] != "tr":
            error("{} != tr".format(KIND_FIELD), n=n)

        # There are at least four options & they are unique.
        options = tuple(map(norm, question[OPTIONS_FIELD]))
        options_count = len(options)
        if len(set(options)) != options_count or options_count < 4:
            error(">= 4 unique options are required", n=n)

        # There is at least one correct index.
        correct = question[CORRECT_FIELD]
        if len(correct) < 1:
            error(">= 1 correct index is required", n=n)
        for index in correct:
            try:
                options[index]
            except IndexError:
                error("index {} is not adressable".format(index), n=n)

    # Text is not repeated.
    for text, ns in text_occurences.items():
        if len(ns) > 1:
            error(
                "t {} is repeated at {}".format(
                    text, ", ".join(map(str, ns[1:]))), n=ns[0])


def main():
    questions_path = os.path.normpath(
        os.path.join(
            os.path.dirname(__file__), "..", "src", "questions.json"))
    with open(questions_path, "r", encoding="utf-8") as file:
        questions = json.load(file)
    try:
        check(questions)
    except ValueError as e:
        print(e, file=sys.stderr)
        exit(1)


if __name__ == "__main__":
    main()
