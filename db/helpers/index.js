const db = require('../connection');

exports.createAllTables = async () => {
  try {
    await createCategories();
    await createUsers();
    await createReviews();
    await createComments();
  } catch (err) {}
};

const createCategories = async () => {
  try {
    const res = await db.query(
      'CREATE TABLE categories (slug VARCHAR(255) PRIMARY KEY NOT NULL, description TEXT NOT NULL);'
    );
    return res;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const createUsers = async () => {
  try {
    const res = await db.query(
      'CREATE TABLE users (username VARCHAR(50) PRIMARY KEY NOT NULL, avatar_url VARCHAR(80) NOT NULL, name VARCHAR(50) NOT NULL);'
    );
    return res;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const createReviews = async () => {
  try {
    const res = await db.query(
      `CREATE TABLE reviews (
        review_id SERIAL PRIMARY KEY, 
        title VARCHAR(80) NOT NULL, 
        review_body TEXT NOT NULL, 
        designer VARCHAR(50) NOT NULL, 
        review_img_url VARCHAR(255) DEFAULT 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg',
        votes INT DEFAULT 0,
        category VARCHAR(255) REFERENCES categories(slug) NOT NULL,
        owner VARCHAR(50) REFERENCES users(username) NOT NULL, 
        created_at TIMESTAMP NOT NULL
        );`
    );
    return res;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const createComments = async () => {
  try {
    const res = await db.query(
      `CREATE TABLE comments (
        comment_id SERIAL PRIMARY KEY,
        author VARCHAR(50) REFERENCES users(username) NOT NULL,
        review_id INT REFERENCES reviews(review_id) NOT NULL,
        votes INT DEFAULT 0,
        created_at TIMESTAMP NOT NULL,
        body TEXT NOT NULL
        );`
    );
    return res;
  } catch (err) {
    console.log(err);
    return err;
  }
};
