# comment-for-translation

![Check & Test](https://github.com/atachibana/comment-for-translation/actions/workflows/test.yml/badge.svg)

## Description

This program aids translator (of program documents, mainly) by duplicating the contents and making them to comments. For example, original texts:

```
# Code Contributions
A guide on how to get started contributing code to the Gutenberg project.
```

will be processed as:

```
<!--
# Code Contributions
-->
# Code Contributions

<!--
A guide on how to get started contributing code to the Gutenberg project.
-->
A guide on how to get started contributing code to the Gutenberg project.
```

Then, translator can translate the contents.

```
<!--
# Code Contributions
-->
# コードでのコントリビューション

<!--
A guide on how to get started contributing code to the Gutenberg project.
-->
このガイドでは、Gutenberg プロジェクトにコードでコントリビュートする方法を説明します。
```

This method is easy to track the change of original texts because you can still use `diff` comand to identify the original text changes. 

## Usage

```bash
$ git clone git@github.com:atachibana/comment-for-translation.git
$ cd comment-for-translation
$ node cli.js <markdown-file>
```

## Parameter
- `<markdown-file>` target markdown file. Processed file will be `filename-new.md`. For example, `test1.md` will be `test1-new.md`.

## Options
- `o, --output-dir` <output-dir> Specify the directory to save files (default `./`)

## Development

```bash
% git clone git@github.com:atachibana/comment-for-translation.git
% cd comment-for-translation

(option: when you do not have node environment)
% docker compose up -d
% docker compose exec cli sh

% npm install
% npm test
```
