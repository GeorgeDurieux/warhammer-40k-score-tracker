import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const createMatch = async (req: Request, res: Response) => {

    try {
        const {
            user_id,
            user_army_id,
            user_detachment_id,
            opponent_army_id,
            opponent_detachment_id,
            date,
            user_score,
            opponent_score,
            user_wtc_score,
            opponent_wtc_score,
            is_tournament,
            tournament_name
        } = req.body

        const newMatch = await prisma.games.create({
            data: {
                user_id,
                user_army_id,
                user_detachment_id,
                opponent_army_id,
                opponent_detachment_id,
                date: new Date(date),
                user_score,
                opponent_score,
                user_wtc_score,
                opponent_wtc_score,
                is_tournament,
                tournament_name: is_tournament ? tournament_name : null
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
        const matches = await prisma.games.findMany({
            orderBy: [{ date: 'desc' }, { id: 'desc' }],
            include: {
                armies_games_user_army_idToarmies: true,
                armies_games_opponent_army_idToarmies: true,
                detachments_games_user_detachment_idTodetachments: true,
                detachments_games_opponent_detachment_idTodetachments: true,
            }
        })

        const formattedGames = matches.map(match => ({

            //Game table stats
            id: match.id,
            date: match.date,
            is_tournament: match.is_tournament,
            tournament_name: match.tournament_name,
            user_score: match.user_score,
            opponent_score: match.opponent_score,
            user_wtc_score: match.user_wtc_score,
            opponent_wtc_score: match.opponent_wtc_score,

            //Armies / Detachments tables stats - Rename
            user_army: match.armies_games_user_army_idToarmies,
            opponent_army: match.armies_games_opponent_army_idToarmies,
            user_detachment: match.detachments_games_user_detachment_idTodetachments,
            opponent_detachment: match.detachments_games_opponent_detachment_idTodetachments
        }))
        res.status(200).json(formattedGames)

    } catch(err) {        
        console.log(err)
        res.status(500).json({ err: 'Failed to fetch matches' })
    }
}

export const getMatchById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params

    try { 
        const match = await prisma.games.findUnique({
            where: { id: Number(id) },
            include: {
                armies_games_user_army_idToarmies: true,
                armies_games_opponent_army_idToarmies: true,
                detachments_games_user_detachment_idTodetachments: true,
                detachments_games_opponent_detachment_idTodetachments: true,
            }
        })      

        if (!match) {
            res.status(404).json({ err: 'Match not found' })
            return
        }

        const formattedMatch = {

            //Game table stats
            id: match.id,
            date: match.date,
            is_tournament: match.is_tournament,
            tournament_name: match.tournament_name,
            user_score: match.user_score,
            opponent_score: match.opponent_score,
            user_wtc_score: match.user_wtc_score,
            opponent_wtc_score: match.opponent_wtc_score,

            //Armies / Detachments tables stats - Rename
            user_army: match.armies_games_user_army_idToarmies,
            opponent_army: match.armies_games_opponent_army_idToarmies,
            user_detachment: match.detachments_games_user_detachment_idTodetachments,
            opponent_detachment: match.detachments_games_opponent_detachment_idTodetachments
        }

        res.status(200).json(formattedMatch)

    } catch (err) { 
        console.log(err)
        res.status(500).json({ err: 'Failed to retrieve match' })
    }       
}

export const deleteMatchById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params

    try {
        const deletedMatch = await prisma.games.delete({
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
        const existingMatch = await prisma.games.findUnique({
            where: { id: Number(id) }
        })

        if (!existingMatch) {
            res.status(404).json({ err: 'Match not found' })
        }

        const {
            user_id,
            user_army_id,
            user_detachment_id,
            opponent_army_id,
            opponent_detachment_id,
            date,
            user_score,
            opponent_score,
            user_wtc_score,
            opponent_wtc_score,
            is_tournament,
            tournament_name
        } = req.body

        const updatedMatch = await prisma.games.update({
            where: { id: Number(id) },
            data: {
                user_id,
                user_army_id,
                user_detachment_id,
                opponent_army_id,
                opponent_detachment_id,
                date: new Date(date),
                user_score,
                opponent_score,
                user_wtc_score,
                opponent_wtc_score,
                is_tournament,
                tournament_name: is_tournament ? tournament_name : null
            }
        })

        res.status(200).json(updatedMatch)

    } catch (err) {
        console.log(err)
        res.status(500).json({ err: 'Failed to update match' })
    }
}