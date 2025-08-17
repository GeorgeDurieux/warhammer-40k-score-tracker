import { Request, Response } from "express"
import prisma from '../prisma'
import { ERROR_CODES } from '../constants/errorCodes'
import logger from '../logger/logger'

export const createMatch = async (req: Request, res: Response) => {

    logger.info('[CREATE MATCH] Creating new match')

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

        logger.info(`[CREATE MATCH] Match created with id: ${newMatch.id}`)
        res.status(201).json(newMatch)

    } catch(err) {
        logger.error(`[CREATE MATCH] Error: ${err}`)
        res.status(500).json({ errorCode: ERROR_CODES.MATCH_CREATE_FAILED })
    }
}

export const getMatches = async (req: Request, res: Response) => {

    logger.info('[GET MATCHES] Fetching all matches')

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
        logger.info(`[GET MATCHES] Retrieved ${formattedGames.length} matches`)
        res.status(200).json(formattedGames)

    } catch(err) {        
        logger.error(`[GET MATCHES] Error: ${err}`)
        res.status(500).json({ errorCode: ERROR_CODES.MATCH_FETCH_FAILED })
    }
}

export const getMatchById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params
    logger.info(`[GET MATCH] Fetching match by id: ${id}`)

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
            logger.warn(`[GET MATCH] Match not found: ${id}`)
            res.status(404).json({ errorCode: ERROR_CODES.MATCH_NOT_FOUND })
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

        logger.info(`[GET MATCH] Match found: ${id}`)
        res.status(200).json(formattedMatch)

    } catch (err) { 
        logger.error(`[GET MATCH] Error: ${err}`)
        res.status(500).json({ errorCode: ERROR_CODES.ARMY_FETCH_ERROR })
    }       
}

export const deleteMatchById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params
    logger.info(`[DELETE MATCH] Deleting match by id: ${id}`)

    try {
        const deletedMatch = await prisma.games.delete({
            where: { id: Number(id) }
        })

        logger.info(`[DELETE MATCH] Match deleted: ${id}`)
        res.status(200).json({ message: 'Deleted', deletedMatch})

    } catch (err: any) {
        console.log(err)
        if (err.code === 'P2025') {
            logger.warn(`[DELETE MATCH] Match not found: ${err}`)
            res.status(404).json({ errorCode: ERROR_CODES.MATCH_NOT_FOUND })
        }
        logger.error(`[DELETE MATCH] Error: ${err}`)
        res.status(500).json({ errorCode: ERROR_CODES.MATCH_DELETE_FAILED })
    }
}

export const updateMatchById = async (req: Request, res: Response): Promise<void> => {

    const { id } = req.params
    logger.info(`[UPDATE MATCH] Updating match by id: ${id}`)

    try {
        const existingMatch = await prisma.games.findUnique({
            where: { id: Number(id) }
        })

        if (!existingMatch) {
            logger.warn(`[UPDATE MATCH] Match not found: ${id}`)
            res.status(404).json({ errorCode: ERROR_CODES.MATCH_NOT_FOUND })
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

        logger.info(`[UPDATE MATCH] Match updated: ${id}`)
        res.status(200).json(updatedMatch)

    } catch (err) {
        logger.error(`[UPDATE MATCH] Error: ${err}`)
        res.status(500).json({ errorCode: ERROR_CODES.MATCH_UPDATE_FAILED })
    }
}