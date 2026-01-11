const request = require('supertest');

// Mock the database connection before requiring the app
jest.mock('../../db/connect', () => ({
  connectDB: jest.fn().mockResolvedValue(true),
  healthCheckDB: jest.fn().mockResolvedValue({ ok: 1 })
}));

const app = require('../../app');

describe('GET /health', () => {
  it('should return 200 and status ok', async () => {
    const res = await request(app).get('/health');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({ status: 'ok' })
    );
  });
});
