import request from 'supertest'
import app from '../app'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Armies API', () => {

    // Before testing, clean and seed DB
    beforeAll(async () => {

        // Clean 
        await prisma.detachments.deleteMany()
        await prisma.armies.deleteMany()

        // Seed
        await prisma.armies.create({
        data: {
            name: 'Test Army',
            detachments: {
            create: [
                { name: 'Detachment 1' },
                { name: 'Detachment 2' }
            ]
            }
        }
        })
    })

    //After testing, disconnect
    afterAll(async () => {
        await prisma.$disconnect()
    })

    it('GET /api/armies should return 200 and array with our seeded army', async () => {
        const res = await request(app).get('/api/armies')
        expect(res.status).toBe(200)
        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBeGreaterThan(0)
        expect(res.body[0]).toHaveProperty('name', 'Test Army')
        expect(res.body[0]).toHaveProperty('detachments')
        expect(res.body[0].detachments.length).toBe(2)
    })

})
