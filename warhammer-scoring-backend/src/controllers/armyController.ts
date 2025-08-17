import { Request, Response } from "express"
import prisma from '../prisma'
import logger from '../logger/logger'
import { ERROR_CODES } from '../constants/errorCodes'

export const createArmy = async (req: Request, res: Response) => {
    try {
        const { name, detachments } = req.body
        logger.info(`[CREATE_ARMY] Creating new army: ${name} with detachments: ${JSON.stringify(detachments)}`)

        const newArmy = await prisma.armies.create({
            data: {
                name,
                detachments: {
                    create: detachments.map((d: string) => ({ name: d }))
                }
            },
            include: { detachments: true }
        })

        logger.info(`[CREATE_ARMY] Army created successfully: ${newArmy.id}`)
        res.status(201).json(newArmy)

    } catch (err) {
        logger.error(`[CREATE_ARMY] Failed to create army: ${err}`, { requestBody: req.body })
        res.status(500).json({ errorCode: ERROR_CODES.ARMY_CREATE_ERROR })
    }
}

export const getArmies = async (req: Request, res: Response) => {
    try {
        const armies = await prisma.armies.findMany({
            where: { is_deleted: false },
            orderBy: { name: 'asc' },
            include: { detachments: { where: { is_deleted: false }, orderBy: { name: 'asc' } } }
        })

        logger.info(`[GET_ARMIES] Fetched ${armies.length} armies`)
        res.status(200).json(armies)

    } catch (err) {
        logger.error(`[GET_ARMIES] Failed to fetch armies: ${err}`)
        res.status(500).json({ errorCode: ERROR_CODES.ARMY_FETCH_ERROR })
    }
}

export const getArmyById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        const army = await prisma.armies.findUnique({
            where: { id: Number(id) },
            include: { detachments: true }
        })

        if (!army) {
            logger.warn(`[GET_ARMY_BY_ID] Army not found: ${id}`)
            res.status(404).json({ errorCode: ERROR_CODES.ARMY_NOT_FOUND })
            return
        }

        logger.info(`[GET_ARMY_BY_ID] Fetched army by id: ${id}`)
        res.status(200).json(army)

    } catch (err) {
        logger.error(`[GET_ARMY_BY_ID] Failed to fetch army ${id}: ${err}`)
        res.status(500).json({ errorCode: ERROR_CODES.ARMY_FETCH_ERROR })
    }
}

export const deleteArmyById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        logger.info(`[DELETE_ARMY_BY_ID] Deleting army with id: ${id}`)

        await prisma.detachments.deleteMany({ where: { army_id: Number(id) } })
        const deletedArmy = await prisma.armies.delete({ where: { id: Number(id) } })

        logger.info(`[DELETE_ARMY_BY_ID] Army deleted successfully: ${id}`)
        res.status(200).json({ message: 'Deleted', deletedArmy })

    } catch (err: any) {
        logger.error(`[DELETE_ARMY_BY_ID] Failed to delete army ${id}: ${err}`)

        if (err.code === 'P2025') {
            res.status(404).json({ errorCode: ERROR_CODES.ARMY_NOT_FOUND })
            return
        }

        res.status(500).json({ errorCode: ERROR_CODES.ARMY_DELETE_ERROR })
    }
}

export const softDeleteArmyById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        logger.info(`[SOFT_DELETE_ARMY_BY_ID] Soft deleting army with id: ${id}`)

        const existingArmy = await prisma.armies.findUnique({ where: { id: Number(id) } })
        if (!existingArmy) {
            logger.warn(`[SOFT_DELETE_ARMY_BY_ID] Army not found for soft delete: ${id}`)
            res.status(404).json({ errorCode: ERROR_CODES.ARMY_NOT_FOUND })
            return
        }

        await prisma.detachments.updateMany({
            where: { army_id: Number(id) },
            data: { is_deleted: true }
        })

        const updatedArmy = await prisma.armies.update({
            where: { id: Number(id) },
            data: { is_deleted: true }
        })

        logger.info(`[SOFT_DELETE_ARMY_BY_ID] Army soft deleted successfully: ${id}`)
        res.status(200).json({ message: 'Deleted', updatedArmy })

    } catch (err: any) {
        logger.error(`[SOFT_DELETE_ARMY_BY_ID] Failed to soft delete army ${id}: ${err}`)
        res.status(500).json({ errorCode: ERROR_CODES.ARMY_DELETE_ERROR })
    }
}

export const updateArmyById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    try {
        logger.info(`[UPDATE_ARMY_BY_ID] Updating army with id: ${id}`, { requestBody: req.body })

        const existingArmy = await prisma.armies.findUnique({
            where: { id: Number(id) },
            include: { detachments: true }
        })

        if (!existingArmy) {
            logger.warn(`[UPDATE_ARMY_BY_ID] Army not found for update: ${id}`)
            res.status(404).json({ errorCode: ERROR_CODES.ARMY_NOT_FOUND })
            return
        }

        const { name, detachments } = req.body
        await prisma.armies.update({ where: { id: Number(id) }, data: { name } })

        const incomingIds = detachments.filter((d: any) => d.id).map((d: any) => d.id)
        const existingIds = existingArmy.detachments.map(d => d.id)
        const idsToDelete = existingIds.filter(i => !incomingIds.includes(i))

        await prisma.detachments.updateMany({ where: { id: { in: idsToDelete } }, data: { is_deleted: true } })

        await Promise.all(detachments.map(async (detachment: { id?: number, name: string }) => {
            if (detachment.id) {
                await prisma.detachments.update({ where: { id: detachment.id }, data: { name: detachment.name } })
            } else {
                await prisma.detachments.create({ data: { name: detachment.name, army_id: Number(id) } })
            }
        }))

        const updatedArmy = await prisma.armies.findUnique({
            where: { id: Number(id) },
            include: { detachments: true }
        })

        logger.info(`[UPDATE_ARMY_BY_ID] Army updated successfully: ${id}`)
        res.status(200).json(updatedArmy)

    } catch (err) {
        logger.error(`[UPDATE_ARMY_BY_ID] Failed to update army ${id}: ${err}`)
        res.status(500).json({ errorCode: ERROR_CODES.ARMY_UPDATE_ERROR })
    }
}
