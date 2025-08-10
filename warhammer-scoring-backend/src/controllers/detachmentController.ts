import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const createDetachment = async (req: Request, res: Response) => {
    try {
        const {
            name,
            armyId
        } = req.body

        const newDetachment = await prisma.detachments.create({
            data: {
                name,
                armies: { connect: { id: Number(armyId) } }
            }
        })
        res.status(201).json(newDetachment)

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'Internal server error' })
    }
}

export const getDetachments = async (req: Request, res: Response) => {
    try {
        const detachments = await prisma.detachments.findMany({
            orderBy: { name: 'desc' }
        })
        res.status(200).json(detachments)

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'Failed to fetch detachments' })
    }
}

export const getDetachmentById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params

    try {
        const detachment = await prisma.detachments.findUnique({
            where: { id: Number(id) }
        })

        if (!detachment) {
            res.status(404).json({ err: 'Detachment not found' })
            return
        }

        res.status(200).json(detachment)
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'Failed to retrieve detachment' })
    }
}

export const deleteDetachmentById = async (req: Request, res: Response): Promise<void> => {

  const { id } = req.params

  try {
    await prisma.detachments.delete({ where: { id: Number(id) } })
    res.status(200).json({ message: 'Deleted' })

  } catch (err: any) {
    console.error(err)
    if (err.code === 'P2025') {
      res.status(404).json({ err: 'Detachment not found' })
    }
    res.status(500).json({ err: 'Failed to delete detachment' })
  }
}

export const updateDetachmentById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params

    try {
        const existingDetachment = await prisma.detachments.findUnique({
            where: { id: Number(id) }
        })

        if (!existingDetachment) {
            res.status(404).json({ err: 'Detachment not found' })
            return
        }

        const {
            name
        } = req.body

        const updatedDetachment = await prisma.detachments.update({
            where: { id: Number(id) },
            data: {
                name
            }
        })

        res.status(200).json(updatedDetachment)

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'Failed to update detachment' })
    }
}

export const softDeleteDetachmentById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params

    try {
        const existingDetachment = await prisma.detachments.findUnique({
            where: { id: Number(id) }
        })

        if (!existingDetachment) {
            res.status(404).json({ err: 'Detachment not found' })
            return
        }

        const updatedDetachment = await prisma.detachments.update({
            where: { id: Number(id) },
            data: {
                is_deleted: true
            }
        })

        res.status(200).json(updatedDetachment)

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'Failed to update detachment' })
    }
}

export const getDetachmentByArmy = async (req: Request, res: Response): Promise<void> => {

    const { armyId } = req.params

    try {
        const army = await prisma.detachments.findMany({
            where: { id: Number(armyId) }
        })

        res.status(200).json(army)

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'Failed to retrieve detachments' })
    }
}