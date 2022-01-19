const db = require('../../db/connection');

const userValidator = async (input = '') => {
  if (typeof input !== 'string') return false;
  const { rows: users } = await db.query('SELECT * FROM users');

  for (const user of users) {
    if (input === user.username) return true;
  }

  return false;
};

module.exports = userValidator;
