const {
  throwStatusError,
  throwCodeError,
  throwInternalError,
} = require('./errors');

exports.errorHandler = (err, req, res, next) => {
  if (err.status) throwStatusError(err, res);
  else if (err.code) throwCodeError(err, res);
  else throwInternalError(err, res);
};
