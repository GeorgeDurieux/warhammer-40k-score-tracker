import { Router } from "express";
import { 
    createDetachment, 
    deleteDetachmentById, 
    getDetachmentByArmy, 
    getDetachmentById, 
    getDetachments, 
    updateDetachmentById 
} from "../controllers/detachmentController";

const router = Router()

router.post('/', createDetachment)
router.get('/', getDetachments)
router.get('/:id', getDetachmentById)
router.delete('/:id', deleteDetachmentById)
router.patch('/:id', updateDetachmentById)
router.get('/:armyId', getDetachmentByArmy)

export default router