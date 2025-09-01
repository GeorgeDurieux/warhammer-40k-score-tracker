import request from 'supertest'
import app from '../app' 
import bcrypt from "bcrypt"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Auth API', () => {

    beforeEach(async () => {
        await prisma.game.deleteMany()
        await prisma.detachment.deleteMany()
        await prisma.army.deleteMany()
        await prisma.user.deleteMany()
    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

    describe('POST /api/auth/register', () => {

        it('should register a new user', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'TestUser',
                    email: 'testuser@example.com',
                    password: 'password123'
                })
                .expect(201)

            expect(res.body).toHaveProperty('token')
            expect(res.body.user).toHaveProperty('id')
            expect(res.body.user.username).toBe('TestUser')

            const userInDb = await prisma.user.findUnique({ where: { username: 'TestUser' } })
            expect(userInDb).not.toBeNull()
        })

        it('should not allow registering with existing username or email', async () => {
            await prisma.user.create({
                data: { username: 'TestUser', email: 'testuser@example.com', password: 'hashedpassword' }
            })

            const res = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'TestUser',
                    email: 'testuser@example.com',
                    password: 'password123'
                })
                .expect(409)

            expect(res.body).toHaveProperty('errorCode', 'AUTH_USER_EXISTS')
        })

        it('should require all fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'TestUser' })
                .expect(400)

            expect(res.body).toHaveProperty('errorCode', 'AUTH_MISSING_FIELDS')
        })
    })

    describe('POST /api/auth/login', () => {

        beforeEach(async () => {
            const hashed = await bcrypt.hash('password123', 10)
            await prisma.user.create({
                data: { username: 'LoginUser', email: 'login@example.com', password: hashed }
            })
        })

        it('should login with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'LoginUser', password: 'password123' })
                .expect(200)

            expect(res.body).toHaveProperty('token')
            expect(res.body.user.username).toBe('LoginUser')
        })

        it('should fail with wrong username', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'WrongUser', password: 'password123' })
                .expect(401)

            expect(res.body).toHaveProperty('errorCode', 'AUTH_INVALID_USERNAME')
        })

        it('should fail with wrong password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'LoginUser', password: 'wrongpassword' })
                .expect(401)

            expect(res.body).toHaveProperty('errorCode', 'AUTH_INVALID_PASSWORD')
        })

        it('should require both username and password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'LoginUser' })
                .expect(400)

            expect(res.body).toHaveProperty('errorCode', 'AUTH_MISSING_FIELDS')
        })
    })
})
