const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

const getPreviousFiscalYear = function getPreviousFiscalYear(retirementDate) {
	try {
		const retirementMonth = moment(retirementDate, 'DD/MM/YYYY').month();
		let yearOffset = 0;

		if (retirementMonth >= 1 && retirementMonth <= 10) {
			yearOffset = 1;
		}

		const fiscalYearEnd = moment(retirementDate, 'DD/MM/YYYY')
			.clone()
			.subtract(yearOffset, 'year')
			.month('September')
			.endOf('month');

		const fiscalYearStart = moment(fiscalYearEnd, 'DD/MM/YYYY')
			.clone()
			.subtract(1, 'year')
			.month('October')
			.startOf('month');

		return {
			fiscalYeartStart: fiscalYearStart.format('MM/DD/YYYY'),
			fiscalYearEnd: fiscalYearEnd.format('MM/DD/YYYY'),
		};
	} catch (error) {
		throw new Error(
			`Error encountered while calculating previous fiscal year.\n${error}`
		);
	}
};

const getFiscalYear = function getFiscalYear(retirementDate) {
	try {
		const retirementMonth = moment(retirementDate, 'DD/MM/YYYY').month();
		let yearOffset = 0;

		if (retirementMonth >= 9 && retirementMonth <= 11) {
			yearOffset = 1;
		}

		const fiscalYearEnd = moment(retirementDate, 'DD/MM/YYYY')
			.clone()
			.add(yearOffset, 'year')
			.month('September')
			.endOf('month');

		const fiscalYearStart = moment(fiscalYearEnd, 'DD/MM/YYYY')
			.clone()
			.subtract(1, 'year')
			.month('October')
			.startOf('month');

		return {
			fiscalYeartStart: moment(fiscalYearStart).format('MM/DD/YYYY'),
			fiscalYearEnd: moment(fiscalYearEnd).format('MM/DD/YYYY'),
		};
	} catch (error) {
		throw new Error(
			`Error encountered while calculating fiscal year.\n${error}`
		);
	}
};

const monthsInFiscalYear = function monthsInFiscalYear(retirementDate) {
	try {
		const currentFiscalYear = getFiscalYear(retirementDate);

		const start = moment(currentFiscalYear.fiscalYeartStart, 'MM/DD/YYYY');
		const end = moment(retirementDate, 'DD/MM/YYYY');
		const range = moment.range(start, end);

		return range.diff('months');
	} catch (error) {
		throw new Error(
			`Error encountered while calculating months in range.\n${error}`
		);
	}
};

const maxStandardDaysOfLeave = function maxStandardDaysOfLeave(
	retirementDate,
	conusOconusDays
) {
	try {
		let daysOfLeave = 0;
		//  60 days for fiscal year previous to retirement date (Fiscal year is Oct 1 – Sep 30th)
		daysOfLeave += 60;
		const months = monthsInFiscalYear(retirementDate);
		const daysOfLeaveInFiscalYear = months * 2.5;

		return (daysOfLeave += daysOfLeaveInFiscalYear + conusOconusDays);
	} catch (error) {
		throw new Error(
			`Error encountered while calculating max days of leave.\n${error}`
		);
	}
};

const startTerminalPTDY = function startTerminalPTDY(userInput) {
	try {
		const startTerminalPTDYDate = moment(
			userInput.retirementDate,
			'DD/MM/YYYY'
		).subtract(userInput.daysOfLeave, 'days');
		return startTerminalPTDYDate.format('MM/DD/YYYY');
	} catch (error) {
		throw new Error(
			`Error encountered while calculating terminal PTDY date.\n${error}`
		);
	}
};

module.exports = {
	maxStandardDaysOfLeave,
	startTerminalPTDY,
};
