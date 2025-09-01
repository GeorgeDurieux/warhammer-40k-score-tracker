import { Router } from "express"
import { 
    createMatch, 
    deleteMatchById, 
    getMatchById, 
    getMatches, 
    updateMatchById
} from "../controllers/matchController"

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Matches
 *   description: Endpoints to manage matches
 */

/**
 * @swagger
 * /api/matches:
 *   post:
 *     summary: Create a new match
 *     tags: [Matches]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - user_army_id
 *               - user_detachment_id
 *               - opponent_army_id
 *               - opponent_detachment_id
 *               - date
 *               - user_score
 *               - opponent_score
 *               - user_wtc_score
 *               - opponent_wtc_score
 *               - is_tournament
 *             properties:
 *               user_id:
 *                 type: number
 *               user_army_id:
 *                 type: number
 *               user_detachment_id:
 *                 type: number
 *               opponent_army_id:
 *                 type: number
 *               opponent_detachment_id:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               user_score:
 *                 type: number
 *               opponent_score:
 *                 type: number
 *               user_wtc_score:
 *                 type: number
 *               opponent_wtc_score:
 *                 type: number
 *               is_tournament:
 *                 type: boolean
 *               tournament_name:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Match created successfully
 *       500:
 *         description: Server error
 */
router.post('/', createMatch)

/**
 * @swagger
 * /api/matches:
 *   get:
 *     summary: Get all matches
 *     tags: [Matches]
 *     responses:
 *       200:
 *         description: List of matches
 *       500:
 *         description: Server error
 */
router.get('/', getMatches)

/**
 * @swagger
 * /api/matches/{id}:
 *   get:
 *     summary: Get a match by ID
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Match ID
 *     responses:
 *       200:
 *         description: Match found
 *       404:
 *         description: Match not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getMatchById)

/**
 * @swagger
 * /api/matches/{id}:
 *   delete:
 *     summary: Delete a match by ID
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Match ID
 *     responses:
 *       200:
 *         description: Match deleted
 *       404:
 *         description: Match not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteMatchById)

/**
 * @swagger
 * /api/matches/{id}:
 *   patch:
 *     summary: Update a match by ID
 *     tags: [Matches]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: number
 *               user_army_id:
 *                 type: number
 *               user_detachment_id:
 *                 type: number
 *               opponent_army_id:
 *                 type: number
 *               opponent_detachment_id:
 *                 type: number
 *               date:
 *                 type: string
 *                 format: date
 *               user_score:
 *                 type: number
 *               opponent_score:
 *                 type: number
 *               user_wtc_score:
 *                 type: number
 *               opponent_wtc_score:
 *                 type: number
 *               is_tournament:
 *                 type: boolean
 *               tournament_name:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Match updated successfully
 *       404:
 *         description: Match not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', updateMatchById)

export default router