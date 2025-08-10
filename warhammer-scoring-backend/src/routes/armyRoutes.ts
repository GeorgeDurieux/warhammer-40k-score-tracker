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

router.post('/', createArmy)
router.get('/', getArmies)
router.get('/:id', getArmyById)
router.delete('/:id', deleteArmyById)
router.patch('/:id', updateArmyById)
router.patch('/soft/:id', softDeleteArmyById)

export default router