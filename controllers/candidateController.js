import Candidate from '../models/Candidate.js';

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone validation helper (strictly 10 digits)
const isValidPhone = (contactNo) => {
  if (/[a-zA-Z]/.test(contactNo)) return false;
  const digitsOnly = contactNo.replace(/\D/g, '');
  return digitsOnly.length === 10;
};

/**
 * @desc    Register a candidate
 * @route   POST /api/candidates/register
 * @access  Public
 */
export const registerCandidate = async (req, res, next) => {
  try {
    const { name, email, contactNo } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your full name (minimum 2 characters).'
      });
    }

    if (!email || !isValidEmail(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    if (!contactNo || !isValidPhone(contactNo.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid 10-digit contact number.'
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanContact = contactNo.trim();
    const cleanName = name.trim();

    // Check for existing candidate with same email or contact
    let existingCandidate = await Candidate.findOne({
      $or: [{ email: cleanEmail }, { contactNo: cleanContact }]
    });

    if (existingCandidate) {
      if (existingCandidate.assessmentStatus === 'SUBMITTED' || existingCandidate.assessmentStatus === 'COMPLETED') {
        return res.status(400).json({
          success: false,
          message: 'This candidate has already completed the assessment.'
        });
      }

      // Update name/contact if re-registering before assessment start
      existingCandidate.name = cleanName;
      existingCandidate.contactNo = cleanContact;
      existingCandidate.email = cleanEmail;
      await existingCandidate.save();

      return res.status(200).json({
        success: true,
        message: 'Registration restored successfully',
        candidateId: existingCandidate._id,
        assessmentStatus: existingCandidate.assessmentStatus
      });
    }

    // Create new candidate
    const newCandidate = await Candidate.create({
      name: cleanName,
      email: cleanEmail,
      contactNo: cleanContact,
      registeredAt: new Date(),
      assessmentStatus: 'NOT_STARTED'
    });

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      candidateId: newCandidate._id,
      assessmentStatus: newCandidate.assessmentStatus
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get candidate details by ID
 * @route   GET /api/candidates/:id
 * @access  Public
 */
export const getCandidateById = async (req, res, next) => {
  try {
    const candidate = await Candidate.findById(req.params.id);
    if (!candidate) {
      return res.status(404).json({
        success: false,
        message: 'Candidate not found.'
      });
    }

    return res.status(200).json({
      success: true,
      candidate
    });
  } catch (error) {
    next(error);
  }
};
