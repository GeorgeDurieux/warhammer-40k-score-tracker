import request from 'supertest'
import app from '../app'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Matches API', () => {
    let testMatch: any

    // Before testing, clean and seed DB
    beforeAll(async () => {

        //Clean up
        await prisma.games.deleteMany()
        await prisma.detachments.deleteMany()
        await prisma.armies.deleteMany()
        await prisma.users.deleteMany()

        // Create a test user
        const testUser = await prisma.users.create({
            data: {
                username: 'TestUser',
                email: 'testuser@example.com',
                password: 'hashedpassword'
            }
        })

        // Create armies/detachments for match
        const userArmy = await prisma.armies.create({
            data: { name: 'User Army', is_deleted: false }
        })
        const opponentArmy = await prisma.armies.create({
            data: { name: 'Opponent Army', is_deleted: false }
        })

        const userDetachment = await prisma.detachments.create({
            data: { name: 'User Detachment', army_id: userArmy.id, is_deleted: false }
        })
        const opponentDetachment = await prisma.detachments.create({
            data: { name: 'Opponent Detachment', army_id: opponentArmy.id, is_deleted: false }
        })

        // Create test match
        testMatch = await prisma.games.create({
            data: {
                user_id: testUser.id,
                user_army_id: userArmy.id,
                user_detachment_id: userDetachment.id,
                opponent_army_id: opponentArmy.id,
                opponent_detachment_id: opponentDetachment.id,
                date: new Date(),
                user_score: 80,
                opponent_score: 70,
                user_wtc_score: 15,
                opponent_wtc_score: 5,
                is_tournament: true,
                tournament_name: 'Test Tournament',
            }
        })
    })

    //After, disconnect
    afterAll(async () => {
        await prisma.$disconnect()
    })

    it('POST /api/matches should create a new match', async () => {

        const existingUser = await prisma.users.findFirst()

        const newMatchData = {
            user_id: existingUser?.id,
            user_army_id: testMatch.user_army_id,
            user_detachment_id: testMatch.user_detachment_id,
            opponent_army_id: testMatch.opponent_army_id,
            opponent_detachment_id: testMatch.opponent_detachment_id,
            date: new Date().toISOString(),
            user_score: 90,
            opponent_score: 85,
            user_wtc_score: 17,
            opponent_wtc_score: 3,
            is_tournament: false
        }

        const res = await request(app)
            .post('/api/matches')
            .send(newMatchData)
            .expect(201)

        expect(res.body).toHaveProperty('id')
        expect(res.body.user_score).toBe(90)
        expect(res.body.is_tournament).toBe(false)
    })

    it('GET /api/matches should return all matches', async () => {
        const res = await request(app)
            .get('/api/matches')
            .expect(200)

        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBeGreaterThan(0)
    })

    it('GET /api/matches/:id should return a specific match', async () => {
        const res = await request(app)
            .get(`/api/matches/${testMatch.id}`)
            .expect(200)

        expect(res.body.id).toBe(testMatch.id)
        expect(res.body.user_score).toBe(80)
    })

    it('PATCH /api/matches/:id should update an existing match', async () => {
        const updatedData = { user_score: 95, opponent_score: 60 }

        const res = await request(app)
            .patch(`/api/matches/${testMatch.id}`)
            .send({
                ...testMatch,
                date: new Date().toISOString(),
                ...updatedData
            })
            .expect(200)

        expect(res.body.user_score).toBe(95)
        expect(res.body.opponent_score).toBe(60)
    })
})
