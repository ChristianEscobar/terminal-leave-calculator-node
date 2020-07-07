'use strict';

const Moment = require('moment');
const MomentRange = require('moment-range');

const moment = MomentRange.extendMoment(Moment);

/**
 * Calculates a retirement date based on the specified enlistment or commission date
 * @param {string} enlistOrCommissionDate - The enlistment or commission date
 * @returns {string} Retirement date
 * @throws Error
 */
const calculateRetirementDate = function calculateRetirementDate(
	enlistOrCommissionDate
) {
	try {
		const momentEnlistOrCommDate = moment(enlistOrCommissionDate, 'DD/MM/YYYY')
			.add(1, 'months')
			.startOf('month')
			.add(20, 'years');
		return momentEnlistOrCommDate.format('DD/MM/YYYY');
	} catch (error) {
		throw new Error(
			`Error encountered while attempting to calculate retirement date.\n${error}`
		);
	}
};
/**
 * Calculates the fiscal year the specified retirement date belongs to.
 * @param {string} retirementDate - The retirement date
 * @returns {string} Object.fiscalYeartStart - The fiscal year start date
 * @returns {string} Object.fiscalYearEnd - The fiscal year end date
 * @throws Error
 */
const getFiscalYear = function getFiscalYear(retirementDate) {
	try {
		const retirementMonth = moment(retirementDate, 'DD/MM/YYYY').month();
		let yearOffset = 0;

		// Months in momentjs are 0 based.  Handle cases when the
		// retirement falls on a month when the fiscal year changes
		if (retirementMonth >= 9 && retirementMonth <= 11) {
			yearOffset = 1;
		}

		const fiscalYearEnd = moment(retirementDate, 'DD/MM/YYYY')
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

/**
 * Calculates the number of months from the start of the fiscal year
 * to the specified retirement date
 * @param {string} retirementDate - The retirement date
 * @returns {number} The number of months since the fiscal year start
 * @throws Error
 */
const monthsIntoFiscalYear = function monthsIntoFiscalYear(retirementDate) {
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

/**
 * Calculates the mas standard days of leave
 * @param {string} retirementDate - The retirement date
 * @param {number} conusOconusDays - Leave days based on CONUS or OCONUS
 * @returns {number} The max standard days of leave
 * @throws Error
 */
const maxStandardDaysOfLeave = function maxStandardDaysOfLeave(
	retirementDate,
	conusOconusDays
) {
	try {
		//  60 days for fiscal year previous to retirement date (Fiscal year is Oct 1 – Sep 30th)
		let daysOfLeave = 60;

		const months = monthsIntoFiscalYear(retirementDate);
		const daysOfLeaveInFiscalYear = months * 2.5;

		return (daysOfLeave += daysOfLeaveInFiscalYear + conusOconusDays);
	} catch (error) {
		throw new Error(
			`Error encountered while calculating max days of leave.\n${error}`
		);
	}
};

/**
 * Calculates the earliest date when terminal PTDY can start
 * @param {string} retirementDate - The retirement date
 * @param {number} totalDaysOfLeave - The total number of leave days
 * @returns{string} The earliest terminal PTDY and leave date
 * @throws Error
 */
const startTerminalPTDY = function startTerminalPTDY(
	retirementDate,
	totalDaysOfLeave
) {
	try {
		const startTerminalPTDYDate = moment(retirementDate, 'DD/MM/YYYY').subtract(
			totalDaysOfLeave,
			'days'
		);
		return startTerminalPTDYDate.format('MM/DD/YYYY');
	} catch (error) {
		throw new Error(
			`Error encountered while calculating terminal PTDY date.\n${error}`
		);
	}
};

module.exports = {
	calculateRetirementDate,
	maxStandardDaysOfLeave,
	startTerminalPTDY,
};
