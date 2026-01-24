const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../models/User');

let mongo;

describe('User model Integration', () => {
    beforeAll(async () => {
        mongo = await MongoMemoryServer.create();
        const uri = mongo.getUri();
        await mongoose.connect(uri);
    })

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.connection.close();
        await mongo.stop();
    })

    afterEach(async () => {
        await User.deleteMany();
    })

    it('hashed password before saving ', async () => {
        const userData = {
            name: 'Test User',
            email: 'test@gmail.com',
            password: 'plainpassword'
        };
        const user = new User(userData);
        await user.save();
        expect(user.password).not.toBe(userData.password);
    });

    it('comparePassword return true for the correct password ', async () => {
        const userData = {
            name: 'Test User',
            email: 'test@gmail.com',
            password: 'plainpassword'
        };
        const user = new User(userData);
        await user.save();
        const isValid = await user.comparePassword('plainpassword');
        expect(isValid).toBe(true);
    });

    it('comparePassword return false for the incorrect password ', async () => {
        const userData = {
            name: 'Test User',
            email: 'test@gmail.com',
            password: 'plainpassword'
        };
        const user = new User(userData);
        await user.save();
        const isValid = await user.comparePassword('wrongpassword');
        expect(isValid).toBe(false);
    });

    it('creates a valid JWT token', async () => {
        const userData = {
            name: 'Test User',
            email: 'test@gmail.com',
            password: 'plainpassword'
        };
        const user = new User(userData);
        await user.save();
        const token = user.createJWT();
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
    });
})