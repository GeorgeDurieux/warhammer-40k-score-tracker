import { Router } from "express";
import { 
    createDetachment, 
    deleteDetachmentById, 
    getDetachmentByArmy, 
    getDetachmentById, 
    getDetachments, 
    softDeleteDetachmentById, 
    updateDetachmentById 
} from "../controllers/detachmentController";

const router = Router()

/**
 * @swagger
 * tags:
 *   name: Detachments
 *   description: Endpoints to manage detachments
 */

/**
 * @swagger
 * /api/detachments:
 *   post:
 *     summary: Create a new detachment
 *     tags: [Detachments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - armyId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Gladius Task Force
 *               armyId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Detachment created
 *       500:
 *         description: Server error
 */
router.post('/', createDetachment)

/**
 * @swagger
 * /api/detachments:
 *   get:
 *     summary: Get all detachments
 *     tags: [Detachments]
 *     responses:
 *       200:
 *         description: List of detachments
 *       500:
 *         description: Server error
 */
router.get('/', getDetachments)

/**
 * @swagger
 * /api/detachments/{id}:
 *   get:
 *     summary: Get a detachment by ID
 *     tags: [Detachments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Detachment ID
 *     responses:
 *       200:
 *         description: Detachment found
 *       404:
 *         description: Detachment not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getDetachmentById)

/**
 * @swagger
 * /api/detachments/{id}:
 *   delete:
 *     summary: Delete a detachment
 *     tags: [Detachments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *         description: Detachment ID
 *     responses:
 *       200:
 *         description: Deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', deleteDetachmentById)

/**
 * @swagger
 * /api/detachments/{id}:
 *   patch:
 *     summary: Update a detachment
 *     tags: [Detachments]
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
 *               name:
 *                 type: string
 *                 example: Gladius Task Force
 *     responses:
 *       200:
 *         description: Detachment updated
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.patch('/:id', updateDetachmentById)

/**
 * @swagger
 * /api/detachments/soft/{id}:
 *   patch:
 *     summary: Soft delete a detachment
 *     tags: [Detachments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Detachment soft deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.patch('/soft/:id', softDeleteDetachmentById)

/**
 * @swagger
 * /api/detachments/army/{armyId}:
 *   get:
 *     summary: Get all detachments for a specific army
 *     tags: [Detachments]
 *     parameters:
 *       - in: path
 *         name: armyId
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of detachments for the army
 *       500:
 *         description: Server error
 */
router.get('/army/:armyId', getDetachmentByArmy)

export default router