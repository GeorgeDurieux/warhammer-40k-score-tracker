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

    //GET all armies
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

    //DELETE first army
    it('DELETE /api/armies/:armyId should delete an existing army and return 200 with confirmation message', async () => {

        const existingArmy = await prisma.armies.findFirst()

        expect(existingArmy).not.toBeNull()

        const res = await request(app)
            .delete(`/api/armies/${existingArmy!.id}`)
            .expect(200)


        expect(res.body).toHaveProperty('message', 'Deleted')
        expect(res.body).toHaveProperty('deletedArmy')
        expect(res.body.deletedArmy.id).toBe(existingArmy!.id)

        const checkArmy = await prisma.armies.findUnique({ where: { id: existingArmy!.id } })
        
        expect(checkArmy).toBeNull()
    })

    //POST new army
    it('POST /api/armies should create a new army with detachments and return 201 with the created army', async () => {

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

        const createdArmy = await prisma.armies.findUnique({
            where: { id: res.body.id },
            include: { detachments: true }
        })

        expect(createdArmy).not.toBeNull()
        expect(createdArmy?.name).toBe(newArmyData.name)
        expect(createdArmy?.detachments.length).toBe(2)
    })

    //GET the new army
    it('GET /api/armies/:armyId should fetch an existing army with detachments and return 200', async () => {

        const existingArmy = await prisma.armies.findFirst({
            include: { detachments: true }
        })

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

    //GET invalid id army
    it('GET /api/armies/:00 should return 404', async () => {

        await request(app)
            .get(`/api/armies/00`)
            .expect(404)
    })

    //PATCH the new army
    it('PATCH /api/armies/:armyId should update an existing army with new name and detachments', async () => {

        const existingArmy = await prisma.armies.findFirst({
            include: { detachments: true }
        })

        expect(existingArmy).not.toBeNull()

        const updatedData = {
            name: existingArmy!.name + ' Updated',
            detachments: [
                ...existingArmy!.detachments.map((d, i) =>
                    i === 0 ? { id: d.id, name: d.name + ' Updated' } : { id: d.id, name: d.name }
                ),
                { name: 'Charlie Detachment' }
            ]
        };

        const res = await request(app)
            .patch(`/api/armies/${existingArmy!.id}`)
            .send(updatedData)
            .expect(200)

        expect(res.body.name).toBe(updatedData.name)

        const detachmentNames = res.body.detachments.map((d: any) => d.name)

        expect(detachmentNames).toEqual(
            expect.arrayContaining(updatedData.detachments.map(d => d.name))
        )

        const updatedArmy = await prisma.armies.findUnique({
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

        expect(updatedArmy!.detachments.find(d => d.id === detWithId[0].id)?.name).toBe(
            updatedData.detachments[0].name
        )

        expect(updatedArmy!.detachments.some(d => d.name === 'Charlie Detachment')).toBe(true)
    })

    //SOFT DELETE army
    it('PATCH /api/armies/soft/:armyId should soft delete an existing army and its detachments', async () => {
    
        const existingArmy = await prisma.armies.findFirst({
            include: { detachments: true }
        })

        const res = await request(app)
            .patch(`/api/armies/soft/${existingArmy!.id}`)
            .expect(200)

        expect(res.body.updatedArmy.id).toBe(existingArmy!.id)
        expect(res.body.updatedArmy.is_deleted).toBe(true)

        const deletedArmy = await prisma.armies.findUnique({
            where: { id: existingArmy!.id }
        })
        
        expect(deletedArmy?.is_deleted).toBe(true)

        const deletedDetachments = await prisma.detachments.findMany({
            where: { army_id: existingArmy!.id }
        })

        expect(deletedDetachments.every(d => d.is_deleted)).toBe(true)
    })

})
