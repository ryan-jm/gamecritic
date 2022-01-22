const db = require('../../db/connection');

class Validator {
  constructor(db) {
    this.db = db;
  }

  idValidator(id) {
    if (typeof id !== 'string' && typeof id !== 'number') return false;
    return Boolean(parseInt(id));
  }

  async reviewValidator(id) {
    /* Check that the review_id is valid within the database */
    try {
      if (!this.idValidator(id)) return false;
      else {
        id = parseInt(id);
        if (id < 0) return false;
        const { rows: reviews } = await this.db.query(
          `SELECT review_id FROM reviews;`
        );
        return id <= reviews.length ? 200 : 404;
      }
    } catch (err) {
      return false;
    }
  }

  async userValidator(username) {
    if (typeof username !== 'string') return false;

    const coercable = this.idValidator(username);
    if (coercable) return false;

    try {
      const { rows: users } = await this.db.query(
        `SELECT username FROM users;`
      );
      if (users) {
        for (const user of users) {
          if (username === user.username) return 200;
        }
      }
    } catch (err) {
      return false;
    }

    return 404;
  }

  async commentValidator(id) {
    /* Check that the comment_id is valid within the database */

    try {
      if (!this.idValidator(id)) return false;
      else {
        id = parseInt(id);
        if (id < 0) return false;
        /* Will turn this into an endpoint using MVC pattern at some point */
        const { rows: comments } = await db.query(`SELECT * FROM comments;`);
        return id <= comments.length ? 200 : 404;
      }
    } catch (err) {
      return false;
    }
  }

  async categoryValidator(input) {
    if (typeof input !== 'string' || !input) return false;
    try {
      const { rows: categories } = await db.query('SELECT * FROM categories;');
      for await (const category of categories) {
        if (input === category.slug) return true;
      }
    } catch (err) {
      return false;
    }
    return false;
  }
}

module.exports = new Validator(db);
