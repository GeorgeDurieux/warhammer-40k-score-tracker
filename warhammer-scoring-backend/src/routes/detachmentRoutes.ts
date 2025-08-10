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

router.post('/', createDetachment)
router.get('/', getDetachments)
router.get('/:id', getDetachmentById)
router.delete('/:id', deleteDetachmentById)
router.patch('/:id', updateDetachmentById)
router.patch('/soft/:id', softDeleteDetachmentById)
router.get('/army/:armyId', getDetachmentByArmy)

export default router