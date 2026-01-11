const mongoose = require('mongoose');
const { healthCheckDB } = require('../../db/connect');

describe('healthCheckDB', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    test('throws error when mongo is not connected', async () => {
        Object.defineProperty(mongoose.connection, 'readyState', {
            get: jest.fn(() => 0),
            configurable: true
        });

        await expect(healthCheckDB()).rejects.toThrow('MongoDB is not connected');
    });

    test('pings MongoDb when connected', async () => {
        Object.defineProperty(mongoose.connection, 'readyState', {
            get: jest.fn(() => 1),
            configurable: true
        });

        const mockPing = jest.fn().mockResolvedValue({ ok: 1 });
        mongoose.connection.db = {
            admin: () => ({
                ping: mockPing
            })
        };

        await expect(healthCheckDB()).resolves.toEqual({ ok: 1 });
        expect(mockPing).toHaveBeenCalled();
    });
});