import express from 'express';
import {
  getAllCandidatesAdmin,
  getAllAssessmentsAdmin,
  getAdminReports
} from '../controllers/assessmentController.js';

const router = express.Router();

router.get('/candidates', getAllCandidatesAdmin);
router.get('/assessments', getAllAssessmentsAdmin);
router.get('/reports', getAdminReports);

export default router;
