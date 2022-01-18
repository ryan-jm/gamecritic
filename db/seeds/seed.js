const { dropAllTables, createAllTables, seedAllTables } = require('../utils');

const seed = async (data) => {
  try {
    await dropAllTables();
    await createAllTables();
    await seedAllTables(data);
  } catch (err) {
    console.log(err); // Will remove this when hosted.
    throw new Error(err);
  }
};

module.exports = seed;
