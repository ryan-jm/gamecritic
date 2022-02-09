exports.throwStatusError = (err, res) => {
  const { status, message } = err;
  return res.status(status).send({ message });
};

exports.throwCodeError = (err, res) => {
  const { code } = err;
  switch (code) {
    case 'P2202':
    case 'P2203':
      return res.status(400).send({ message: 'Invalid Input' });
    default:
      return res.status(400).send({ message: 'Bad Request' });
  }
};

exports.throwInternalError = (err, res) => {
  console.log(err);
  return res.status(500).send({ message: 'Internal Server Error' });
};
