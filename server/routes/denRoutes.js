import express from 'express';
import multer from '../middlewares/multer.js'; // Import Multer setup
import { protectRoute } from '../middlewares/authMiddlware.js';
import {
    createDen,
    updateDen,
    joinDen,
    leaveDen,
    getDenById,
    getAllDens,
    deleteDen,
} from '../controllers/DenController.js';

const router = express.Router();

// Create a new Den with Multer middleware to handle avatar and banner uploads
router.post(
  '/create-den',
  protectRoute,
  multer.fields([
    { name: 'avatar', maxCount: 1 }, // Handle single avatar upload
    { name: 'banner', maxCount: 1 }, // Handle single banner upload
  ]),
  createDen
);

// Update Den with Multer middleware to handle avatar and banner uploads
router.put(
  '/update-den/:denId',
  protectRoute,
  multer.fields([
    { name: 'avatar', maxCount: 1 }, // Handle single avatar upload
    { name: 'banner', maxCount: 1 }, // Handle single banner upload
  ]),
  updateDen
);

// Other routes for joining, leaving, etc.
router.post('/join-den/:denId', protectRoute, joinDen);
router.post('/leave-den/:denId', protectRoute, leaveDen);
router.get('/dens', getAllDens);
router.get('/den/:denId', getDenById);
router.delete('/den/:denId', protectRoute, deleteDen);

export default router;
