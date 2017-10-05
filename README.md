token-field
===========
A react-based components to display interactive input 

[![Build Status](https://travis-ci.org/deskpro/token-field.svg?branch=master)](https://travis-ci.org/deskpro/token-field)
[![Coverage Status](https://coveralls.io/repos/github/deskpro/token-field/badge.svg)](https://coveralls.io/github/deskpro/token-field)
![License](https://img.shields.io/badge/License-BSD%203--Clause-blue.svg)
[![npm version](https://img.shields.io/npm/v/@deskpro/token-field.svg?style=flat)](https://www.npmjs.com/package/@deskpro/token-field)

## Overview

A Storybook demo is available at https://deskpro.github.io/token-field.

## Installation

```javascript
npm install @deskpro/token-field --save
```

## Usage

Token-field provide a [few input types](docs/components/inputs.md)

### Props

**tokenTypes={Token[]}**

Pass all available tokens for users to use. These tokens will be offered will typing

```javascript
class Token(id, widget, props, description)
```

Token example

```javascript
new Token(
  'date',
  'DateTimeInput',
  {},
  'Date the ticket was submitted'
)
```

Or with extra props

```javascript
new Token(
  'attach-size',
  'NumericRangeInput',
  {
    unitPhrase:       'MB',
    convertFromValue: value => Math.round(value / 1024 / 1024),
    convertToValue:   value => value * 1024 * 1024,
  }
)
```

**value={object[]}**

Initial value of the field

Example value

```javascript
[
  {
    type:  'user-message',
    value: 'help upgrading'
  },
  {
    type:  'TEXT',
    value: 'pricing',
  },
  {
    type: 'user-waiting'
  }
]
``` 

**onChange={function}**

Callback to persist changes

## Styling

`src/styles/deskpro-components.scss` has to be imported if deskpro-components are not in used on your project