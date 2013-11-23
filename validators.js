exports.validatePeriod = function(from, to) {
  var errors = [],
      fromDate,
      toDate;

  if (!from) {
    errors.push('"From" was not passed');
  }
  if (!to) {
    errors.push('"To" was not passed');
  }

  if (from && to) {
    fromDate = new Date(from);
    toDate = new Date(to);
    if (fromDate >= toDate) {
      errors.push('"To" should be more than "from"');
    }
  }

  return {
    to: toDate,
    from: fromDate,
    errors: errors.join('. ')
  };
};
