import request from 'supertest'
import app from '../app' 
import bcrypt from "bcrypt"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Auth API', () => {

    // Clean up
    beforeEach(async () => {
        await prisma.games.deleteMany()
        await prisma.detachments.deleteMany()
        await prisma.armies.deleteMany()
        await prisma.users.deleteMany()
    })

    //After, disconnect
    afterAll(async () => {
        await prisma.$disconnect()
    })

    //Register
    describe('POST /api/auth/register', () => {

        //Register new user
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

            const userInDb = await prisma.users.findUnique({ where: { username: 'TestUser' } })
            expect(userInDb).not.toBeNull()
        })

        //Register with existing credentials
        it('should not allow registering with existing username or email', async () => {
            await prisma.users.create({
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

            expect(res.body).toHaveProperty('err', 'User already exists')
        })

        //Register with missing fields
        it('should require all fields', async () => {
            const res = await request(app)
                .post('/api/auth/register')
                .send({ username: 'TestUser' })
                .expect(400)

            expect(res.body).toHaveProperty('err', 'All fields are required')
        })
    })

    //Login
    describe('POST /api/auth/login', () => {

        //Before, seed 
        beforeEach(async () => {
            const hashed = await bcrypt.hash('password123', 10)
            await prisma.users.create({
                data: { username: 'LoginUser', email: 'login@example.com', password: hashed }
            })
        })

        //Correct login
        it('should login with correct credentials', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'LoginUser', password: 'password123' })
                .expect(200)

            expect(res.body).toHaveProperty('token')
            expect(res.body.user.username).toBe('LoginUser')
        })

        //Wrong username
        it('should fail with wrong username', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'WrongUser', password: 'password123' })
                .expect(401)

            expect(res.body).toHaveProperty('err', 'Invalid username')
        })

        //Wrong password
        it('should fail with wrong password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'LoginUser', password: 'wrongpassword' })
                .expect(401)

            expect(res.body).toHaveProperty('err', 'Invalid password')
        })

        //Missing fields
        it('should require both username and password', async () => {
            const res = await request(app)
                .post('/api/auth/login')
                .send({ username: 'LoginUser' })
                .expect(400)

            expect(res.body).toHaveProperty('err', 'Email and password are required')
        })
    })
})
