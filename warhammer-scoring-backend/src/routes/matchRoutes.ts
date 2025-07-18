import { Router } from "express"
import { 
    createMatch, 
    deleteMatchById, 
    getMatchById, 
    getMatches, 
    updateMatchById
} from "../controllers/matchController"

const router = Router()

router.post('/', createMatch)
router.get('/', getMatches)
router.get('/:id', getMatchById)
router.delete('/:id', deleteMatchById)
router.patch('/:id', updateMatchById)

export default router