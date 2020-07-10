'use strict';

describe('calculations.js', () => {
  test('calculateRetirementDate - should return a date', () => {
    const { calculateRetirementDate } = require('../helpers/calculations');
    const enlistmentDate = '05/10/2010';
    const retirementDate = '06/01/2030';
    const result = calculateRetirementDate(enlistmentDate);
    expect(result).toEqual(retirementDate);
  });

  test('calculateRetirementDate - should throw error with invalid date', () => {
    const { calculateRetirementDate } = require('../helpers/calculations');
    const enlistmentDate = '13/05/2010';
    const errorMessage = 'Invalid enlistment or commission date specified.';

    expect(() => {
      calculateRetirementDate(enlistmentDate);
    }).toThrow(errorMessage);
  });

  test('calculateRetirementDate - should throw error with empty date', () => {
    const { calculateRetirementDate } = require('../helpers/calculations');
    const errorMessage = 'Enlistment or commission date must be specified.';

    expect(() => {
      calculateRetirementDate('');
    }).toThrow(errorMessage);
  });

  test('maxStandardDaysOfLeave - should calculate the max days of leave', () => {
    const { maxStandardDaysOfLeave } = require('../helpers/calculations');
    const CONUSDays = 20;
    const retirementDate = '06/01/2030';
    const result = maxStandardDaysOfLeave(retirementDate, CONUSDays);
    const expected = 100;

    expect(result).toEqual(expected);
  });

  test('maxStandardDaysOfLeave - should throw error with empty date', () => {
    const { maxStandardDaysOfLeave } = require('../helpers/calculations');
    const CONUSDays = 20;
    const retirementDate = '';
    const errorMessage = 'Retirement date must be specified.';

    expect(() => {
      maxStandardDaysOfLeave(retirementDate, CONUSDays);
    }).toThrow(errorMessage);
  });

  test('maxStandardDaysOfLeave - should throw error with empty days', () => {
    const { maxStandardDaysOfLeave } = require('../helpers/calculations');
    const CONUSDays = '';
    const retirementDate = '06/01/2030';
    const errorMessage = 'CONUS or OCONUS days must be specified.';

    expect(() => {
      maxStandardDaysOfLeave(retirementDate, CONUSDays);
    }).toThrow(errorMessage);
  });

  test('maxStandardDaysOfLeave - should throw error with invalid date', () => {
    const { maxStandardDaysOfLeave } = require('../helpers/calculations');
    const CONUSDays = 20;
    const retirementDate = '13/05/2030';
    const errorMessage = 'Error: Error: Invalid retirement date specified.';

    expect(() => {
      maxStandardDaysOfLeave(retirementDate, CONUSDays);
    }).toThrow(errorMessage);
  });
});
