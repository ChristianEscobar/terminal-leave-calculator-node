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
  if (!enlistOrCommissionDate || enlistOrCommissionDate === '') {
    throw new Error('Enlistment or commission date must be specified.');
  }
  const retirementDateMoment = moment(enlistOrCommissionDate, 'MM/DD/YYYY')
    .add(1, 'months')
    .startOf('month')
    .add(20, 'years');
  const retirementDate = retirementDateMoment.isValid()
    ? retirementDateMoment.format('MM/DD/YYYY')
    : '';
  if (retirementDate === '') {
    throw new Error('Invalid enlistment or commission date specified.');
  }
  return retirementDate;
};

/**
 * Calculates the fiscal year the specified retirement date belongs to.
 * @param {string} retirementDate - The retirement date
 * @returns {string} Object.fiscalYeartStart - The fiscal year start date
 * @returns {string} Object.fiscalYearEnd - The fiscal year end date
 * @throws Error
 */
const getFiscalYear = function getFiscalYear(retirementDate) {
  if (!retirementDate || retirementDate === '') {
    throw new Error('Retirement date must be specified.');
  }

  const retirementDateMoment = moment(retirementDate, 'MM/DD/YYYY');
  if (!retirementDateMoment.isValid()) {
    throw new Error('Invalid retirement date specified.');
  }

  const retirementMonth = retirementDateMoment.month();
  let yearOffset = 0;

  // Months in momentjs are 0 based.  Handle cases when the
  // retirement falls on a month when the fiscal year changes
  if (retirementMonth >= 9 && retirementMonth <= 11) {
    yearOffset = 1;
  }

  const fiscalYearEndMoment = retirementDateMoment
    .clone()
    .add(yearOffset, 'year')
    .month('September')
    .endOf('month');

  const fiscalYearStartMoment = fiscalYearEndMoment
    .clone()
    .subtract(1, 'year')
    .month('October')
    .startOf('month');

  return {
    fiscalYeartStart: fiscalYearStartMoment.format('MM/DD/YYYY'),
    fiscalYearEnd: fiscalYearEndMoment.format('MM/DD/YYYY'),
  };
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
    if (!retirementDate || retirementDate === '') {
      throw new Error('Retirement date must be specified.');
    }

    const currentFiscalYear = getFiscalYear(retirementDate);

    const startMoment = moment(
      currentFiscalYear.fiscalYeartStart,
      'MM/DD/YYYY'
    );
    const endMoment = moment(retirementDate, 'MM/DD/YYYY');
    const range = moment.range(startMoment, endMoment);

    return range.diff('months');
  } catch (error) {
    throw new Error(error);
  }
};

/**
 * Calculates the max standard days of leave
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
    if (!retirementDate || retirementDate === '') {
      throw new Error('Retirement date must be specified.');
    }

    if (!conusOconusDays || conusOconusDays === '' || conusOconusDays < 0) {
      throw new Error('CONUS or OCONUS days must be specified.');
    }

    //  60 days for fiscal year previous to retirement date (Fiscal year is Oct 1 – Sep 30th)
    let daysOfLeave = 60;

    const months = monthsIntoFiscalYear(retirementDate);
    const daysOfLeaveInFiscalYear = months * 2.5;

    return (daysOfLeave += daysOfLeaveInFiscalYear + conusOconusDays);
  } catch (error) {
    throw new Error(error);
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
  if (!retirementDate || retirementDate === '') {
    throw new Error('Retirement date must be specified.');
  }

  if (!totalDaysOfLeave || totalDaysOfLeave < 0) {
    throw new Error('Total days of leave must be specified.');
  }

  const retirementDateMoment = moment(retirementDate, 'MM/DD/YYYY');
  if (!retirementDateMoment.isValid()) {
    throw new Error('Invalid retirement date specified.');
  }

  const startTerminalPTDYDate = retirementDateMoment
    .clone()
    .subtract(totalDaysOfLeave, 'days');
  return startTerminalPTDYDate.format('MM/DD/YYYY');
};

module.exports = {
  calculateRetirementDate,
  maxStandardDaysOfLeave,
  startTerminalPTDY,
};
