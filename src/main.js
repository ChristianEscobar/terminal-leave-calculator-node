'use strict';

const inquirer = require('inquirer');
const { Retire } = require('./process/Retire');
const { Separate } = require('./process/Separate');

const choices = [
  'I plan to retire',
  'I plan to separate',
  'I am being honorably involuntarily separated',
];

const start = async function start() {
  const questions = [
    {
      type: 'list',
      name: 'situation',
      message: 'What is your situation?',
      choices,
      default: false,
    },
  ];

  const userInput = await inquirer.prompt(questions);
  const { situation } = userInput;
  if (situation === choices[0]) {
    new Retire().run();
  } else if (situation === choices[1]) {
    new Separate().run();
  } else if (situation === choices[2]) {
    console.log('Honorably involuntarily separated');
  } else {
    throw new Error(`Unhandled situation selection encountered ${situation}`);
  }
};

module.exports = { start };
