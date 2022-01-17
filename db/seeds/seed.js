const db = require('../connection');
const { createAllTables } = require('../helpers');

const seed = async (data) => {
  try {
    await createAllTables();
  } catch (err) {
    console.log(err);
  }
};

module.exports = seed;
