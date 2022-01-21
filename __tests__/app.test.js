require('dotenv').config({
  path: `${__dirname}/../.env.test`,
});

const db = require('../db/connection.js');
const testData = require('../db/data/test-data/index.js');
const seed = require('../db/seeds/seed.js');
const app = require('../app');
const NCGamesAPI = require('../app/endpoints.json');
const supertest = require('supertest');
const defaults = require('superagent-defaults');

const request = defaults(supertest(app));
const testToken = process.env.TEST_TOKEN;

request.set('token', testToken); // Set authorization token before tests.

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe('\nAPI Endpoints', () => {
  describe('GET: /api/ - Health Check / Endpoint Info', () => {
    it('should respond with a 200 status code', () => {
      return request.get('/api').expect(200);
    });

    it('should respond with all the valid endpoints', async () => {
      const res = await request.get('/api').expect(200);
      expect(res.body.NCGamesAPI).toEqual(NCGamesAPI);
    });
  });

  describe('Categories routes', () => {
    describe('GET: /api/categories/ - Get all categories', () => {
      it('should respond with a 200 status code', () => {
        return request.get('/api/categories').expect(200);
      });

      it('should return an array of categories with the length of 4', async () => {
        const res = await request.get('/api/categories');
        expect(res.body.categories).toBeInstanceOf(Array);
        expect(res.body.categories).toHaveLength(4);
      });

      it('the returned array should consist of category entries with a slug and description property', async () => {
        const res = await request.get('/api/categories');
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
        return request.get('/api/reviews').expect(200);
      });

      it('should respond with an array of review entries which follow the review schema', async () => {
        const res = await request.get('/api/reviews/');
        const {
          body: { reviews },
        } = res;
        expect(reviews).toBeInstanceOf(Array);
        expect(reviews).toHaveLength(10);
        reviews.forEach((review) =>
          expect(review).toEqual(expect.objectContaining(reviewSchema))
        );
      });

      it('without queries, it should respond with the reviews sorted by date and in descending order', async () => {
        const res = await request.get('/api/reviews').expect(200);
        const {
          body: { reviews },
        } = res;
        expect(reviews).toBeSortedBy('created_at', {
          descending: true,
          coerce: true,
          strict: true,
        });
      });

      it('pagination: should automatically limit to 10 results and page 1', async () => {
        const {
          body: { reviews, page, limit },
        } = await request.get('/api/reviews');
        expect(reviews).toHaveLength(10);
        expect(page).toBe(1);
        expect(limit).toBe(10);
      });

      it('pagination: current page can be changed by using the ?p query', async () => {
        const {
          body: { reviews, page, limit },
        } = await request.get('/api/reviews?p=2');
        expect(reviews).toHaveLength(3);
        expect(page).toBe('2');
        expect(limit).toBe(10);
      });

      it('pagination: limit can be changed by using the ?limit query', async () => {
        const {
          body: { reviews, page, limit },
        } = await request.get('/api/reviews?limit=13');
        expect(reviews).toHaveLength(13);
        expect(page).toBe(1);
        expect(limit).toBe('13');
      });

      it('queries: works with "sort_by" queries', async () => {
        const {
          body: { reviews: byReviewId },
        } = await request.get('/api/reviews?sort_by=review_id').expect(200);

        const {
          body: { reviews: byVotes },
        } = await request.get('/api/reviews?sort_by=votes').expect(200);

        const {
          body: { reviews: byTitle },
        } = await request.get('/api/reviews?sort_by=title').expect(200);

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
        } = await request
          .get('/api/reviews?sort_by=votes&order=asc')
          .expect(200);
        const {
          body: { reviews: reviewsDescending },
        } = await request
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
        } = await request.get('/api/reviews?category=dexterity').expect(200);
        const {
          body: { reviews: socialDeductionOnly },
        } = await request
          .get('/api/reviews?category=social deduction')
          .expect(200);

        expect(dexterityOnly).toHaveLength(1);
        dexterityOnly.forEach((dexReviews) =>
          expect(dexReviews.category).toBe('dexterity')
        );

        expect(socialDeductionOnly).toHaveLength(10);
        socialDeductionOnly.forEach((sdReviews) =>
          expect(sdReviews.category).toBe('social deduction')
        );
      });

      it('queries: category query is valid but has no reviews, respond with a 200 status code and empty array', async () => {
        const {
          body: { reviews },
        } = await request
          .get("/api/reviews?category=children's games")
          .expect(200);

        expect(reviews.constructor).toBe(Array);
        expect(reviews).toHaveLength(0);
        expect(reviews).toEqual([]);
      });

      it('error: if the category query exists but the category is invalid in the db, respond with 404', async () => {
        const {
          body: { message },
        } = await request.get('/api/reviews?category=test').expect(404);
        expect(message).toBe('Category non-existent');
      });

      it('error: if the order query exists but is invalid, respond with a 400 bad request', async () => {
        const {
          body: { message },
        } = await request.get('/api/reviews?order=test').expect(400);
        expect(message).toBe('Invalid order query');
      });

      it('error: responds with a 400 bad request if sort_by category does not exist', async () => {
        const {
          body: { message },
        } = await request.get('/api/reviews?sort_by=cheese').expect(400);
        expect(message).toBe('Bad Request');
      });
    });

    describe('GET: /api/reviews/:id - Get review by ID', () => {
      it('should respond with a 200 status code', () => {
        return request.get('/api/reviews/3').expect(200);
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

        const res = await request.get('/api/reviews/3');
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
        const res = await request.get('/api/reviews/100').expect(404);
        expect(res.body.message).toBe('No review found');
      });

      it('error: should respond with a 400 invalid request response if id given is not a number', async () => {
        const res = await request.get('/api/reviews/test').expect(400);
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
        return request
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
        } = await request
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
        } = await request
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
        } = await request.patch('/api/reviews/4').send({}).expect(200);

        expect(review).toEqual(expect.objectContaining(patchSchema));
        expect(review.title).toBe(reviewFour.title);
        expect(review.designer).toBe(reviewFour.designer);
        expect(review.owner).toBe(reviewFour.owner);
        expect(review.review_img_url).toBe(reviewFour.review_img_url);
        expect(review.votes).toBe(reviewFour.votes);
        expect(review.category).toBe(reviewFour.category);
      });

      it('error: should respond with a 404 not found response if no review entry can be found', async () => {
        const res = await request
          .patch('/api/reviews/555')
          .send({ inc_votes: 1 })
          .expect(404);
        expect(res.body.message).toBe('No review found');
      });

      it('error: should respond with a 400 bad request if the id or the inc_votes value is not an integer', async () => {
        const invalidID = await request
          .patch('/api/reviews/test')
          .send({ inc_votes: 1 })
          .expect(400);
        const invalidIncVotes = await request
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
        return request.get('/api/reviews/3/comments').expect(200);
      });

      it('should respond with an array of comments following the comment schema', async () => {
        const {
          body: { comments },
        } = await request.get('/api/reviews/3/comments');

        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(3);
        comments.forEach((comment) =>
          expect(comment).toEqual(expect.objectContaining(commentSchema))
        );
      });

      it('responds with an empty array if the review exists but no comments are present', async () => {
        const {
          body: { comments },
        } = await request.get('/api/reviews/12/comments');

        expect(comments).toBeInstanceOf(Array);
        expect(comments).toHaveLength(0);
        expect(comments).toEqual([]);
      });

      it('error: should return a 400 bad request error if the review id is invalid / not integer', async () => {
        const {
          body: { message },
        } = await request.get('/api/reviews/test/comments').expect(400);
        expect(message).toBe('Invalid review id');
      });

      it('error: review id is valid but does not exist in the db, respond with a 404', async () => {
        const {
          body: { message },
        } = await request.get('/api/reviews/20/comments').expect(404);
        expect(message).toBe('Review cannot be found');
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
        return request
          .post('/api/reviews/3/comments')
          .send({
            username: 'bainesface',
            body: 'Test comment',
          })
          .expect(201);
      });

      it('ignores unncessary properties in request body', async () => {
        const {
          body: { comment },
        } = await request.post('/api/reviews/3/comments').send({
          username: 'bainesface',
          body: 'Ignoring other props',
          anotherProp: 'should be ignored',
          likes: ['cheese', 'wine', 'work parties'],
        });

        expect(comment.hasOwnProperty('anotherProp')).toBe(false);
        expect(comment.hasOwnProperty('likes')).toBe(false);
        expect(comment.body).toBe('Ignoring other props');
        expect(comment.author).toBe('bainesface');
        expect(comment.comment_id).toBe(7);
        expect(comment.votes).toBe(0);
        expect(comment.review_id).toBe(3);
      });

      it('should respond with the newly posted comment entry following the comment schema', async () => {
        const {
          body: { comment },
        } = await request.post('/api/reviews/3/comments').send({
          username: 'bainesface',
          body: 'Look! Another test comment!',
        });

        expect(comment).toEqual(expect.objectContaining(commentSchema));
        expect(comment.body).toBe('Look! Another test comment!');
        expect(comment.author).toBe('bainesface');
        expect(comment.review_id).toBe(3);
        expect(comment.comment_id).toBe(7);
      });

      it('error: should return a 400 bad request if the username or body of the request is missing', async () => {
        const {
          body: { message: noUsername },
        } = await request
          .post('/api/reviews/3/comments')
          .send({
            body: 'Uh oh! This wont work!',
          })
          .expect(400);
        const {
          body: { message: noRequestBody },
        } = await request
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
        } = await request
          .post('/api/reviews/test/comments')
          .send({
            username: 'bainesface',
            body: 'That review ID doesnt seem right to me!',
          })
          .expect(400);

        expect(message).toBe('Invalid review id');
      });

      it('error: should return a 404 if the review id is valid but does not exist in the db', async () => {
        const {
          body: { message },
        } = await request
          .post('/api/reviews/999/comments')
          .send({
            username: 'bainesface',
            body: 'Looks like there is no review with the ID of 999',
          })
          .expect(404);

        expect(message).toBe('Review cannot be found');
      });

      it('error: should return a 404 if the user cannot be found in the db', async () => {
        const {
          body: { message },
        } = await request
          .post('/api/reviews/3/comments')
          .send({
            username: 'TestUser3000',
            body: 'I shouldnt exist!',
          })
          .expect(404);

        expect(message).toBe('User does not exist');
      });
    });
  });

  describe('Comments routes', () => {
    const commentSchema = {
      body: expect.any(String),
      votes: expect.any(Number),
      author: expect.any(String),
      review_id: expect.any(Number),
      created_at: expect.any(String),
    };

    describe('PATCH: /api/comments/:id - update the vote count for a comment', () => {
      it('should return a 200 response on a successful update', () => {
        return request
          .patch('/api/comments/2')
          .send({ inc_votes: 1 })
          .expect(200);
      });

      it('should return the updated comment entry, following the commentSchema', async () => {
        const {
          body: { comment },
        } = await request.patch('/api/comments/2').send({ inc_votes: 1 });

        expect(comment).toEqual(expect.objectContaining(commentSchema));
      });

      it('should update the correct comment only', async () => {
        const oldComment = {
          body: "I didn't know dogs could play games",
          votes: 10,
          author: 'philippaclaire9',
          review_id: 3,
        };

        const {
          body: { comment },
        } = await request.patch('/api/comments/3').send({ inc_votes: 1 });

        expect(comment.body).toBe(oldComment.body);
        expect(comment.author).toBe(oldComment.author);
        expect(comment.votes).toBe(11);
        expect(comment.review_id).toBe(oldComment.review_id);
      });

      it('should return a 200 response with a non-updated comment if there is no inc_votes property', async () => {
        const oldComment = {
          body: "I didn't know dogs could play games",
          votes: 10,
          author: 'philippaclaire9',
          review_id: 3,
        };

        const {
          body: { comment },
        } = await request.patch('/api/comments/3').send({}).expect(200);
        expect(comment.body).toBe(oldComment.body);
        expect(comment.votes).toBe(oldComment.votes);
        expect(comment.author).toBe(oldComment.author);
        expect(comment.review_id).toBe(oldComment.review_id);
      });

      it('error: should return a 400 bad request if the inc_votes value is invalid (not a number or coercable)', async () => {
        const {
          body: { message },
        } = await request
          .patch('/api/comments/3')
          .send({ inc_votes: 'not-valid' })
          .expect(400);
        expect(message).toBe('Invalid inc_votes value');
      });

      it('error: should return a 400 bad request if the comment id is invalid (not a number or coercable)', async () => {
        const {
          body: { message },
        } = await request
          .patch('/api/comments/not-a-valid-comment')
          .send({ inc_votes: 1 })
          .expect(400);
        expect(message).toBe('Invalid comment id');
      });

      it('error: should return a 404 not found if the comment id is valid but does not exist in the db', async () => {
        const {
          body: { message },
        } = await request
          .patch('/api/comments/999')
          .send({ inc_votes: 1 })
          .expect(404);
        expect(message).toBe('Comment does not exist');
      });
    });

    describe('DELETE: /api/comments/:id - delete the corresponding comment', () => {
      it('should return a 204 status code with no content if successful', () => {
        return request.delete('/api/comments/2').expect(204);
      });

      it('error: should return a 400 bad request if the comment id is invalid', async () => {
        const {
          body: { message },
        } = await request.delete('/api/comments/test').expect(400);
        expect(message).toBe('Invalid comment id');
      });

      it('error: should return a 404 if the comment id is valid but does not exist in the db', async () => {
        const {
          body: { message },
        } = await request.delete('/api/comments/999').expect(404);
        expect(message).toBe('Comment does not exist');
      });
    });
  });

  describe('Users routes', () => {
    describe('GET: /api/users - get an array of all users', () => {
      it('should return a 200 status code when request is successful', () => {
        return request.get('/api/users').expect(200);
      });

      it('should return an array of user entries', async () => {
        const {
          body: { users },
        } = await request.get('/api/users');
        expect(users).toBeInstanceOf(Array);
        expect(users).toHaveLength(4);
      });
    });

    describe('GET: /api/users/:username - get an individual user by username', () => {
      const userSchema = {
        username: expect.any(String),
        name: expect.any(String),
        avatar_url: expect.any(String),
      };

      it('should respond with a 200 status code when request is successful', () => {
        return request.get('/api/users/bainesface').expect(200);
      });

      it('should respond with a user entry following the userSchema', async () => {
        const {
          body: { user },
        } = await request.get('/api/users/bainesface');
        expect(user).toEqual(expect.objectContaining(userSchema));
      });

      it('should respond with the correct user entry', async () => {
        const {
          body: { user },
        } = await request.get('/api/users/bainesface');

        expect(user.username).toBe('bainesface');
        expect(user.name).toBe('sarah');
        expect(user.avatar_url).toBe(
          'https://avatars2.githubusercontent.com/u/24394918?s=400&v=4'
        );
      });

      it('error: should respond with a 400 bad request if the username parameter is invalid', async () => {
        const {
          body: { message },
        } = await request.get('/api/users/1234').expect(400);
        expect(message).toBe('Invalid username provided');
      });

      it('error: should respond with a 404 if the username is valid but cannot be found in db', async () => {
        const {
          body: { message },
        } = await request.get('/api/users/fakeuser44129').expect(404);
        expect(message).toBe('User does not exist');
      });
    });
  });
});

describe('\nJWT Authorization', () => {
  it('should check for a token value in the headers, if one is not present, return 401 not authorised', async () => {
    request.set('token', 'faketoken'); // Change the authorization token to something unauthorised.

    const {
      body: { message },
    } = await request.get('/api/reviews').expect(401);
    expect(message).toBe(
      'Unauthorized. Make a GET request to /api/auth to get an access token.'
    );

    request.set('token', testToken); // Set the authorization back to a legitimate token for future tests.
  });

  it('GET: /api/ is not protected - allows user to visit without an authorization token', () => {
    return request.get('/api').expect(200);
  });

  it('with a valid authorization token, allows access to the endpoint', async () => {
    const {
      body: { review },
    } = await request.get('/api/reviews/2').expect(200);

    expect(review.title).toBe('Jenga');
    expect(review.owner).toBe('philippaclaire9');
    expect(review.designer).toBe('Leslie Scott');
  });
});
