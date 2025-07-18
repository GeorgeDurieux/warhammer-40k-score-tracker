import { Router } from "express";
import { 
    createArmy, 
    deleteArmyById, 
    getArmies, 
    getArmyById, 
    updateArmyById 
} from "../controllers/armyController";

const router = Router()

router.post('/', createArmy)
router.get('/', getArmies)
router.get('/:id', getArmyById)
router.delete('/:id', deleteArmyById)
router.patch('/:id', updateArmyById)

export default router