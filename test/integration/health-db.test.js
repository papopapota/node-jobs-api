const request = require('supertest');

// Mock the database connection before requiring the app
jest.mock('../../db/connect', () => ({
  connectDB: jest.fn().mockResolvedValue(true),
  healthCheckDB: jest.fn().mockResolvedValue({ ok: 1 })
}));

const app = require('../../app');
const { healthCheckDB } = require('../../db/connect');

describe('GET /health/db', () => {
  it('returns 200 when db is up', async () => {
    healthCheckDB.mockResolvedValue({ ok: 1 });
    const res = await request(app).get('/health/db');

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({ db: 'up' })
    );
  });

  it('return 503 when db is down', async () => {
    healthCheckDB.mockRejectedValue(new Error('MongoDB is not connected'));
    const res = await request(app).get('/health/db');
    expect(res.statusCode).toBe(503);
    expect(res.body).toEqual(
      expect.objectContaining({ db: 'down' })
    );
  });
});
