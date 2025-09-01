import request from 'supertest'
import app from '../app'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Matches API', () => {
    let testMatch: any
    let testUser: any
    let userArmy: any
    let opponentArmy: any
    let userDetachment: any
    let opponentDetachment: any

    beforeAll(async () => {
        // Clean
        await prisma.game.deleteMany()
        await prisma.detachment.deleteMany()
        await prisma.army.deleteMany()
        await prisma.user.deleteMany()

        // Seed user
        testUser = await prisma.user.create({
            data: { username: 'TestUser', email: 'testuser@example.com', password: 'hashedpassword' }
        })

        // Seed armies
        userArmy = await prisma.army.create({ data: { name: 'User Army', isDeleted: false } })
        opponentArmy = await prisma.army.create({ data: { name: 'Opponent Army', isDeleted: false } })

        // Seed detachments
        userDetachment = await prisma.detachment.create({ data: { name: 'User Detachment', armyId: userArmy.id, isDeleted: false } })
        opponentDetachment = await prisma.detachment.create({ data: { name: 'Opponent Detachment', armyId: opponentArmy.id, isDeleted: false } })

        // Seed match
        testMatch = await prisma.game.create({
            data: {
                userId: testUser.id,
                userArmyId: userArmy.id,
                userDetachmentId: userDetachment.id,
                opponentArmyId: opponentArmy.id,
                opponentDetachmentId: opponentDetachment.id,
                date: new Date(),
                userScore: 80,
                opponentScore: 70,
                userWtcScore: 15,
                opponentWtcScore: 5,
                isTournament: true,
                tournamentName: 'Test Tournament'
            }
        })
    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

    it('POST /api/matches should create a new match', async () => {
        const newMatchData = {
            userId: testUser.id,
            userArmyId: userArmy.id,
            userDetachmentId: userDetachment.id,
            opponentArmyId: opponentArmy.id,
            opponentDetachmentId: opponentDetachment.id,
            date: new Date().toISOString(),
            userScore: 90,
            opponentScore: 85,
            userWtcScore: 17,
            opponentWtcScore: 3,
            isTournament: false
        }

        const res = await request(app)
            .post('/api/matches')
            .send(newMatchData)
            .expect(201)

        expect(res.body).toHaveProperty('id')
        expect(res.body.userScore).toBe(90)
        expect(res.body.isTournament).toBe(false)
    })

    it('GET /api/matches should return all matches', async () => {
        const res = await request(app).get('/api/matches').expect(200)

        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBeGreaterThan(0)
    })

    it('GET /api/matches/:id should return a specific match', async () => {
        const res = await request(app)
            .get(`/api/matches/${testMatch.id}`)
            .expect(200)

        expect(res.body.id).toBe(testMatch.id)
        expect(res.body.userScore).toBe(80)
    })

    it('PATCH /api/matches/:id should update an existing match', async () => {
        const updatedData = { userScore: 95, opponentScore: 60 }

        const res = await request(app)
            .patch(`/api/matches/${testMatch.id}`)
            .send({
                ...testMatch,
                date: new Date().toISOString(),
                ...updatedData
            })
            .expect(200)

        expect(res.body.userScore).toBe(95)
        expect(res.body.opponentScore).toBe(60)
    })
})
