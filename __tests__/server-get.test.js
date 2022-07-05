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
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png"
        });
      });
  });
  test.only("400, for an invalid review_id", () => {
    return request(app)
      .get("/api/reviews/invalid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request a review Id must be a number.");
      });
  });
  test.only("404, for a valid but non-existent review_id", () => {
    return request(app)
      .get("/api/reviews/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("review_id not found");
      });
  });
});
