// Requirements configuration system
// Defines country-specific requirements with priorities, dependencies, groups, and scoring

// Requirement groups
export const REQUIREMENT_GROUPS = {
  ACADEMIC: 'academic',
  LANGUAGE: 'language',
  DOCUMENTS: 'documents',
  VISA: 'visa',
  FINANCIAL: 'financial',
};

// Country-specific requirement configurations
const COUNTRY_REQUIREMENTS = {
  US: {
    [REQUIREMENT_GROUPS.ACADEMIC]: [
      {
        id: 'minimum_gpa',
        label: 'Meet Minimum GPA Requirement',
        description: 'Ensure your GPA meets the university minimum requirement',
        priority: 1,
        level: 1,
        dependencies: [],
        score: 20,
        required: true,
      },
      {
        id: 'sat_scores',
        label: 'SAT Scores',
        description: 'Submit SAT scores (minimum score required)',
        priority: 2,
        level: 2,
        dependencies: ['minimum_gpa'],
        score: 15,
        required: true,
      },
      {
        id: 'academic_transcripts',
        label: 'Academic Transcripts and Certificates',
        description: 'Collect all academic transcripts and certificates',
        priority: 3,
        level: 2,
        dependencies: ['minimum_gpa'],
        score: 10,
        required: true,
      },
    ],
    [REQUIREMENT_GROUPS.LANGUAGE]: [
      {
        id: 'toefl_ielts',
        label: 'TOEFL/IELTS Scores',
        description: 'Submit English proficiency test scores (TOEFL or IELTS)',
        priority: 4,
        level: 3,
        dependencies: ['minimum_gpa'],
        score: 10,
        required: true,
      },
    ],
    [REQUIREMENT_GROUPS.DOCUMENTS]: [
      {
        id: 'university_acceptance_letter',
        label: 'University Acceptance Letter',
        description: 'Obtain the official acceptance letter from your university',
        priority: 5,
        level: 4,
        dependencies: ['sat_scores', 'academic_transcripts', 'toefl_ielts'],
        score: 15,
        required: true,
      },
    ],
    [REQUIREMENT_GROUPS.VISA]: [
      {
        id: 'passport_valid',
        label: 'Passport Valid 6 Months Beyond Stay',
        description: 'Ensure your passport is valid for at least 6 months beyond your intended stay',
        priority: 6,
        level: 5,
        dependencies: ['university_acceptance_letter'],
        score: 5,
        required: true,
      },
      {
        id: 'ds160_confirmation',
        label: 'DS-160 Confirmation Page',
        description: 'Complete and submit the DS-160 form online',
        priority: 7,
        level: 5,
        dependencies: ['university_acceptance_letter'],
        score: 5,
        required: true,
      },
      {
        id: 'visa_application_fee',
        label: 'Visa Application Fee Receipt',
        description: 'Pay the visa application fee and keep the receipt',
        priority: 8,
        level: 5,
        dependencies: ['ds160_confirmation'],
        score: 3,
        required: true,
      },
      {
        id: 'sevis_fee',
        label: 'SEVIS I-901 Fee Receipt',
        description: 'Pay the SEVIS I-901 fee and obtain the receipt',
        priority: 9,
        level: 5,
        dependencies: ['ds160_confirmation'],
        score: 3,
        required: true,
      },
      {
        id: 'form_i20',
        label: 'Form I-20 (Signed)',
        description: 'Receive and sign the Form I-20 from your university',
        priority: 10,
        level: 5,
        dependencies: ['university_acceptance_letter'],
        score: 5,
        required: true,
      },
      {
        id: 'passport_photo',
        label: 'Passport Size Photo (US Visa Spec)',
        description: 'Get passport-sized photos meeting US visa specifications',
        priority: 11,
        level: 6,
        dependencies: ['visa_application_fee', 'sevis_fee'],
        score: 2,
        required: true,
      },
      {
        id: 'visa_appointment',
        label: 'Visa Appointment Confirmation',
        description: 'Schedule and confirm your visa interview appointment',
        priority: 12,
        level: 6,
        dependencies: ['passport_photo', 'form_i20'],
        score: 5,
        required: true,
      },
      {
        id: 'ties_to_home_country',
        label: 'Evidence of Ties to Home Country',
        description: 'Prepare documents showing strong ties to your home country',
        priority: 13,
        level: 6,
        dependencies: ['visa_appointment'],
        score: 2,
        required: true,
      },
    ],
    [REQUIREMENT_GROUPS.FINANCIAL]: [
      {
        id: 'proof_of_financial_support',
        label: 'Proof of Financial Support',
        description: 'Provide bank statements and financial documents',
        priority: 14,
        level: 4,
        dependencies: ['university_acceptance_letter'],
        score: 10,
        required: true,
      },
    ],
  },
  GB: {
    [REQUIREMENT_GROUPS.ACADEMIC]: [
      {
        id: 'minimum_gpa',
        label: 'Meet Minimum GPA Requirement',
        description: 'Ensure your GPA meets the university minimum requirement',
        priority: 1,
        level: 1,
        dependencies: [],
        score: 20,
        required: true,
      },
      {
        id: 'academic_transcripts',
        label: 'Academic Transcripts and Certificates',
        description: 'Collect all academic transcripts and certificates',
        priority: 2,
        level: 2,
        dependencies: ['minimum_gpa'],
        score: 15,
        required: true,
      },
    ],
    [REQUIREMENT_GROUPS.LANGUAGE]: [
      {
        id: 'ielts_toefl',
        label: 'IELTS/TOEFL Scores',
        description: 'Submit English proficiency test scores (IELTS preferred for UK)',
        priority: 3,
        level: 2,
        dependencies: ['minimum_gpa'],
        score: 15,
        required: true,
      },
    ],
    [REQUIREMENT_GROUPS.DOCUMENTS]: [
      {
        id: 'university_acceptance_letter',
        label: 'University Acceptance Letter',
        description: 'Obtain the official acceptance letter (CAS) from your university',
        priority: 4,
        level: 3,
        dependencies: ['academic_transcripts', 'ielts_toefl'],
        score: 15,
        required: true,
      },
    ],
    [REQUIREMENT_GROUPS.VISA]: [
      {
        id: 'passport_valid',
        label: 'Passport Valid 6 Months Beyond Stay',
        description: 'Ensure your passport is valid for at least 6 months beyond your intended stay',
        priority: 5,
        level: 4,
        dependencies: ['university_acceptance_letter'],
        score: 5,
        required: true,
      },
      {
        id: 'uk_visa_application',
        label: 'UK Visa Application (Online)',
        description: 'Complete the UK visa application online',
        priority: 6,
        level: 4,
        dependencies: ['university_acceptance_letter'],
        score: 5,
        required: true,
      },
      {
        id: 'visa_application_fee',
        label: 'Visa Application Fee Receipt',
        description: 'Pay the visa application fee and keep the receipt',
        priority: 7,
        level: 5,
        dependencies: ['uk_visa_application'],
        score: 5,
        required: true,
      },
      {
        id: 'ihs_payment',
        label: 'Immigration Health Surcharge (IHS) Payment',
        description: 'Pay the Immigration Health Surcharge',
        priority: 8,
        level: 5,
        dependencies: ['uk_visa_application'],
        score: 5,
        required: true,
      },
      {
        id: 'biometric_appointment',
        label: 'Biometric Appointment',
        description: 'Schedule and attend your biometric appointment',
        priority: 9,
        level: 6,
        dependencies: ['visa_application_fee', 'ihs_payment'],
        score: 5,
        required: true,
      },
      {
        id: 'passport_photo',
        label: 'Passport Size Photo',
        description: 'Get passport-sized photos meeting UK visa specifications',
        priority: 10,
        level: 5,
        dependencies: ['uk_visa_application'],
        score: 3,
        required: true,
      },
    ],
    [REQUIREMENT_GROUPS.FINANCIAL]: [
      {
        id: 'proof_of_financial_support',
        label: 'Proof of Financial Support',
        description: 'Provide bank statements showing sufficient funds for tuition and living costs',
        priority: 11,
        level: 4,
        dependencies: ['university_acceptance_letter'],
        score: 12,
        required: true,
      },
    ],
  },
  // Default/Generic requirements for other countries
  DEFAULT: {
    [REQUIREMENT_GROUPS.ACADEMIC]: [
      {
        id: 'minimum_gpa',
        label: 'Meet Minimum GPA Requirement',
        description: 'Ensure your GPA meets the university minimum requirement',
        priority: 1,
        level: 1,
        dependencies: [],
        score: 20,
        required: true,
      },
      {
        id: 'academic_transcripts',
        label: 'Academic Transcripts and Certificates',
        description: 'Collect all academic transcripts and certificates',
        priority: 2,
        level: 2,
        dependencies: ['minimum_gpa'],
        score: 15,
        required: true,
      },
    ],
    [REQUIREMENT_GROUPS.LANGUAGE]: [
      {
        id: 'language_proficiency',
        label: 'Language Proficiency Test',
        description: 'Submit required language proficiency test scores (TOEFL, IELTS, or other)',
        priority: 3,
        level: 2,
        dependencies: ['minimum_gpa'],
        score: 15,
        required: true,
      },
    ],
    [REQUIREMENT_GROUPS.DOCUMENTS]: [
      {
        id: 'university_acceptance_letter',
        label: 'University Acceptance Letter',
        description: 'Obtain the official acceptance letter from your university',
        priority: 4,
        level: 3,
        dependencies: ['academic_transcripts', 'language_proficiency'],
        score: 15,
        required: true,
      },
    ],
    [REQUIREMENT_GROUPS.VISA]: [
      {
        id: 'passport_valid',
        label: 'Passport Valid 6 Months Beyond Stay',
        description: 'Ensure your passport is valid for at least 6 months beyond your intended stay',
        priority: 5,
        level: 4,
        dependencies: ['university_acceptance_letter'],
        score: 5,
        required: true,
      },
      {
        id: 'visa_application',
        label: 'Visa Application',
        description: 'Complete the visa application for your destination country',
        priority: 6,
        level: 4,
        dependencies: ['university_acceptance_letter'],
        score: 10,
        required: true,
      },
      {
        id: 'visa_appointment',
        label: 'Visa Appointment Confirmation',
        description: 'Schedule and confirm your visa interview appointment',
        priority: 7,
        level: 5,
        dependencies: ['visa_application'],
        score: 5,
        required: true,
      },
    ],
    [REQUIREMENT_GROUPS.FINANCIAL]: [
      {
        id: 'proof_of_financial_support',
        label: 'Proof of Financial Support',
        description: 'Provide bank statements and financial documents',
        priority: 8,
        level: 4,
        dependencies: ['university_acceptance_letter'],
        score: 10,
        required: true,
      },
    ],
  },
};

// Get requirements for a specific country
export const getRequirementsForCountry = (countryCode) => {
  const country = countryCode?.toUpperCase();
  return COUNTRY_REQUIREMENTS[country] || COUNTRY_REQUIREMENTS.DEFAULT;
};

// Get all requirements flattened with group information
export const getAllRequirements = (countryCode) => {
  const requirements = getRequirementsForCountry(countryCode);
  const all = [];
  
  Object.entries(requirements).forEach(([group, reqs]) => {
    reqs.forEach((req) => {
      all.push({
        ...req,
        group,
      });
    });
  });
  
  // Sort by priority
  return all.sort((a, b) => a.priority - b.priority);
};

// Get total possible score for a country
export const getTotalScore = (countryCode) => {
  const all = getAllRequirements(countryCode);
  return all.reduce((sum, req) => sum + req.score, 0);
};

// Check if a requirement's dependencies are met
export const areDependenciesMet = (requirement, completedRequirements) => {
  if (requirement.dependencies.length === 0) return true;
  return requirement.dependencies.every((depId) => 
    completedRequirements.includes(depId)
  );
};

// Get group label
export const getGroupLabel = (group) => {
  const labels = {
    [REQUIREMENT_GROUPS.ACADEMIC]: 'Academic Requirements',
    [REQUIREMENT_GROUPS.LANGUAGE]: 'Language Requirements',
    [REQUIREMENT_GROUPS.DOCUMENTS]: 'Documentation',
    [REQUIREMENT_GROUPS.VISA]: 'Visa Requirements',
    [REQUIREMENT_GROUPS.FINANCIAL]: 'Financial Requirements',
  };
  return labels[group] || group;
};

