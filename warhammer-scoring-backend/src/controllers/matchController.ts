import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const createMatch = async (req: Request, res: Response) => {

    try {
        const {
            userArmy,
            userDetachment,
            opponentArmy,
            opponentDetachment,
            date,
            userScore,
            opponentScore,
            isTournament,
            tournamentName
        } = req.body

        const newMatch = await prisma.match.create({
            data: {
                userArmy,
                userDetachment,
                opponentArmy,
                opponentDetachment,
                date: new Date(date),
                userScore,
                opponentScore,
                isTournament,
                tournamentName: isTournament ? tournamentName : null
            }
        })

        res.status(201).json(newMatch)

    } catch(err) {
        console.log(err)
        res.status(500).json({ err: 'Internal server error' })
    }
}

export const getMatches = async (req: Request, res: Response) => {

    try {
        const matches = await prisma.match.findMany({
            orderBy: { date: 'desc' }
        })
        res.status(200).json(matches)

    } catch(err) {        
        console.log(err)
        res.status(500).json({ err: 'Failed to fetch matches' })
    }
}

export const getMatchById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params

    try { 
        const match = await prisma.match.findUnique({
            where: { id: Number(id) }
        })

        if (!match) {
            res.status(404).json({ err: 'Match not found' })
        }

        res.status(200).json(match)

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'Failed to retrieve match' })
    }       
}

export const deleteMatchById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params

    try {
        const deletedMatch = await prisma.match.delete({
            where: { id: Number(id) }
        })

        res.status(200).json({ message: 'Deleted', deletedMatch})

    } catch (err: any) {
        console.log(err)
        if (err.code === 'P2025') {
            res.status(404).json({ err: 'Match not found' })
        }
        res.status(500).json({ err: 'Failed to delete match' })
    }
}

export const updateMatchById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params

    try {
        const existingMatch = await prisma.match.findUnique({
            where: { id: Number(id) }
        })

        if (!existingMatch) {
            res.status(404).json({ err: 'Match not found' })
        }

        const {
            userArmy,
            userDetachment,
            opponentArmy,
            opponentDetachment,
            date,
            userScore,
            opponentScore,
            isTournament,
            tournamentName
        } = req.body

        const updatedMatch = await prisma.match.update({
            where: { id: Number(id) },
            data: {
                userArmy,
                userDetachment,
                opponentArmy,
                opponentDetachment,
                date: new Date(date),
                userScore,
                opponentScore,
                isTournament,
                tournamentName: isTournament ? tournamentName : null
            }
        })

        res.status(200).json(updatedMatch)

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'Failed to update match' })
    }
}