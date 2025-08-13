import request from 'supertest'
import { PrismaClient } from '@prisma/client'
import app from '../app' 

const prisma = new PrismaClient()

describe('Detachment API', () => {
    let testArmy: any
    let testDetachment: any

    // Before testing, clean and seed DB
    beforeAll(async () => {

        // Clean 
        await prisma.detachments.deleteMany({})
        await prisma.armies.deleteMany({})

        // Seed
        testArmy = await prisma.armies.create({
            data: {
                name: 'Test Army',
                is_deleted: false
            }
        })

        testDetachment = await prisma.detachments.create({
            data: {
                name: 'Initial Detachment',
                is_deleted: false,
                army_id: testArmy.id
            }
        })
    })

    //After testing, disconnect
    afterAll(async () => {        
        await prisma.$disconnect()
    })

    //POST new detachment
    it('POST /api/detachments should create a new detachment and return 201', async () => {
        const res = await request(app)
            .post('/api/detachments')
            .send({
                name: 'New Detachment',
                armyId: testArmy.id
            })
            .expect(201)

        expect(res.body).toHaveProperty('id')
        expect(res.body.name).toBe('New Detachment')

        const inDb = await prisma.detachments.findUnique({ where: { id: res.body.id } })
        expect(inDb).not.toBeNull()
    })

    //GET all detachments
    it('GET /api/detachments should get all detachments (excluding soft-deleted ones) and return 200', async () => {
        const res = await request(app)
            .get('/api/detachments')
            .expect(200)

        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.every((d: any) => d.is_deleted === false)).toBe(true)
    })

    //GET one detachment by id
    it('GET /api/detachment/detachmentId should get a detachment by ID and return 200', async () => {
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

        expect(res.body).toHaveProperty('err', 'Detachment not found')
    })

    //PATCH update detachment
    it('PATCH /api/detachments/detachmentId should update a detachment by ID and return 200', async () => {
        const res = await request(app)
            .patch(`/api/detachments/${testDetachment.id}`)
            .send({ name: 'Updated Detachment' })
            .expect(200)

        expect(res.body.name).toBe('Updated Detachment')

        const inDb = await prisma.detachments.findUnique({ where: { id: testDetachment.id } })
        expect(inDb?.name).toBe('Updated Detachment')
    })

    //PATCH soft delete
    it('PATCH /api/detachments/soft/detachmentId should soft delete a detachment', async () => {
        const res = await request(app)
            .patch(`/api/detachments/soft/${testDetachment.id}`)
            .expect(200)

        expect(res.body.is_deleted).toBe(true)

        const inDb = await prisma.detachments.findUnique({ where: { id: testDetachment.id } })
        expect(inDb?.is_deleted).toBe(true)
    })

    //GET one detachment by army id
    it('GET /api/detachments/army/armyId should get detachments for a given army', async () => {

        await prisma.detachments.create({
            data: { name: 'Army Specific', army_id: testArmy.id }
        })

        const res = await request(app)
            .get(`/api/detachments/army/${testArmy.id}`)
            .expect(200)

        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.every((d: any) => d.is_deleted === false)).toBe(true)
    })

    //DELETE one detachment
    it('DELETE /api/detachments/detachmentId should delete a detachment from DB', async () => {
        const tempDetachment = await prisma.detachments.create({
            data: {
                name: 'Temp Delete',
                army_id: testArmy.id
            }
        })

        await request(app)
            .delete(`/api/detachments/${tempDetachment.id}`)
            .expect(200)

        const inDb = await prisma.detachments.findUnique({ where: { id: tempDetachment.id } })
        expect(inDb).toBeNull()
    })
})
