import Assessment from '../models/Assessment.js';
import Candidate from '../models/Candidate.js';
import { getRandomAssessmentParagraphFromDB, processAssessmentSubmission, DEFAULT_ASSESSMENT_PARAGRAPH } from '../services/assessmentService.js';

/**
 * @desc    Start an assessment session
 * @route   POST /api/assessments/start
 * @access  Public
 */
export const startAssessment = async (req, res, next) => {
  try {
    const { candidateId } = req.body;

    if (!candidateId) {
      return res.status(400).json({
        success: false,
        message: 'Candidate ID is required to start assessment.'
      });
    }

    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found.'
      });
    }

    if (candidate.assessmentStatus === 'SUBMITTED' || candidate.assessmentStatus === 'COMPLETED') {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this assessment.'
      });
    }

    // Check for an existing in-progress assessment
    let existingAssessment = await Assessment.findOne({
      candidateId,
      status: 'IN_PROGRESS'
    });

    if (existingAssessment) {
      return res.status(200).json({
        success: true,
        message: 'Assessment already in progress',
        assessmentId: existingAssessment._id,
        startTime: existingAssessment.startTime,
        paragraph: existingAssessment.paragraph,
        paragraphTitle: existingAssessment.paragraphTitle || 'Typing Assessment',
        candidateName: candidate.name
      });
    }

    // Select random paragraph with title directly from MongoDB
    const selectedParagraph = await getRandomAssessmentParagraphFromDB();

    // Create new assessment session
    const startTime = new Date();
    const newAssessment = await Assessment.create({
      candidateId,
      paragraph: selectedParagraph.content,
      paragraphTitle: selectedParagraph.title,
      paragraphId: selectedParagraph.id,
      startTime,
      status: 'IN_PROGRESS'
    });

    // Update candidate status
    candidate.assessmentStatus = 'IN_PROGRESS';
    await candidate.save();

    return res.status(201).json({
      success: true,
      message: 'Assessment started successfully',
      assessmentId: newAssessment._id,
      startTime: newAssessment.startTime,
      paragraph: newAssessment.paragraph,
      paragraphTitle: newAssessment.paragraphTitle,
      candidateName: candidate.name
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get assessment session by ID
 * @route   GET /api/assessments/:id
 * @access  Public
 */
export const getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id).populate('candidateId', 'name email contactNo assessmentStatus');

    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment record not found.'
      });
    }

    return res.status(200).json({
      success: true,
      assessment
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Submit assessment
 * @route   POST /api/assessments/:id/submit
 * @access  Public
 */
export const submitAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { candidateId, typedText = '', autoSubmitted = false } = req.body;

    let targetAssessmentId = id;
    if (!targetAssessmentId || targetAssessmentId === 'undefined' || targetAssessmentId === 'null') {
      if (candidateId) {
        const activeAss = await Assessment.findOne({ candidateId, status: { $ne: 'SUBMITTED' } }).sort({ createdAt: -1 });
        if (activeAss) targetAssessmentId = activeAss._id;
      }
    }

    const assessment = await Assessment.findById(targetAssessmentId);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        message: 'Assessment session not found.'
      });
    }

    if (assessment.status === 'SUBMITTED') {
      return res.status(400).json({
        success: false,
        message: 'Assessment has already been submitted.'
      });
    }

    // Process timing and stats securely on backend
    const submissionTime = new Date();
    const calculatedStats = processAssessmentSubmission({
      startTime: assessment.startTime || new Date(),
      submittedAt: submissionTime,
      typedText,
      targetParagraph: assessment.paragraph || DEFAULT_ASSESSMENT_PARAGRAPH
    });

    // Update Assessment record
    assessment.endTime = calculatedStats.endTime;
    assessment.durationSeconds = calculatedStats.durationSeconds;
    assessment.typedText = calculatedStats.typedText;
    assessment.wordCount = calculatedStats.wordCount;
    assessment.characterCount = calculatedStats.characterCount;
    assessment.wpm = calculatedStats.wpm;
    assessment.lpm = calculatedStats.lpm;
    assessment.averageLpm = calculatedStats.averageLpm;
    assessment.minuteStats = calculatedStats.minuteStats;
    assessment.accuracy = calculatedStats.accuracy;
    assessment.autoSubmitted = Boolean(autoSubmitted);
    assessment.status = 'SUBMITTED';
    assessment.submittedAt = submissionTime;
    assessment.submittedAt = submissionTime;

    await assessment.save();

    // Update Candidate status
    if (candidateId || assessment.candidateId) {
      const cId = candidateId || assessment.candidateId;
      await Candidate.findByIdAndUpdate(cId, { assessmentStatus: 'SUBMITTED' });
    }

    return res.status(200).json({
      success: true,
      message: 'Assessment submitted successfully.',
      assessment: {
        id: assessment._id,
        wpm: assessment.wpm,
        lpm: assessment.lpm,
        accuracy: assessment.accuracy,
        wordCount: assessment.wordCount,
        characterCount: assessment.characterCount,
        durationSeconds: assessment.durationSeconds,
        autoSubmitted: assessment.autoSubmitted,
        submittedAt: assessment.submittedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Controllers for Reports and Analytics
 */
export const getAllCandidatesAdmin = async (req, res, next) => {
  try {
    const candidates = await Candidate.find().sort({ createdAt: -1 });
    return res.status(200).json({ success: true, candidates });
  } catch (error) {
    next(error);
  }
};

export const getAllAssessmentsAdmin = async (req, res, next) => {
  try {
    const assessments = await Assessment.find().populate('candidateId').sort({ createdAt: -1 });
    return res.status(200).json({ success: true, assessments });
  } catch (error) {
    next(error);
  }
};

export const getAdminReports = async (req, res, next) => {
  try {
    const totalCandidates = await Candidate.countDocuments();
    const completedCount = await Candidate.countDocuments({ assessmentStatus: 'SUBMITTED' });
    const inProgressCount = await Candidate.countDocuments({ assessmentStatus: 'IN_PROGRESS' });
    
    // Filter assessments with duration >= 5s to avoid test script anomalies
    const validAssessments = await Assessment.find({ status: 'SUBMITTED', durationSeconds: { $gte: 5 } });
    
    const avgWpm = validAssessments.length > 0 
      ? Math.round((validAssessments.reduce((acc, curr) => acc + (curr.wpm || 0), 0) / validAssessments.length) * 10) / 10 
      : 0;

    const avgLpm = validAssessments.length > 0 
      ? Math.round((validAssessments.reduce((acc, curr) => {
          const lpmVal = curr.lpm || (curr.characterCount ? (curr.characterCount / (curr.durationSeconds / 60)) : 0);
          return acc + lpmVal;
        }, 0) / validAssessments.length) * 10) / 10 
      : 0;

    const avgAccuracy = validAssessments.length > 0 
      ? Math.round((validAssessments.reduce((acc, curr) => acc + (curr.accuracy || 0), 0) / validAssessments.length) * 10) / 10 
      : 0;

    return res.status(200).json({
      success: true,
      summary: {
        totalCandidates,
        completedCount,
        inProgressCount,
        avgWpm,
        avgLpm,
        avgAccuracy
      }
    });
  } catch (error) {
    next(error);
  }
};
