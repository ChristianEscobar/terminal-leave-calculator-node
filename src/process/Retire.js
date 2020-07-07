'use strict';

const inquirer = require('inquirer');
const moment = require('moment');
const {
	calculateRetirementDate,
	maxStandardDaysOfLeave,
	startTerminalPTDY,
} = require('../helpers/calculations');

const validateFirstOfMonthDate = function validateFirstOfMonthDate(value) {
	const pass = value.match(/01\/\d{2}\/\d{4}/);
	if (pass) {
		return true;
	}

	return 'Retirement date must be the first day of the month';
};

const validateDate = function validateDate(value) {
	const pass = value.match(/\d{2}\/\d{2}\/\d{4}/);
	if (pass) {
		return true;
	}

	return 'Invalid date format';
};

const validateInputIsNumbersOnly = function validateInputIsNumbersOnly(value) {
	const pass = value.match(/\d+/);
	if (pass) {
		return true;
	}

	return 'Only numbers are allowed';
};

const retirementDateChoices = [
	'Enter date (01/MM/YYYY)',
	'Calculate 20 years in for me',
];

const planToRetire = {
	type: 'list',
	name: 'planToRetire',
	message: 'When do you plan to retire?',
	choices: retirementDateChoices,
};

const daysOfLeaveChoices = [
	'Enter number of days [xxx days]',
	'Calculate assuming the standard max for me',
];

const daysOfLeave = {
	type: 'list',
	name: 'daysOfLeave',
	message: 'How many days of leave do you plan to have built up?',
	choices: daysOfLeaveChoices,
};

const enterRetirementDate = {
	type: 'input',
	name: 'retirementDate',
	message: retirementDateChoices[0],
	validate: validateFirstOfMonthDate,
};

const enterEnlistmentOrCommissionDate = {
	type: 'input',
	name: 'enlistOrCommissionDate',
	message: 'Enter your enlistment or commissioning date (DD/MM/YYYY)',
	validate: validateDate,
};

const enterConusOrOconus = {
	type: 'list',
	name: 'conusOrOconus',
	message: 'At the time of retirement, will you be CONUS or OCONUS?',
	choices: ['CONUS', 'OCONUS'],
};

const enterDaysOfLeave = {
	type: 'input',
	name: 'daysOfLeaveInput',
	message: daysOfLeaveChoices[0],
	validate: validateInputIsNumbersOnly,
};

const promptUser = async function promptUser() {
	const userInput = {};

	const retirementDateChoice = await inquirer.prompt(planToRetire);

	const { planToRetire: dateSource } = retirementDateChoice;

	// Retirment Date
	if (dateSource === retirementDateChoices[0]) {
		const { retirementDate } = await inquirer.prompt(enterRetirementDate);
		userInput.retirementDate = retirementDate;
	} else if (dateSource === retirementDateChoices[1]) {
		// Calculate 20 years
		const { enlistOrCommissionDate } = await inquirer.prompt(
			enterEnlistmentOrCommissionDate
		);
		userInput.retirementDate = calculateRetirementDate(enlistOrCommissionDate);
	} else {
		throw new Error(
			`Unhandled planToRetire choice encountered ${planToRetire}`
		);
	}
	// End retirement Date

	// CONUS or OCONUS
	const { conusOrOconus } = await inquirer.prompt(enterConusOrOconus);
	userInput.CONUSorOCONUS = conusOrOconus;
	userInput.CONUSorOCONUSDays = conusOrOconus === 'CONUS' ? 20 : 30;
	// End CONUS or OCONUS

	// Days of leave
	const daysOfLeaveChoiceInput = await inquirer.prompt(daysOfLeave);
	if (daysOfLeaveChoiceInput.daysOfLeave === daysOfLeaveChoices[0]) {
		const { daysOfLeaveInput } = await inquirer.prompt(enterDaysOfLeave);
		userInput.daysOfLeave = daysOfLeaveInput;
	} else if (daysOfLeaveChoiceInput.daysOfLeave === daysOfLeaveChoices[1]) {
		userInput.daysOfLeave = maxStandardDaysOfLeave(
			userInput.retirementDate,
			userInput.CONUSorOCONUSDays
		);
	} else {
		throw new Error(`Unhandled daysOfLeave choice encountered ${planToRetire}`);
	}
	// End Days of leave

	console.log(userInput);
	console.log(
		startTerminalPTDY(userInput.retirementDate, userInput.daysOfLeave)
	);
};

class Retire {
	constructor() {
		this.situation = 'I plan to retire';
		this.plannedRetirementDate = '';
		this.CONUSorOCONUS = '';
		this.CONUSorOCONUSDays = 0;
		this.daysOfLeave = 0;
	}

	async run() {
		const userInput = await promptUser();
	}
}

module.exports = {
	Retire,
};
