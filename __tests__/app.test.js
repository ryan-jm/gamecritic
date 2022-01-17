const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../app');
const NCGamesAPI = require('../app/info');

const request = require('supertest');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('API Endpoints', () => {
  describe('GET: /api/ - Health Check', () => {
    it('should respond with a 200 status code', () => {
      return request(app).get('/api/').expect(200);
    });

    it('should respond with all the valid endpoints', async () => {
      const res = await request(app).get('/api/').expect(200);
      expect(res.body.NCGamesAPI).toEqual(NCGamesAPI);
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

  describe('Reviews routes', () => {
    const reviewSchema = {
      owner: expect.any(String),
      title: expect.any(String),
      review_id: expect.any(Number),
      review_body: expect.any(String),
      designer: expect.any(String),
      review_img_url: expect.any(String),
      category: expect.any(String),
      created_at: expect.any(String),
      votes: expect.any(Number),
      comment_count: expect.any(String),
    };

    describe('GET: /api/reviews - Get all reviews', () => {
      it('should respond with a 200 status code', () => {
        return request(app).get('/api/reviews').expect(200);
      });

      it('should respond with an array of review entries which follow the review schema', async () => {
        const res = await request(app).get('/api/reviews/').expect(200);
        const {
          body: { reviews },
        } = res;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(13);
        reviews.forEach((review) =>
          expect(review).toEqual(expect.objectContaining(reviewSchema))
        );
      });

      it('without queries, it should respond with the reviews sorted by date and in descending order', async () => {
        const res = await request(app).get('/api/reviews').expect(200);
        const {
          body: { reviews },
        } = res;
        expect(reviews).toBeSortedBy('created_at', {
          descending: true,
          coerce: true,
          strict: true,
        });
      });

      it('queries: works with "sort_by" queries', async () => {
        const {
          body: { reviews: byReviewId },
        } = await request(app)
          .get('/api/reviews?sort_by=review_id')
          .expect(200);

        const {
          body: { reviews: byVotes },
        } = await request(app).get('/api/reviews?sort_by=votes').expect(200);

        const {
          body: { reviews: byTitle },
        } = await request(app).get('/api/reviews?sort_by=title').expect(200);

        expect(byReviewId).toBeSortedBy('review_id', {
          descending: true,
          coerce: true,
          strict: true,
        });

        expect(byVotes).toBeSortedBy('votes', {
          descending: true,
          coerce: true,
          strict: true,
        });

        expect(byTitle).toBeSortedBy('title', {
          descending: true,
          strict: true,
        });
      });

      it('queries: works with "order" queries (asc or desc)', async () => {
        const {
          body: { reviews: reviewsAscending },
        } = await request(app)
          .get('/api/reviews?sort_by=votes&order=asc')
          .expect(200);
        const {
          body: { reviews: reviewsDescending },
        } = await request(app)
          .get('/api/reviews?sort_by=votes&order=desc')
          .expect(200);
        expect(reviewsAscending).toBeSortedBy('votes', {
          coerce: true,
          strict: true,
        });
        expect(reviewsDescending).toBeSortedBy('votes', {
          descending: true,
          coerce: true,
          strict: true,
        });
      });

      it('queries: works with "category" queries to filter by category', async () => {
        const {
          body: { reviews: dexterityOnly },
        } = await request(app)
          .get('/api/reviews?category=dexterity')
          .expect(200);
        const {
          body: { reviews: socialDeductionOnly },
        } = await request(app)
          .get('/api/reviews?category=social deduction')
          .expect(200);

        dexterityOnly.forEach((dexReviews) =>
          expect(dexReviews.category).toBe('dexterity')
        );
        socialDeductionOnly.forEach((sdReviews) =>
          expect(sdReviews.category).toBe('social deduction')
        );
      });

      it('error: if no reviews are found (due to a query or filter), a 404 response is given', async () => {
        const {
          body: { message },
        } = await request(app).get('/api/reviews?category=test').expect(404);
        expect(message).toBe('No reviews found');
      });

      it('error: responds with a 400 bad request if sort_by category does not exist', async () => {
        const {
          body: { message },
        } = await request(app).get('/api/reviews?sort_by=cheese').expect(400);
        expect(message).toBe('Bad Request');
      });
    });

    describe('GET: /api/reviews/:id - Get review by ID', () => {
      it('should respond with a 200 status code', () => {
        return request(app).get('/api/reviews/3').expect(200);
      });

      it('should respond with a "review" object containing the values of the requested review', async () => {
        const res = await request(app).get('/api/reviews/3').expect(200);
        const {
          body: { review },
        } = res;
        expect(review).toBeInstanceOf(Object);
        expect(review).toEqual(expect.objectContaining(reviewSchema));
      });

      it('error: should respond with a 404 not found response if no review entry can be found', async () => {
        const res = await request(app).get('/api/reviews/100').expect(404);
        expect(res.body.message).toBe('No review found');
      });

      it('error: should respond with a 400 invalid request response if id given is not a number', async () => {
        const res = await request(app).get('/api/reviews/test').expect(400);
        expect(res.body.message).toBe('Invalid ID provided');
      });
    });

    describe('PATCH: /api/reviews/:id - Patch a review by ID', () => {
      it('should respond with a 200 status code if successful', () => {
        return request(app)
          .patch('/api/reviews/3')
          .send({ inc_votes: 10 })
          .expect(200);
      });

      delete reviewSchema.comment_count;

      it('positives integers: should respond with the updated review entry', async () => {
        const {
          body: { review },
        } = await request(app)
          .patch('/api/reviews/3')
          .send({ inc_votes: 10 })
          .expect(200);

        expect(review.votes).toBe(15);
        expect(review).toEqual(expect.objectContaining(reviewSchema));
      });

      it('negative integers: should respond with the updated review entry', async () => {
        const {
          body: { review },
        } = await request(app)
          .patch('/api/reviews/3')
          .send({ inc_votes: -4 })
          .expect(200);

        expect(review.votes).toBe(1);
        expect(review).toEqual(expect.objectContaining(reviewSchema));
      });

      it('error: should respond with a 404 not found response if no review entry can be found', async () => {
        const res = await request(app)
          .patch('/api/reviews/555')
          .send({ inc_votes: 1 })
          .expect(404);
        expect(res.body.message).toBe('No review found');
      });

      it('error: should respond with a 400 bad request if the id or the inc_votes value is not an integer', async () => {
        const invalidID = await request(app)
          .patch('/api/reviews/test')
          .send({ inc_votes: 1 })
          .expect(400);
        const invalidIncVotes = await request(app)
          .patch('/api/reviews/3')
          .send({ inc_votes: 'Test' })
          .expect(400);

        expect(invalidID.body.message).toBe(
          'Invalid ID or inc_votes value provided'
        );
        expect(invalidIncVotes.body.message).toBe(
          'Invalid ID or inc_votes value provided'
        );
      });
    });
  });
});
