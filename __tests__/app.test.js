const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../app');
const NCGamesAPI = require('../app/info');

const request = require('supertest');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('API Endpoints', () => {
  describe('GET: /api/ - Health Check / Endpoint Info', () => {
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
        const res = await request(app).get('/api/categories');
        expect(res.body.categories).toBeInstanceOf(Array);
        expect(res.body.categories).toHaveLength(4);
      });

      it('the returned array should consist of category entries with a slug and description property', async () => {
        const res = await request(app).get('/api/categories');
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
        const res = await request(app).get('/api/reviews/');
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

        expect(dexterityOnly).toHaveLength(1);
        dexterityOnly.forEach((dexReviews) =>
          expect(dexReviews.category).toBe('dexterity')
        );

        expect(socialDeductionOnly).toHaveLength(11);
        socialDeductionOnly.forEach((sdReviews) =>
          expect(sdReviews.category).toBe('social deduction')
        );
      });

      it('queries: category query is valid but has no reviews, respond with a 200 status code and empty array', async () => {
        const {
          body: { reviews },
        } = await request(app)
          .get("/api/reviews?category=children's games")
          .expect(200);

        expect(reviews.constructor).toBe(Array);
        expect(reviews).toHaveLength(0);
        expect(reviews).toEqual([]);
      });

      it('error: if the category query exists but the category is invalid in the db, respond with 404', async () => {
        const {
          body: { message },
        } = await request(app).get('/api/reviews?category=test').expect(404);
        expect(message).toBe('Category non-existent');
      });

      it('error: if the order query exists but is invalid, respond with a 400 bad request', async () => {
        const {
          body: { message },
        } = await request(app).get('/api/reviews?order=test').expect(400);
        expect(message).toBe('Invalid order query');
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
        const reviewThree = {
          title: 'Ultimate Werewolf',
          designer: 'Akihisa Okui',
          owner: 'bainesface',
          review_img_url:
            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
          category: 'social deduction',
          votes: 5,
        };

        const res = await request(app).get('/api/reviews/3');
        const {
          body: { review },
        } = res;
        expect(review).toBeInstanceOf(Object);
        expect(review).toEqual(expect.objectContaining(reviewSchema));
        expect(review.title).toBe(reviewThree.title);
        expect(review.owner).toBe(reviewThree.owner);
        expect(review.designer).toBe(reviewThree.designer);
        expect(review.review_img_url).toBe(reviewThree.review_img_url);
        expect(review.category).toBe(reviewThree.category);
        expect(review.votes).toBe(reviewThree.votes);
      });

      it('error: should respond with a 404 not found if no review entry can be found', async () => {
        const res = await request(app).get('/api/reviews/100').expect(404);
        expect(res.body.message).toBe('No review found');
      });

      it('error: should respond with a 400 invalid request response if id given is not a number', async () => {
        const res = await request(app).get('/api/reviews/test').expect(400);
        expect(res.body.message).toBe('Invalid ID provided');
      });
    });

    describe('PATCH: /api/reviews/:id - Patch a review by ID', () => {
      const patchSchema = {
        owner: expect.any(String),
        title: expect.any(String),
        review_id: expect.any(Number),
        designer: expect.any(String),
        review_img_url: expect.any(String),
        category: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
      };

      it('should respond with a 200 status code if successful', () => {
        return request(app)
          .patch('/api/reviews/3')
          .send({ inc_votes: 10 })
          .expect(200);
      });

      it('positives integers: should respond with the updated review entry', async () => {
        const patchedReview = {
          title: 'Ultimate Werewolf',
          designer: 'Akihisa Okui',
          owner: 'bainesface',
          review_img_url:
            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
          category: 'social deduction',
          votes: 15,
        };

        const {
          body: { review },
        } = await request(app)
          .patch('/api/reviews/3')
          .send({ inc_votes: 10 })
          .expect(200);

        expect(review.votes).toBe(patchedReview.votes);
        expect(review.title).toBe(patchedReview.title);
        expect(review.owner).toBe(patchedReview.owner);
        expect(review.review_img_url).toBe(patchedReview.review_img_url);
        expect(review.category).toBe(patchedReview.category);
        expect(review).toEqual(expect.objectContaining(patchSchema));
      });

      it('negative integers: should respond with the updated review entry', async () => {
        const {
          body: { review },
        } = await request(app)
          .patch('/api/reviews/3')
          .send({ inc_votes: -4 })
          .expect(200);

        expect(review.votes).toBe(1);
        expect(review).toEqual(expect.objectContaining(patchSchema));
      });

      it('when inc_votes has no value, return a 200 status code and the unchanged review entry', async () => {
        const reviewFour = {
          title: 'Dolor reprehenderit',
          designer: 'Gamey McGameface',
          owner: 'mallionaire',
          review_img_url:
            'https://images.pexels.com/photos/278918/pexels-photo-278918.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
          category: 'social deduction',
          votes: 7,
        };

        const {
          body: { review },
        } = await request(app).patch('/api/reviews/4').send({}).expect(200);

        expect(review).toEqual(expect.objectContaining(patchSchema));
        expect(review.title).toBe(reviewFour.title);
        expect(review.designer).toBe(reviewFour.designer);
        expect(review.owner).toBe(reviewFour.owner);
        expect(review.review_img_url).toBe(reviewFour.review_img_url);
        expect(review.votes).toBe(reviewFour.votes);
        expect(review.category).toBe(reviewFour.category);
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

        expect(invalidID.body.message).toBe('Invalid review_id provided');
        expect(invalidIncVotes.body.message).toBe(
          'Invalid inc_vote value provided'
        );
      });
    });

    describe('GET: /api/reviews/:id/comments - Get all comments associated with a review', () => {
      const commentSchema = {
        comment_id: expect.any(Number),
        body: expect.any(String),
        author: expect.any(String),
        review_id: expect.any(Number),
        created_at: expect.any(String),
      };

      it('should respond with a 200 status code if successful', () => {
        return request(app).get('/api/reviews/3/comments').expect(200);
      });

      it('should respond with an array of comments following the comment schema', async () => {
        const {
          body: { comments },
        } = await request(app).get('/api/reviews/3/comments');

        expect(comments).toBeInstanceOf(Array);
        comments.forEach((comment) =>
          expect(comment).toEqual(expect.objectContaining(commentSchema))
        );
      });

      it('error: should return a 400 bad request error if the review id is invalid / not integer', async () => {
        const {
          body: { message },
        } = await request(app).get('/api/reviews/test/comments').expect(400);
        expect(message).toBe('Invalid review id');
      });

      it('error: should return a 404 not found if the review id is valid but no comments are available on that review', async () => {
        const {
          body: { message },
        } = await request(app).get('/api/reviews/20/comments').expect(404);
        expect(message).toBe('No comments found');
      });
    });

    describe('POST: /api/reviews/:id/comments - Post a comment to a review', () => {
      const commentSchema = {
        comment_id: expect.any(Number),
        body: expect.any(String),
        author: expect.any(String),
        review_id: expect.any(Number),
        created_at: expect.any(String),
      };

      it('should respond with a 201 status code if successful', () => {
        return request(app)
          .post('/api/reviews/3/comments')
          .send({
            username: 'bainesface',
            body: 'Test comment',
          })
          .expect(201);
      });

      it('should respond with the newly posted comment entry following the comment schema', async () => {
        const {
          body: { comment },
        } = await request(app).post('/api/reviews/3/comments').send({
          username: 'bainesface',
          body: 'Look! Another test comment!',
        });
        expect(comment).toEqual(expect.objectContaining(commentSchema));
      });

      it('error: should return a 400 bad request if the username or body of the request is missing', async () => {
        const {
          body: { message: noUsername },
        } = await request(app)
          .post('/api/reviews/3/comments')
          .send({
            body: 'Uh oh! This wont work!',
          })
          .expect(400);
        const {
          body: { message: noRequestBody },
        } = await request(app)
          .post('/api/reviews/3/comments')
          .send({
            username: 'bainesface',
          })
          .expect(400);

        expect(noUsername).toBe('Invalid username or comment body');
        expect(noRequestBody).toBe('Invalid username or comment body');
      });

      it('error: should return a 400 bad request if the review id is invalid', async () => {
        const {
          body: { message },
        } = await request(app)
          .post('/api/reviews/test/comments')
          .send({
            username: 'bainesface',
            body: 'That review ID doesnt seem right to me!',
          })
          .expect(400);

        expect(message).toBe('Invalid review id');
      });

      it('error: in cases that everything seems valid but the comment isnt posted, return a 404 response', async () => {
        const {
          body: { message },
        } = await request(app)
          .post('/api/reviews/999/comments')
          .send({
            username: 'bainesface',
            body: 'Looks like there is no review with the ID of 999',
          })
          .expect(400);

        expect(message).toBe('Bad Request');
      });
    });
  });

  describe('Comments routes', () => {
    describe('DELETE: /api/comments/:id - delete the corresponding comment', () => {
      it('should return a 204 status code with no content if successful', () => {
        return request(app).delete('/api/comments/2').expect(204);
      });

      it('error: should return a 400 bad request if the comment id is invalid', async () => {
        const {
          body: { message },
        } = await request(app).delete('/api/comments/test').expect(400);
        expect(message).toBe('Invalid comment id');
      });
    });
  });
});
