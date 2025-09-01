import request from 'supertest'
import { PrismaClient } from '@prisma/client'
import app from '../app'

const prisma = new PrismaClient()

describe('Detachment API', () => {
    let testArmy: any
    let testDetachment: any

    beforeAll(async () => {
        await prisma.game.deleteMany()
        await prisma.detachment.deleteMany()
        await prisma.army.deleteMany()
        await prisma.user.deleteMany()

        // Seed
        testArmy = await prisma.army.create({
            data: { name: 'Test Army', isDeleted: false }
        })

        testDetachment = await prisma.detachment.create({
            data: { name: 'Initial Detachment', isDeleted: false, armyId: testArmy.id }
        })
    })

    afterAll(async () => {
        await prisma.$disconnect()
    })

    it('POST /api/detachments should create a new detachment and return 201', async () => {
        const res = await request(app)
            .post('/api/detachments')
            .send({ name: 'New Detachment', armyId: testArmy.id })
            .expect(201)

        expect(res.body).toHaveProperty('id')
        expect(res.body.name).toBe('New Detachment')

        const inDb = await prisma.detachment.findUnique({ where: { id: res.body.id } })
        expect(inDb).not.toBeNull()
    })

    it('GET /api/detachments should get all detachments (excluding soft-deleted) and return 200', async () => {
        const res = await request(app)
            .get('/api/detachments')
            .expect(200)

        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.every((d: any) => d.isDeleted === false)).toBe(true)
    })

    it('GET /api/detachments/:detachmentId should get a detachment by ID and return 200', async () => {
        const res = await request(app)
            .get(`/api/detachments/${testDetachment.id}`)
            .expect(200)

        expect(res.body.id).toBe(testDetachment.id)
        expect(res.body.name).toBe(testDetachment.name)
    })

    it('should return 404 if detachment not found', async () => {
        const res = await request(app)
            .get('/api/detachments/999999')
            .expect(404)

        expect(res.body).toHaveProperty('errorCode', 'DETACHMENT_NOT_FOUND')
    })

    it('PATCH /api/detachments/:detachmentId should update a detachment by ID and return 200', async () => {
        const res = await request(app)
            .patch(`/api/detachments/${testDetachment.id}`)
            .send({ name: 'Updated Detachment' })
            .expect(200)

        expect(res.body.name).toBe('Updated Detachment')

        const inDb = await prisma.detachment.findUnique({ where: { id: testDetachment.id } })
        expect(inDb?.name).toBe('Updated Detachment')
    })

    it('PATCH /api/detachments/soft/:detachmentId should soft delete a detachment', async () => {
        const res = await request(app)
            .patch(`/api/detachments/soft/${testDetachment.id}`)
            .expect(200)

        expect(res.body.isDeleted).toBe(true)

        const inDb = await prisma.detachment.findUnique({ where: { id: testDetachment.id } })
        expect(inDb?.isDeleted).toBe(true)
    })

    it('GET /api/detachments/army/:armyId should get detachments for a given army', async () => {
        await prisma.detachment.create({ data: { name: 'Army Specific', armyId: testArmy.id } })

        const res = await request(app)
            .get(`/api/detachments/army/${testArmy.id}`)
            .expect(200)

        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.every((d: any) => d.isDeleted === false)).toBe(true)
    })

    it('DELETE /api/detachments/:detachmentId should delete a detachment from DB', async () => {
        const tempDetachment = await prisma.detachment.create({ data: { name: 'Temp Delete', armyId: testArmy.id } })

        await request(app)
            .delete(`/api/detachments/${tempDetachment.id}`)
            .expect(200)

        const inDb = await prisma.detachment.findUnique({ where: { id: tempDetachment.id } })
        expect(inDb).toBeNull()
    })
})
