const { dropAllTables, createAllTables, seedAllTables } = require('../helpers');

const seed = async (data) => {
  try {
    await dropAllTables();
    await createAllTables();
    await seedAllTables(data);
  } catch (err) {
    console.log(err);
  }
};

module.exports = seed;
