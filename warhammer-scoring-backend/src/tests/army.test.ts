import request from 'supertest'
import app from '../app'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

describe('Armies API', () => {

    beforeAll(async () => {
        // Clean DB
        await prisma.game.deleteMany()
        await prisma.detachment.deleteMany()
        await prisma.army.deleteMany()
        await prisma.user.deleteMany()

        // Seed army with detachments
        await prisma.army.create({
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

    afterAll(async () => {
        await prisma.$disconnect()
    })

    it('GET /api/armies should return 200 and array with our seeded army', async () => {
        const res = await request(app)
            .get('/api/armies')
            .expect(200)

        expect(Array.isArray(res.body)).toBe(true)
        expect(res.body.length).toBeGreaterThan(0)
        expect(res.body[0]).toHaveProperty('name', 'Test Army')
        expect(res.body[0]).toHaveProperty('detachments')
        expect(res.body[0].detachments.length).toBe(2)
    })

    it('DELETE /api/armies/:armyId should delete an existing army and return 200', async () => {
        const existingArmy = await prisma.army.findFirst()
        expect(existingArmy).not.toBeNull()

        const res = await request(app)
            .delete(`/api/armies/${existingArmy!.id}`)
            .expect(200)

        expect(res.body).toHaveProperty('message', 'Deleted')
        expect(res.body).toHaveProperty('deletedArmy')
        expect(res.body.deletedArmy.id).toBe(existingArmy!.id)

        const checkArmy = await prisma.army.findUnique({ where: { id: existingArmy!.id } })
        expect(checkArmy).toBeNull()
    })

    it('POST /api/armies should create a new army with detachments and return 201', async () => {
        const newArmyData = {
            name: 'Test Army',
            detachments: ['Alpha Detachment', 'Bravo Detachment']
        }

        const res = await request(app)
            .post('/api/armies')
            .send(newArmyData)
            .expect(201)

        expect(res.body).toHaveProperty('id')
        expect(res.body).toHaveProperty('name', newArmyData.name)
        expect(res.body).toHaveProperty('detachments')
        expect(Array.isArray(res.body.detachments)).toBe(true)
        expect(res.body.detachments.length).toBe(2)

        const detachmentNames = res.body.detachments.map((d: any) => d.name)
        expect(detachmentNames).toEqual(expect.arrayContaining(newArmyData.detachments))

        const createdArmy = await prisma.army.findUnique({
            where: { id: res.body.id },
            include: { detachments: true }
        })

        expect(createdArmy).not.toBeNull()
        expect(createdArmy?.name).toBe(newArmyData.name)
        expect(createdArmy?.detachments.length).toBe(2)
    })

    it('GET /api/armies/:armyId should fetch an existing army with detachments', async () => {
        const existingArmy = await prisma.army.findFirst({ include: { detachments: true } })
        expect(existingArmy).not.toBeNull()

        const res = await request(app)
            .get(`/api/armies/${existingArmy!.id}`)
            .expect(200)

        expect(res.body.name).toBe(existingArmy?.name)

        const detachmentNames = res.body.detachments.map((d: any) => d.name)
        expect(detachmentNames).toEqual(
            expect.arrayContaining(existingArmy!.detachments.map(d => d.name))
        )
    })

    it('GET /api/armies/00 should return 404', async () => {
        await request(app)
            .get(`/api/armies/00`)
            .expect(404)
    })

    it('PATCH /api/armies/:armyId should update an existing army with new name and detachments', async () => {
        const existingArmy = await prisma.army.findFirst({ include: { detachments: true } })
        expect(existingArmy).not.toBeNull()

        const updatedData = {
            name: existingArmy!.name + ' Updated',
            detachments: [
                ...existingArmy!.detachments.map((d, i) =>
                    i === 0 ? { id: d.id, name: d.name + ' Updated' } : { id: d.id, name: d.name }
                ),
                { name: 'Charlie Detachment' }
            ]
        }

        const res = await request(app)
            .patch(`/api/armies/${existingArmy!.id}`)
            .send(updatedData)
            .expect(200)

        expect(res.body.name).toBe(updatedData.name)

        const detachmentNames = res.body.detachments.map((d: any) => d.name)
        expect(detachmentNames).toEqual(
            expect.arrayContaining(updatedData.detachments.map(d => d.name))
        )

        const updatedArmy = await prisma.army.findUnique({
            where: { id: existingArmy!.id },
            include: { detachments: true }
        })

        expect(updatedArmy).not.toBeNull()
        expect(updatedArmy!.name).toBe(updatedData.name)
        expect(updatedArmy!.detachments.length).toBe(updatedData.detachments.length)

        type Detachment = { id: number; name: string } | { name: string }
        function hasId(detachment: Detachment): detachment is { id: number; name: string } {
            return 'id' in detachment && typeof detachment.id === 'number'
        }
        const detWithId = updatedData.detachments.filter(hasId)
        expect(updatedArmy!.detachments.find(d => d.id === detWithId[0].id)?.name)
            .toBe(updatedData.detachments[0].name)

        expect(updatedArmy!.detachments.some(d => d.name === 'Charlie Detachment')).toBe(true)
    })

    it('PATCH /api/armies/soft/:armyId should soft delete an existing army and its detachments', async () => {
        const existingArmy = await prisma.army.findFirst({ include: { detachments: true } })

        const res = await request(app)
            .patch(`/api/armies/soft/${existingArmy!.id}`)
            .expect(200)

        expect(res.body.updatedArmy.id).toBe(existingArmy!.id)
        expect(res.body.updatedArmy.isDeleted).toBe(true)

        const deletedArmy = await prisma.army.findUnique({ where: { id: existingArmy!.id } })
        expect(deletedArmy?.isDeleted).toBe(true)

        const deletedDetachments = await prisma.detachment.findMany({
            where: { armyId: existingArmy!.id }
        })

        expect(deletedDetachments.every(d => d.isDeleted)).toBe(true)
    })
})
