const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../app');

const request = require('supertest');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('API Endpoints', () => {
  describe('GET: /api/ - Health Check', () => {
    it('should respond with a 200 status code', () => {
      return request(app).get('/api/').expect(200);
    });

    it('should respond with an "API Healthy" message', async () => {
      const res = await request(app).get('/api/').expect(200);
      expect(res.body.message).toBe('API Healthy');
    });
  });

  describe('Categories routes', () => {
    describe('GET: /api/categories/ - Get all categories', () => {
      it('should respond with a 200 status code', () => {
        return request(app).get('/api/categories').expect(200);
      });

      it('should return an array of categories with the length of 4', async () => {
        const res = await request(app).get('/api/categories').expect(200);
        expect(res.body.categories).toBeInstanceOf(Array);
        expect(res.body.categories).toHaveLength(4);
      });

      it('the returned array should consist of category entries with a slug and description property', async () => {
        const res = await request(app).get('/api/categories').expect(200);
        res.body.categories.forEach((category) => {
          expect(category).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
    });
  });
});
