const request = require('supertest');
const app = require('../../app');
require('dotenv').config({
  path: `.env.${process.env.NODE_ENV} || "local"`
});
describe('GET /health', () => {
  it('should return 200 and status ok', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({ status: 'ok' })
    );
  });
});
