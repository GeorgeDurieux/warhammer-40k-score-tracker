import { Request, Response } from "express"
import prisma from '../prisma'
import { ERROR_CODES } from '../constants/errorCodes'

export const createArmy = async (req: Request, res: Response) => {
    try {
        const {
            name,
            detachments
        } = req.body

        const newArmy = await prisma.armies.create({
            data: {
                name, 
                detachments: {
                    create: detachments.map((d: string) => ({ name: d }))
                }
            },
            include: {
                detachments: true
            }
        })
        res.status(201).json(newArmy)

    } catch (err) {
        console.log(err)
        res.status(500).json({ errorCode: ERROR_CODES.ARMY_CREATE_ERROR })
    }
}

export const getArmies = async (req: Request, res: Response) => {
    try {
        const armies = await prisma.armies.findMany({
            where: { is_deleted: false},
            orderBy: { name: 'asc' },
            include: { 
                detachments: { 
                    where: { is_deleted: false },
                    orderBy: { name: 'asc' } 
                } 
            }
        })
        res.status(200).json(armies)

    } catch (err) {
        console.log(err)
        res.status(500).json({ errorCode: ERROR_CODES.ARMY_FETCH_ERROR })
    }
}

export const getArmyById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params

    try {
        const army = await prisma.armies.findUnique({
            where: { id: Number(id) },
            include: {
                detachments: true
            }
        })

        if (!army) {
            res.status(404).json({ errorCode: ERROR_CODES.ARMY_NOT_FOUND })
            return
        }

        res.status(200).json(army)
        
    } catch (err) {
        console.log(err)
        res.status(500).json({ errorCode: ERROR_CODES.ARMY_FETCH_ERROR })
    }
}

export const deleteArmyById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params

    try {

        // First delete all detachments linked to this army
        await prisma.detachments.deleteMany({
            where: { army_id: Number(id) }
        })

        // Then delete the army
        const deletedArmy = await prisma.armies.delete({
            where: { id: Number(id) }
        })

        res.status(200).json({ message: 'Deleted', deletedArmy})

    } catch (err: any) {

        console.log(err)

        if (err.code === 'P2025') {
            res.status(404).json({ errorCode: ERROR_CODES.ARMY_NOT_FOUND })
        }

        res.status(500).json({ errorCode: ERROR_CODES.ARMY_DELETE_ERROR })
    }
}

export const softDeleteArmyById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params

    try {

        const existingArmy = await prisma.armies.findUnique({
            where: { id: Number(id) }
        })

        if (!existingArmy) {
            res.status(404).json({ errorCode: ERROR_CODES.ARMY_NOT_FOUND })
            return
        }

        //Soft delete detachments
        await prisma.detachments.updateMany({
            where: { army_id: Number(id) },
            data: { is_deleted: true }
        })

        //Then the army
        const updatedArmy = await prisma.armies.update({
            where: { id: Number(id) },
            data: {
                is_deleted: true
            }
        })

        res.status(200).json({ message: 'Deleted: ', updatedArmy})

    } catch (err: any) {

        console.log(err)
        res.status(500).json({ errorCode: ERROR_CODES.ARMY_DELETE_ERROR })
        
    }
}

export const updateArmyById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params

    try {
        const existingArmy = await prisma.armies.findUnique({
            where: { id: Number(id) },
            include: {
                detachments:true
            }
        })

        if (!existingArmy) {
            res.status(404).json({ errorCode: ERROR_CODES.ARMY_NOT_FOUND })
            return
        }

        const {
            name,
            detachments
        } = req.body

        await prisma.armies.update({
            where: { id: Number(id) },
            data: {
                name
            }
        })

        //Filter detachments that already exist
        const incomingIds = detachments
            .filter((detachment: any) => detachment.id) 
            .map((detachment: any) => detachment.id)

        const existingIds = existingArmy.detachments.map(detachment => detachment.id)    

        //Find and delete detachments that are not in the new "version" of the army
        const idsToDelete = existingIds.filter(id => !incomingIds.includes(id))

        await prisma.detachments.updateMany({
            where: { id: { in: idsToDelete } },
            data: { is_deleted: true }
        })

        //Main part
        await Promise.all(detachments.map(async (detachment: { id?: number, name: string }) => {

            if (detachment.id) {
                // Update existing detachments
                await prisma.detachments.update({
                    where: { id: detachment.id },
                    data: { name: detachment.name }
                })

            } else {
                // Create new detachments
                await prisma.detachments.create({
                    data: {
                        name: detachment.name,
                        army_id: Number(id)
                    }
                })
            }
        }))

        const updatedArmy = await prisma.armies.findUnique({
            where: { id: Number(id) },
            include: { detachments: true }
        })

        res.status(200).json(updatedArmy)

    } catch (err) {
        console.log(err)
        res.status(500).json({ erroCode: ERROR_CODES.ARMY_UPDATE_ERROR })
    }
}