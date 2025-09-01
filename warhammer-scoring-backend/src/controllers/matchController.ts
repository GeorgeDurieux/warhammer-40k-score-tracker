import { Request, Response } from "express"
import prisma from '../prisma'
import { ERROR_CODES } from '../constants/errorCodes'
import logger from '../logger/logger'

export const createMatch = async (req: Request, res: Response) => {
    logger.info('[CREATE MATCH] Creating new match')

    try {
        const {
            userId,
            userArmyId,
            userDetachmentId,
            opponentArmyId,
            opponentDetachmentId,
            date,
            userScore,
            opponentScore,
            userWtcScore,
            opponentWtcScore,
            isTournament,
            tournamentName
        } = req.body

        const newMatch = await prisma.game.create({
            data: {
                userId,
                userArmyId,
                userDetachmentId,
                opponentArmyId,
                opponentDetachmentId,
                date: new Date(date),
                userScore,
                opponentScore,
                userWtcScore,
                opponentWtcScore,
                isTournament,
                tournamentName: isTournament ? tournamentName : null
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
        const matches = await prisma.game.findMany({
            orderBy: [{ date: 'desc' }, { id: 'desc' }],
            include: {
                userArmy: true,
                opponentArmy: true,
                userDetachment: true,
                opponentDetachment: true,
            }
        })

        const formattedGames = matches.map(match => ({
            id: match.id,
            date: match.date,
            isTournament: match.isTournament,
            tournamentName: match.tournamentName,
            userScore: match.userScore,
            opponentScore: match.opponentScore,
            userWtcScore: match.userWtcScore,
            opponentWtcScore: match.opponentWtcScore,
            userArmy: match.userArmy,
            opponentArmy: match.opponentArmy,
            userDetachment: match.userDetachment,
            opponentDetachment: match.opponentDetachment
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
        const match = await prisma.game.findUnique({
            where: { id: Number(id) },
            include: {
                userArmy: true,
                opponentArmy: true,
                userDetachment: true,
                opponentDetachment: true,
            }
        })

        if (!match) {
            logger.warn(`[GET MATCH] Match not found: ${id}`)
            res.status(404).json({ errorCode: ERROR_CODES.MATCH_NOT_FOUND })
            return
        }

        const formattedMatch = {
            id: match.id,
            date: match.date,
            isTournament: match.isTournament,
            tournamentName: match.tournamentName,
            userScore: match.userScore,
            opponentScore: match.opponentScore,
            userWtcScore: match.userWtcScore,
            opponentWtcScore: match.opponentWtcScore,
            userArmy: match.userArmy,
            opponentArmy: match.opponentArmy,
            userDetachment: match.userDetachment,
            opponentDetachment: match.opponentDetachment
        }

        logger.info(`[GET MATCH] Match found: ${id}`)
        res.status(200).json(formattedMatch)

    } catch (err) {
        logger.error(`[GET MATCH] Error: ${err}`)
        res.status(500).json({ errorCode: ERROR_CODES.MATCH_FETCH_FAILED })
    }
}

export const deleteMatchById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    logger.info(`[DELETE MATCH] Deleting match by id: ${id}`)

    try {
        const deletedMatch = await prisma.game.delete({
            where: { id: Number(id) }
        })

        logger.info(`[DELETE MATCH] Match deleted: ${id}`)
        res.status(200).json({ message: 'Deleted', deletedMatch })

    } catch (err: any) {
        if (err.code === 'P2025') {
            logger.warn(`[DELETE MATCH] Match not found: ${err}`)
            res.status(404).json({ errorCode: ERROR_CODES.MATCH_NOT_FOUND })
            return
        }
        logger.error(`[DELETE MATCH] Error: ${err}`)
        res.status(500).json({ errorCode: ERROR_CODES.MATCH_DELETE_FAILED })
    }
}

export const updateMatchById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
    logger.info(`[UPDATE MATCH] Updating match by id: ${id}`)

    try {
        const existingMatch = await prisma.game.findUnique({
            where: { id: Number(id) }
        })

        if (!existingMatch) {
            logger.warn(`[UPDATE MATCH] Match not found: ${id}`)
            res.status(404).json({ errorCode: ERROR_CODES.MATCH_NOT_FOUND })
            return
        }

        const {
            userId,
            userArmyId,
            userDetachmentId,
            opponentArmyId,
            opponentDetachmentId,
            date,
            userScore,
            opponentScore,
            userWtcScore,
            opponentWtcScore,
            isTournament,
            tournamentName
        } = req.body

        const updatedMatch = await prisma.game.update({
            where: { id: Number(id) },
            data: {
                userId,
                userArmyId,
                userDetachmentId,
                opponentArmyId,
                opponentDetachmentId,
                date: new Date(date),
                userScore,
                opponentScore,
                userWtcScore,
                opponentWtcScore,
                isTournament,
                tournamentName: isTournament ? tournamentName : null
            }
        })

        logger.info(`[UPDATE MATCH] Match updated: ${id}`)
        res.status(200).json(updatedMatch)

    } catch (err) {
        logger.error(`[UPDATE MATCH] Error: ${err}`)
        res.status(500).json({ errorCode: ERROR_CODES.MATCH_UPDATE_FAILED })
    }
}
