const { dropAllTables, createAllTables, seedAllTables } = require('../utils');

const seed = async (data) => {
  try {
    await dropAllTables();
    await createAllTables();
    await seedAllTables(data);
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = seed;
