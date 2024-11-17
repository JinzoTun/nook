import express from 'express';
import { createDen, getDenById, updateDen, deleteDen, getAllDens } from '../controllers/denController.js';
import { protectRoute } from '../middlewares/authMiddlware.js'; // Assuming you have auth middleware

const router = express.Router();

router.post('/dens', protectRoute, createDen);
router.get('/dens/:denId', getDenById);
router.put('/dens/:denId', protectRoute, updateDen);
router.delete('/dens/:denId', protectRoute, deleteDen);
router.get('/dens', getAllDens);

export default router;
