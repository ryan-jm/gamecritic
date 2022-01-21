const { verifyCredentials } = require('../../models/auth');

exports.getAuthInfo = async (req, res, next) => {
  const instructions = {
    1: 'Send a POST request to this endpoint with the body containing your username and password credentials',
    '1 - Example POST Body': {
      username: 'test-user',
      password: 'password123',
    },
    2: 'If your credentials are valid, you will receive a response containing your JWT Auth Token.',
    3: "Set this token in your headers as the following key-value pair: 'token': 'example-jwt-token'",
    4: 'Now you can access all of the endpoints displayed on /api',
    Note: 'Want to test this out? Send a POST request to this endpoint with the example body above!',
  };
  return res.status(200).send({ instructions });
};

exports.postAuthInfo = async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const token = await verifyCredentials(username, password);
    return res.status(200).send({ token });
  } catch (err) {
    return next(err);
  }
};
