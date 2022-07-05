const request = require("supertest");
const connection = require("../db/connection");
const app = require("../server/app");

const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => connection.end());



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
        expect(res.body.msg).toBe("Unable to process request: Review ID 118 could not be found");
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
});
