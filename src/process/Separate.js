'use strict';
const inquirer = require('inquirer');
const { validateDate } = require('../helpers/validators');

const enterSeparationDate = {
  type: 'input',
  name: 'separationDate',
  message: 'When do you plan to separate?\nEnter date (MM/DD/YYYY):',
  validate: validateDate,
};

const promptUser = async function promptUser() {
  const userInput = {};

  const { separationDate } = await inquirer.prompt(enterSeparationDate);
  userInput.separationDate = separationDate;

  return userInput;
};

class Separate {
  constructor() {
    this.situation = 'I plan to separate';
    this.userInput = {};
  }

  async run() {
    this.userInput = await promptUser();

    console.log(this.userInput);
  }
}

module.exports = { Separate };
