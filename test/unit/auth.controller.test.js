const { register, login } = require('../../controllers/auth');
const httpMocks = require('node-mocks-http');
const User = require('../../models/User');

jest.mock('../../models/User');

describe('Auth controller - Unit Test', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('Register', () => {
        it('should create a user and return token', async () => {
            const req = httpMocks.createRequest({
                body: {
                    "name": "Daniel",
                    "email": "test@gmail.com",
                    "password": "secret"
                }
            })
            const res = httpMocks.createResponse();
            User.create.mockResolvedValue({
                getName: () => 'Daniel',
                createJWT: () => 'fake-jwt-token'
            });

            await register(req, res);

            expect(res.statusCode).toBe(201);
            expect(User.create).toHaveBeenCalledWith({
                name: "Daniel",
                email: "test@gmail.com",
                password: "secret"
            })

            const data = res._getJSONData();
            expect(data).toEqual({
                user: { name: 'Daniel' }, token: 'fake-jwt-token'
            });
        });
        it('should throw an error if email was not provided', async () => {
            const req = httpMocks.createRequest({
                body: {
                    "name": "Daniel",
                    "email": "",
                    "password": "secret"
                }
            })
            const res = httpMocks.createResponse();
            User.create.mockResolvedValue({
                
            });
            return await expect(register(req, res)).rejects.toThrow('Please provide email');
        });
    })
    describe('Login', () => {
        it('should login user with valid credentials  ', async () => {
            const req = httpMocks.createRequest({
                body: {
                    "email": "test@gmail.com",
                    "password": "secret"
                }
            });

            const res = httpMocks.createResponse();
            User.findOne.mockResolvedValue({
                getName: () => 'Daniel',
                createJWT: () => 'fake-jwt-token',
                comparePassword: jest.fn().mockResolvedValue(true)
            });
            await login(req, res);

            expect(res.statusCode).toBe(200);
            expect(User.findOne).toHaveBeenCalledWith({
                email: "test@gmail.com"
            })

            const data = res._getJSONData();
            expect(data).toEqual({
                user: { name: 'Daniel' }, token: 'fake-jwt-token'
            });
        });

        it('should throw error if user not found', async () => {
            const req = httpMocks.createRequest({
                body: {
                    "email": "test@gmail.com",
                    "password": "secret"
                }
            });

            const res = httpMocks.createResponse();
            User.findOne.mockResolvedValue(null);
            await expect(login(req, res)).rejects.toThrow('Invalid Credentials.');
            expect(User.findOne).toHaveBeenCalledWith({
                email: "test@gmail.com"
            })
        });

        it('should throw error if password is incorrect', async () => {
            const req = httpMocks.createRequest({
                body: {
                    "email": "test@gmail.com",
                    "password": "wrongpassword"
                }
            });

            const res = httpMocks.createResponse();
            User.findOne.mockResolvedValue({
                comparePassword: jest.fn().mockResolvedValue(false)

            });
            await expect(login(req, res)).rejects.toThrow('Invalid Credentials.');
            expect(User.findOne).toHaveBeenCalledWith({
                email: "test@gmail.com"
            })
        });

        it('should throw error if password and email were not provided', async () => {
            const req = httpMocks.createRequest({
                body: {
                    "email": "",
                    "password": ""
                }
            });
            const res = httpMocks.createResponse();
            await expect(login(req, res)).rejects.toThrow('Please provide email and password');
            expect(User.findOne).not.toHaveBeenCalled();

        });
    })

})