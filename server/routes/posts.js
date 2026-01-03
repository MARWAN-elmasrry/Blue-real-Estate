import express from 'express';
import { 
  addBuilding,
  getAllBuildings,
  getBuildingById,
  updateApartment,
  triggerRentUpdate, 
  clearApartment
} from '../controller/build.cont.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// CREATE - Add new building with apartments (Protected)
router.post('/', protect, addBuilding);

// READ - Get all buildings (Protected)
router.get('/', protect, getAllBuildings);

// READ - Get single building by ID (Protected)
router.get('/:id', protect, getBuildingById);

// UPDATE - Update specific apartment by apartment number (Protected)
router.put('/:id/apartments/:apartmentNumber', protect, updateApartment);
// In your routes file
router.delete('/:id/apartments/:apartmentNumber', protect , clearApartment);

router.post('/trigger-rent-update', triggerRentUpdate);

export default router;