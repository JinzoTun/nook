import express from 'express';
import { createDen, getDenById, updateDen, deleteDen, getAllDens, joinDen } from '../controllers/denController.js';
import { protectRoute } from '../middlewares/authMiddlware.js'; // Assuming you have auth middleware

const router = express.Router();

router.post('/dens', protectRoute, createDen);
router.get('/dens/:denId', getDenById);
router.put('/dens/:denId', protectRoute, updateDen);
router.delete('/dens/:denId', protectRoute, deleteDen);
router.get('/dens', getAllDens);
// Route to join a Den
router.post('/dens/:denId/join', protectRoute, joinDen);
  
export default router;
