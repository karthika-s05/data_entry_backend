import express from 'express';
import { registerCandidate, getCandidateById } from '../controllers/candidateController.js';

const router = express.Router();

router.post('/register', registerCandidate);
router.get('/:id', getCandidateById);

export default router;
