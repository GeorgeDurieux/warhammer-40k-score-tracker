import { Request, Response } from "express"
import prisma from '../prisma'
import { ERROR_CODES } from '../constants/errorCodes'
import logger from '../logger/logger'

export const createDetachment = async (req: Request, res: Response) => {
    const { name, armyId } = req.body
    logger.info(`[CREATE DETACHMENT] Creating detachment: ${name} for armyId: ${armyId}`)

    try {
        const newDetachment = await prisma.detachment.create({
            data: { name, army: { connect: { id: Number(armyId) } } }
        })

        logger.info(`[CREATE DETACHMENT] Detachment created with id: ${newDetachment.id}`)
        res.status(201).json(newDetachment)
    } catch (err) {
        logger.error(`[CREATE DETACHMENT] Error: ${err}`)
        res.status(500).json({ errorCode: ERROR_CODES.DETACHMENT_CREATE_ERROR })
    }
}

export const getDetachments = async (req: Request, res: Response) => {
    logger.info('[GET DETACHMENTS] Fetching all detachments')
    try {
        const detachments = await prisma.detachment.findMany({
            where: { isDeleted: false },
            orderBy: { name: 'desc' }
        })
        logger.info(`[GET DETACHMENTS] Retrieved ${detachments.length} detachments`)
        res.status(200).json(detachments)
    } catch (err) {
        logger.error(`[GET DETACHMENTS] Error: ${err}`)
        res.status(500).json({ errorCode: ERROR_CODES.DETACHMENT_FETCH_ERROR })
    }
}

export const getDetachmentById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    logger.info(`[GET DETACHMENT] Fetching detachment by id: ${id}`)
    try {
        const detachment = await prisma.detachment.findUnique({ where: { id: Number(id) } })
        if (!detachment) {
            logger.warn(`[GET DETACHMENT] Detachment not found: ${id}`)
            res.status(404).json({ errorCode: ERROR_CODES.DETACHMENT_NOT_FOUND })
            return
        }
        res.status(200).json(detachment)
    } catch (err) {
        logger.error(`[GET DETACHMENT] Error: ${err}`)
        res.status(500).json({ errorCode: ERROR_CODES.DETACHMENT_FETCH_ERROR })
    }
}

export const deleteDetachmentById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    logger.info(`[DELETE DETACHMENT] Deleting detachment by id: ${id}`)
    try {
        await prisma.detachment.delete({ where: { id: Number(id) } })
        logger.info(`[DELETE DETACHMENT] Detachment deleted: ${id}`)
        res.status(200).json({ message: 'Deleted' })
    } catch (err: any) {
        logger.error(`[DELETE DETACHMENT] Error: ${err}`)
        if (err.code === 'P2025') {
            res.status(404).json({ errorCode: ERROR_CODES.DETACHMENT_NOT_FOUND })
            return
        }
        res.status(500).json({ errorCode: ERROR_CODES.DETACHMENT_DELETE_ERROR })
    }
}

export const updateDetachmentById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    logger.info(`[UPDATE DETACHMENT] Updating detachment by id: ${id}`)

    try {
        const existingDetachment = await prisma.detachment.findUnique({ where: { id: Number(id) } })
        if (!existingDetachment) {
            logger.warn(`[UPDATE DETACHMENT] Detachment not found: ${id}`)
            res.status(404).json({ errorCode: ERROR_CODES.DETACHMENT_NOT_FOUND })
            return
        }

        const { name } = req.body
        const updatedDetachment = await prisma.detachment.update({
            where: { id: Number(id) },
            data: { name }
        })

        logger.info(`[UPDATE DETACHMENT] Detachment updated: ${id}`)
        res.status(200).json(updatedDetachment)
    } catch (err) {
        logger.error(`[UPDATE DETACHMENT] Error: ${err}`)
        res.status(500).json({ errorCode: ERROR_CODES.DETACHMENT_UPDATE_ERROR })
    }
}

export const softDeleteDetachmentById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    logger.info(`[SOFT DELETE DETACHMENT] Soft deleting detachment by id: ${id}`)

    try {
        const existingDetachment = await prisma.detachment.findUnique({ where: { id: Number(id) } })
        if (!existingDetachment) {
            logger.warn(`[SOFT DELETE DETACHMENT] Detachment not found: ${id}`)
            res.status(404).json({ errorCode: ERROR_CODES.DETACHMENT_NOT_FOUND })
            return
        }

        const updatedDetachment = await prisma.detachment.update({
            where: { id: Number(id) },
            data: { isDeleted: true }
        })

        logger.info(`[SOFT DELETE DETACHMENT] Detachment soft deleted: ${id}`)
        res.status(200).json(updatedDetachment)
    } catch (err) {
        logger.error(`[SOFT DELETE DETACHMENT] Error: ${err}`)
        res.status(500).json({ errorCode: ERROR_CODES.DETACHMENT_DELETE_ERROR })
    }
}

export const getDetachmentByArmy = async (req: Request, res: Response): Promise<void> => {
    const { armyId } = req.params
    logger.info(`[GET DETACHMENT BY ARMY] Fetching detachments for armyId: ${armyId}`)

    try {
        const detachments = await prisma.detachment.findMany({
            where: { armyId: Number(armyId), isDeleted: false },
            orderBy: { name: 'desc' }
        })

        logger.info(`[GET DETACHMENT BY ARMY] Found ${detachments.length} detachments for armyId: ${armyId}`)
        res.status(200).json(detachments)
        
    } catch (err) {
        logger.error(`[GET DETACHMENT BY ARMY] Error: ${err}`)
        res.status(500).json({ errorCode: ERROR_CODES.DETACHMENT_FETCH_ERROR })
    }
}
