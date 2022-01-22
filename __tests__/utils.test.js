const validator = require('../app/utils');
const db = require('../db/connection');

afterAll(() => db.end());

describe('Validator Class', () => {
  describe('#idValidator', () => {
    it('should return a boolean', () => {
      const output = validator.idValidator(1);
      expect(output.constructor).toBe(Boolean);
    });

    it('pass: when passed a number - or a string which can be coerced to a number, return true', () => {
      const withInt = validator.idValidator(1);
      const withString = validator.idValidator('1');
      expect(withInt).toBe(true);
      expect(withString).toBe(true);
    });

    it('fail: when passed not a number, or an uncoercable data type, return false', () => {
      const withArray = validator.idValidator(['1', 2, false]);
      const withObject = validator.idValidator({ shouldReturn: false });
      const withNaN = validator.idValidator(NaN);

      expect(withArray).toBe(false);
      expect(withObject).toBe(false);
      expect(withNaN).toBe(false);
    });
  });

  describe('#reviewValidator', () => {
    it('should return a number indicating status code', async () => {
      const output = await validator.reviewValidator(1);
      expect(output.constructor).toBe(Number);
    });

    it('pass: less or equal to the total number of reviews in db, return a 200 to indicate OK', async () => {
      const output = await validator.reviewValidator(2);
      expect(output).toBe(200);
    });

    it('pass: can be coerced into a number and is less than the total number of reviews in db, return 200 to indicate OK', async () => {
      const withString = await validator.reviewValidator('3');
      expect(withString).toBe(200);
    });

    it('fail: greater than the total number of reviews in db, return 404 to indicate Not Found', async () => {
      const output = await validator.reviewValidator(1000);
      expect(output).toBe(404);
    });

    it('fail: can be coerced to a number, but is less than zero, return false', async () => {
      const withInt = await validator.reviewValidator(-1);
      const withString = await validator.reviewValidator('-1');

      expect(withInt).toBe(false);
      expect(withString).toBe(false);
    });

    it('fail: cannot be coerced to a number, return false', async () => {
      const withArray = await validator.reviewValidator([1, '4', false]);
      const withObject = await validator.reviewValidator({
        shouldReturn: false,
      });
      const withNaN = await validator.reviewValidator(NaN);

      expect(withArray).toBe(false);
      expect(withObject).toBe(false);
      expect(withNaN).toBe(false);
    });
  });

  describe('#commentValidator', () => {
    it('should return a number corresponding to status code conventions', async () => {
      const output = await validator.commentValidator(1);
      expect(output.constructor).toBe(Number);
    });

    it('pass: less or equal to the total number of comments in db, return 200 to indicate OK', async () => {
      const output = await validator.commentValidator(2);
      expect(output).toBe(200);
    });

    it('pass: can be coerced into a number and is less than the total number of comments in db, return 200', async () => {
      const withString = await validator.commentValidator('3');
      expect(withString).toBe(200);
    });

    it('fail: greater than the total number of comments in db, return 404 to indicate NOT FOUND', async () => {
      const output = await validator.commentValidator(1000);
      expect(output).toBe(404);
    });

    it('fail: can be coerced to a number, but is less than zero, return false', async () => {
      const withInt = await validator.commentValidator(-1);
      const withString = await validator.commentValidator('-1');

      expect(withInt).toBe(false);
      expect(withString).toBe(false);
    });

    it('fail: cannot be coerced to a number, return false', async () => {
      const withArray = await validator.commentValidator([1, '4', false]);
      const withObject = await validator.commentValidator({
        shouldReturn: false,
      });
      const withNaN = await validator.commentValidator(NaN);

      expect(withArray).toBe(false);
      expect(withObject).toBe(false);
      expect(withNaN).toBe(false);
    });
  });

  describe('#userValidator', () => {
    it('should return a numeric value corresponding to the status code', async () => {
      const isValid = await validator.userValidator('test');
      expect(isValid.constructor).toBe(Number);
    });

    it('pass: if the username exists in the db return 200 to indicate OK', async () => {
      const isValid = await validator.userValidator('bainesface');
      expect(isValid).toBe(200);
    });

    it('fail: should return a 404 if the user does not exist in the database', async () => {
      const isValid = await validator.userValidator('test');
      expect(isValid).toBe(404);
    });

    it('fail: returns false to indicate bad input if the input is not a string', async () => {
      const withNum = await validator.userValidator(1);
      const withArray = await validator.userValidator([1, 3, 'user please']);
      const withNaN = await validator.userValidator(NaN);

      expect(withNum).toBe(false);
      expect(withArray).toBe(false);
      expect(withNaN).toBe(false);
    });
  });

  describe('#categoryValidator', () => {
    it('should return a boolean', async () => {
      const output = await validator.categoryValidator(5);
      expect(output.constructor).toBe(Boolean);
    });

    it('pass: if the category exists in the database, return true', async () => {
      const output = await validator.categoryValidator('dexterity');
      expect(output).toBe(true);
    });

    it('fail: returns false if category does not exist in the database', async () => {
      const output = await validator.categoryValidator('testcategory');
      expect(output).toBe(false);
    });

    it('fail: if the input category is not a string, returns false', async () => {
      const withNum = await validator.categoryValidator(12345);
      const withArray = await validator.categoryValidator(['test', false, 3]);
      const withNull = await validator.categoryValidator(null);

      expect(withNum).toBe(false);
      expect(withArray).toBe(false);
      expect(withNull).toBe(false);
    });
  });
});
