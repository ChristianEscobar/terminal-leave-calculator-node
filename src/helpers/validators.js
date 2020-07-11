const moment = require('moment');

const validateDate = function validateDate(date) {
  const passRegEx = date.match(/\d{2}\/\d{2}\/\d{4}/);
  const isValidDate = moment(date, 'MM/DD/YYYY').isValid();
  if (passRegEx && isValidDate) {
    return true;
  }

  return 'Invalid date format or value';
};

module.exports = {
  validateDate,
};
