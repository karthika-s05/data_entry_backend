import express from 'express';
import {
  startAssessment,
  getAssessmentById,
  submitAssessment,
  getAllCandidatesAdmin,
  getAllAssessmentsAdmin,
  getAdminReports
} from '../controllers/assessmentController.js';

const router = express.Router();

// Assessment candidate endpoints
router.post('/start', startAssessment);
router.get('/:id', getAssessmentById);
router.post('/:id/submit', submitAssessment);

// Admin endpoints
router.get('/admin/candidates', getAllCandidatesAdmin);
router.get('/admin/assessments', getAllAssessmentsAdmin);
router.get('/admin/reports', getAdminReports);

export default router;
