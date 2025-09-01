import { Router } from "express";
import { 
    createArmy, 
    deleteArmyById, 
    getArmies, 
    getArmyById, 
    softDeleteArmyById, 
    updateArmyById 
} from "../controllers/armyController";

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Armies
 *   description: API to manage armies
 */

/**
 * @swagger
 * /armies:
 *   post:
 *     summary: Create a new army
 *     tags: [Armies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Space Marines
 *               detachments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                       example: Gladius Task Force
 *     responses:
 *       201:
 *         description: Army created successfully
 *       500:
 *         description: Failed to create army
 */
router.post('/', createArmy)

/**
 * @swagger
 * /armies:
 *   get:
 *     summary: Get all armies
 *     tags: [Armies]
 *     responses:
 *       200:
 *         description: List of armies
 *       500:
 *         description: Failed to fetch armies
 */
router.get('/', getArmies)

/**
 * @swagger
 * /armies/{id}:
 *   get:
 *     summary: Get army by ID
 *     tags: [Armies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Army ID
 *     responses:
 *       200:
 *         description: Army object
 *       404:
 *         description: Army not found
 *       500:
 *         description: Failed to fetch army
 */
router.get('/:id', getArmyById)

/**
 * @swagger
 * /armies/{id}:
 *   delete:
 *     summary: Permanently delete an army
 *     tags: [Armies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Army ID
 *     responses:
 *       200:
 *         description: Army deleted successfully
 *       404:
 *         description: Army not found
 *       500:
 *         description: Failed to delete army
 */
router.delete('/:id', deleteArmyById)

/**
 * @swagger
 * /armies/{id}:
 *   patch:
 *     summary: Update an army and its detachments
 *     tags: [Armies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Army ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Space Marines
 *               detachments:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       description: Existing detachment ID (optional for new detachments)
 *                     name:
 *                       type: string
 *                       example: Gladius Task Force
 *     responses:
 *       200:
 *         description: Army updated successfully
 *       404:
 *         description: Army not found
 *       500:
 *         description: Failed to update army
 */
router.patch('/:id', updateArmyById)

/**
 * @swagger
 * /armies/soft/{id}:
 *   patch:
 *     summary: Soft delete an army
 *     tags: [Armies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Army ID
 *     responses:
 *       200:
 *         description: Army soft deleted successfully
 *       404:
 *         description: Army not found
 *       500:
 *         description: Failed to soft delete army
 */
router.patch('/soft/:id', softDeleteArmyById)

export default router