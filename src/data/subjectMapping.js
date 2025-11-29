// Maps subject IDs to university specialised subjects
// This allows subjects like "health" to match universities with various related programs
const subjectMapping = {
  health: ['health', 'doctorate', 'law', 'Life Sciences', 'Clinical and Health', 'Medicine', 'Biological Sciences'], 
  engineering: ['engineering', 'data', 'Computer', 'Engineering', 'Computer Science', 'Physical Sciences'], 
  design: ['design', 'business', 'Arts and Humanities', 'Architecture', 'Art, Performing Art and Design'], 
  business: ['business', 'law', 'Business and Economics', 'Law', 'Economics'], 
  data: ['data', 'Computer', 'engineering', 'Computer Science', 'Engineering', 'Physical Sciences', 'Mathematics'], 
  humanities: ['humanities', 'law', 'Arts and Humanities', 'Law', 'Education', 'Social Sciences', 'History', 'Languages'], 
  Computer: ['Computer', 'data', 'engineering', 'Computer Science', 'Engineering', 'Physical Sciences'], 
};

// Get all university subjects that match a given subject ID
export const getMatchingUniversitySubjects = (subjectId) => {
  return subjectMapping[subjectId] || [subjectId]; // Default to the subject ID itself if no mapping exists
};

// Check if a university's specialised subjects match any of the selected subject IDs
export const universityMatchesSubjects = (universitySubjects, selectedSubjectIds) => {
  if (selectedSubjectIds.length === 0) return true;
  
  // Normalize subjects for comparison (case-insensitive partial matching)
  return selectedSubjectIds.some((subjectId) => {
    const matchingSubjects = getMatchingUniversitySubjects(subjectId);
    return matchingSubjects.some((matchSubject) => {
      const matchLower = matchSubject.toLowerCase();
      return universitySubjects.some((uniSubject) => {
        const uniLower = uniSubject.toLowerCase();
        // Check if either contains the other (partial match)
        return uniLower.includes(matchLower) || matchLower.includes(uniLower);
      });
    });
  });
};

export default subjectMapping;

