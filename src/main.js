const inquirer = require('inquirer');

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
		console.log('Retire chosen');
	} else if (situation === choices[1]) {
		console.log('Separate');
	} else if (situation === choices[2]) {
		console.log('Honorably involuntarily separated');
	} else {
		throw new Error(`Unhandled choice encountered ${situation}`);
	}
};

module.exports = { start };
