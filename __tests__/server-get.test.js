const request = require("supertest");
const connection = require("../db/connection");
const app = require("../server/app");

const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => connection.end());

describe("/api/categories", () => {
  describe("GET", () => {
    test("status 200, will return an array of categories", () => {
      return request(app)
        .get("/api/categories")
        .expect(200)
        .then((res) => {
          expect(res.body.categories).toHaveLength(4);
          res.body.categories.forEach((category) => {
            expect(category).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String)
              })
            );
          });
        });
    });
  });
});
describe("ERROR - /api/invalid_url", () => {
  test("Status: 404 and returns and error message", () => {
    return request(app)
      .get("/api/invalid_url")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not Found");
      });
  });
});
describe("GET/api/reviews/:review_id", () => {
  test("Status 200, responds with the review for a specific review_id", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.review).toEqual({
          review_id: 1,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: "2021-01-18T10:00:20.514Z",
          votes: 1,
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          comment_count: 0
        });
      });
  });
  test("400, for an invalid review_id", () => {
    return request(app)
      .get("/api/reviews/invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Bad Request");
      });
  });
  test("404, for a valid but non-existent review_id", () => {
    return request(app)
      .get("/api/reviews/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review_id not found");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("200: patch updates vote count and returns updated review", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: 2 })
      .expect(200)
      .then((res) => {
        expect(res.body.review).toEqual({
          review_id: 1,
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: expect.any(String),
          votes: 3
        });
      });
  });
  test("404: returns when review_id does not exist", () => {
    return request(app)
      .patch("/api/reviews/118")
      .send({ inc_votes: 2 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe(
          "Unable to process request: Review ID 118 could not be found"
        );
      });
  });
  test("400: returns when vote is not a number", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_votes: "fish" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
  test("404: returns when misspelt endpoint ", () => {
    return request(app)
      .patch("/api/review/1")
      .send({ inc_votes: 2 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not Found");
      });
  });
  test("400: returns when spelt incorrectly", () => {
    return request(app)
      .patch("/api/reviews/1")
      .send({ inc_botes: 2 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("Bad Request");
      });
  });
});

describe("/api/users", () => {
  describe("GET", () => {
    it("returns all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).toHaveLength(4);
          users.forEach((user) => {
            expect(user).toHaveProperty("username");
            expect(user).toHaveProperty("name");
            expect(user).toHaveProperty("avatar_url");
          });
        });
    });
  });
});
describe("ERROR - invalid path users api", () => {
  test("Status: 404 and returns and error message", () => {
    return request(app)
      .get("/api/userz")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("Not Found");
      });
  });
});
describe("/api/reviews", () => {
  describe("GET", () => {
    test("Status: 200. Responds with an array of review objects", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body: { reviews } }) => {
          expect(reviews).toHaveLength(13);
          reviews.forEach((review) => {
            expect(review).toEqual(
              expect.objectContaining({
                owner: expect.any(String),
                title: expect.any(String),
                review_id: expect.any(Number),
                category: expect.any(String),
                review_img_url: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                review_body: expect.any(String),
                designer: expect.any(String),
                comment_count: expect.any(Number)
              })
            );
          });
        });
    });
    test("Status: 200. Responds with an array of review objects sorted by review creation date descending by default", () => {
      return request(app)
        .get("/api/reviews")
        .expect(200)
        .then(({ body }) => {
          const { reviews } = body;
          expect(reviews).toBeSortedBy("created_at", {
            descending: true
          });
        });
    });
  });
});

describe("GET/api/reviews/:review_id/comments", () => {
  test("status:200, returns an array of comments by their review_id", () => {
    const reviewId = 2;
    return request(app)
      .get(`/api/reviews/${reviewId}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments.length).toBe(3);
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              review_id: reviewId
            })
          );
        });
      });
  });
  test("status:404, returns an error if the review does not exist", () => {
    const reviewId = 2000;
    return request(app)
      .get(`/api/reviews/${reviewId}/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Resource not found");
      });
  });
  test("status: 400, responds with 400 bad request when review_id is of invalid datatype", () => {
    return request(app)
      .get("/api/reviews/this_is_not_an_id/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});
