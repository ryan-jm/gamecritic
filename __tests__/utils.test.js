const { idValidator } = require('../app/utils');

describe('App Utils', () => {
  describe('#idValidator', () => {
    it('should return a boolean', () => {
      const output = idValidator(1);
      expect(output.constructor).toBe(Boolean);
    });

    it('pass: when passed a number - or a string which can be coerced to a number, return true', () => {
      const withInt = idValidator(1);
      const withString = idValidator('1');
      expect(withInt).toBe(true);
      expect(withString).toBe(true);
    });

    it('fail: when passed not a number, or an uncoercable data type, return false', () => {
      const withArray = idValidator(['1', 2, false]);
      const withObject = idValidator({ shouldReturn: false });
      const withNaN = idValidator(NaN);

      expect(withArray).toBe(false);
      expect(withObject).toBe(false);
      expect(withNaN).toBe(false);
    });
  });
});
