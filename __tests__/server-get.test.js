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
