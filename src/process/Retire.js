'use strict';

const inquirer = require('inquirer');
const moment = require('moment');

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

const calculateRetirementDate = function calculateRetirementDate(
	enlistOrCommissionDate
) {
	try {
		const momentEnlistOrCommDate = moment(enlistOrCommissionDate, 'DD/MM/YYYY');
		momentEnlistOrCommDate.add(1, 'months').startOf('month').add(20, 'years');
		return momentEnlistOrCommDate.format('DD/MM/YYYY');
	} catch (error) {
		throw new Error(
			`Error encountered while attempting to calculate retirement date.\n${error}`
		);
	}
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

const enterRetirementDate = {
	type: 'input',
	name: 'retirementDate',
	message: 'Enter date (01/MM/YYYY)',
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

const promptUser = async function promptUser() {
	const userInput = {
		retirementDate: '',
		conusOrOcunus: '',
		daysOfLeave: 0,
	};

	const retirementDateChoice = await inquirer.prompt(planToRetire);

	const { planToRetire: dateSource } = retirementDateChoice;
	if (dateSource === retirementDateChoices[0]) {
		const retirementDateInput = await inquirer.prompt(enterRetirementDate);
		userInput.retirementDate = retirementDateInput.retirementDate;
	} else if (dateSource === retirementDateChoices[1]) {
		// Calculate 20 years
		const enlistOrCommissionDateInput = await inquirer.prompt(
			enterEnlistmentOrCommissionDate
		);
		const { enlistOrCommissionDate } = enlistOrCommissionDateInput;
		userInput.retirementDate = calculateRetirementDate(enlistOrCommissionDate);
	} else {
		throw new Error(`Unhandled planToRetire encountered ${planToRetire}`);
	}

	console.log(userInput);
};

class Retire {
	constructor() {
		this.situation = 'I plan to retire';
		this.plannedRetirementDate = '';
		this.CONUS = false;
		this.OCUNUS = false;
		this.daysOfLeave = 0;
	}

	async run() {
		const userInput = await promptUser();
	}
}

module.exports = {
	Retire,
};
