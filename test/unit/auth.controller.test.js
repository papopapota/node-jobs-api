const { register, login } = require('../../controllers/auth');
const httpMocks = require('node-mocks-http');
const User = require('../../models/User');
const { mock } = require('jest-mock-extended');

jest.mock('../../models/User');

const mockRequest = (body) => {
    return httpMocks.createRequest({
        body
    });
}

const mockResponse = (body) => {
    return httpMocks.createResponse();
}

describe('Auth controller - Unit Test', () => {
    afterEach(() => {
        jest.clearAllMocks();
    })

    describe('Register', () => {
        it('should create a user and return token', async () => {
            const req = mockRequest({
                "name": "Daniel",
                "email": "test@gmail.com",
                "password": "secret"
            });
            const res = mockResponse();
            User.create.mockResolvedValue({
                getName: jest.fn().mockReturnValue('Daniel'),
                createJWT: jest.fn().mockReturnValue('fake-jwt-token')
            });

            await register(req, res);
            expect(User.create).toHaveBeenCalledWith(req.body);
            expect(res.statusCode).toBe(201);
            const data = res._getJSONData();
            expect(data).toEqual({
                user: { name: 'Daniel' },
                token: 'fake-jwt-token'
            });
        });
        it('should throw an error if user credentials fails', async () => {
            const req = mockRequest({
                "name": "Daniel",
                "email": "",
                "password": ""
            });
            const res = mockResponse();
            User.create.mockRejectedValue(new Error('Validation Error'));
            await expect(register(req, res)).rejects.toThrow('Validation Error');
        });
    })

    describe('Login', () => {
        it('should login user with valid credentials  ', async () => {
            const req = mockRequest({
                "email": "test@gmail.com",
                "password": "secret"
            });

            const res = mockResponse();
            const userMock = {
                getName: jest.fn().mockReturnValue('Daniel'),
                createJWT: jest.fn().mockReturnValue('fake-jwt-token'),
                comparePassword: jest.fn().mockResolvedValue(true)
            }
            User.findOne.mockResolvedValue(userMock);
            await login(req, res);
            expect(User.findOne).toHaveBeenCalledWith({
                email: "test@gmail.com"
            });
            expect(userMock.comparePassword).toHaveBeenCalledWith("secret");
            expect(userMock.createJWT).toHaveBeenCalledWith();
            expect(res.statusCode).toBe(200);
            const data = res._getJSONData();
            expect(data).toEqual({
                user: { name: 'Daniel' }, token: 'fake-jwt-token'
            });
        });

        it('should throw error if user not found', async () => {
            const req = mockRequest({
                "email": "test@gmail.com",
                "password": "secret"
            });

            const res = mockResponse();
            User.findOne.mockResolvedValue(null);
            await expect(login(req, res)).rejects.toThrow('Invalid Credentials.');
            expect(User.findOne).toHaveBeenCalledWith({
                email: "test@gmail.com"
            })
        });

        it('should throw error if password is incorrect', async () => {
            const req = mockRequest({
                "email": "test@gmail.com",
                "password": "wrongpassword"
            });

            const res = mockResponse();
            User.findOne.mockResolvedValue({
                comparePassword: jest.fn().mockResolvedValue(false)
            });
            await expect(login(req, res)).rejects.toThrow('Invalid Credentials.');
            expect(User.findOne).toHaveBeenCalledWith({
                email: "test@gmail.com"
            })
        });

    })

})