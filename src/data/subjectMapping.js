// Maps subject IDs to university specialised subjects
// This allows subjects like "health" to match universities with "doctorate", etc.
const subjectMapping = {
  health: ['health', 'doctorate', 'law'], // Health & Life Sciences matches health, doctorate, and law programs
  engineering: ['engineering', 'data', 'Computer'], // Engineering matches engineering, data, and computer science
  design: ['design', 'business'], // Design matches design and business programs
  business: ['business', 'law'], // Business matches business and law programs
  data: ['data', 'Computer', 'engineering'], // Data & Intelligence matches data, computer science, and engineering
  humanities: ['humanities', 'law'], // Humanities matches humanities and law programs
  Computer: ['Computer', 'data', 'engineering'], // Computer Science matches computer science, data, and engineering
};

// Get all university subjects that match a given subject ID
export const getMatchingUniversitySubjects = (subjectId) => {
  return subjectMapping[subjectId] || [subjectId]; // Default to the subject ID itself if no mapping exists
};

// Check if a university's specialised subjects match any of the selected subject IDs
export const universityMatchesSubjects = (universitySubjects, selectedSubjectIds) => {
  if (selectedSubjectIds.length === 0) return true;
  
  return selectedSubjectIds.some((subjectId) => {
    const matchingSubjects = getMatchingUniversitySubjects(subjectId);
    return matchingSubjects.some((matchSubject) => 
      universitySubjects.includes(matchSubject)
    );
  });
};

export default subjectMapping;

