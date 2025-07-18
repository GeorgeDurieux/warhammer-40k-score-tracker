import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const createArmy = async (req: Request, res: Response) => {
    try {
        const {
            name
        } = req.body

        const newArmy = await prisma.armies.create({
            data: {
                name
            }
        })
        res.status(201).json(newArmy)

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'Internal server error' })
    }
}

export const getArmies = async (req: Request, res: Response) => {
    try {
        const armies = await prisma.armies.findMany({
            orderBy: { name: 'asc' },
            include: { detachments: { orderBy: { name: 'asc' } } }
        })
        res.status(200).json(armies)

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'Failed to fetch armies' })
    }
}

export const getArmyById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params

    try {
        const army = await prisma.armies.findUnique({
            where: { id: Number(id) }
        })

        if (!army) {
            res.status(404).json({ err: 'Army not found' })
            return
        }

        res.status(200).json(army)
    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'Failed to retrieve army' })
    }
}

export const deleteArmyById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params

    try {
        const deletedArmy = await prisma.armies.delete({
            where: { id: Number(id) }
        })

        res.status(200).json({ message: 'Deleted', deletedArmy})

    } catch (err: any) {
        console.log(err)
        if (err.code === 'P2025') {
            res.status(404).json({ err: 'Detachment not found' })
        }
        res.status(500).json({ err: 'Failed to delete army' })
    }
}

export const updateArmyById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params

    try {
        const existingArmy = await prisma.armies.findUnique({
            where: { id: Number(id) }
        })

        if (!existingArmy) {
            res.status(404).json({ err: 'Army not found' })
            return
        }

        const {
            name
        } = req.body

        const updatedArmy = await prisma.armies.update({
            where: { id: Number(id) },
            data: {
                name
            }
        })

        res.status(200).json(updatedArmy)

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'Failed to update army' })
    }
}