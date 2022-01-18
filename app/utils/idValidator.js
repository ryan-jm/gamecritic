const idValidator = (id) => {
  if (typeof id !== 'string' && typeof id !== 'number') return false;
  return Boolean(parseInt(id));
};

module.exports = idValidator;
