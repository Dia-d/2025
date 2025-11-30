// Calculate admission probability based on university rank and user scores
export const calculateAdmissionProbability = (university, userScores) => {
  if (!university || !userScores) return null;

  const rank = university.rank || 100;
  
  // Base probability ranges based on rank
  let baseMin, baseMax;
  if (rank <= 20) {
    baseMin = 4;
    baseMax = 8;
  } else if (rank <= 50) {
    baseMin = 9;
    baseMax = 13;
  } else if (rank <= 100) {
    baseMin = 14;
    baseMax = 20;
  } else if (rank <= 200) {
    baseMin = 21;
    baseMax = 30;
  } else {
    baseMin = 31;
    baseMax = 45;
  }

  let totalModifier = 0;
  let scoreCount = 0;

  // Check GPA
  if (userScores.gpa && university.minimumgpa) {
    const gpaMin = university.minimumgpa;
    const gpaAvg = university.averagescores?.gpa || gpaMin + 0.2;
    
    if (userScores.gpa < gpaMin) {
      totalModifier -= 3; // Below minimum hurts chances
    } else if (userScores.gpa >= gpaAvg) {
      totalModifier += 2; // Above average helps
    } else {
      totalModifier += 1; // At or above minimum helps slightly
    }
    scoreCount++;
  }

  // Check SAT
  if (userScores.sat && university.satsmin) {
    const satMin = university.satsmin;
    const satAvg = university.averagescores?.sats || satMin + 50;
    
    if (userScores.sat < satMin) {
      totalModifier -= 3;
    } else if (userScores.sat >= satAvg) {
      totalModifier += 2;
    } else {
      totalModifier += 1;
    }
    scoreCount++;
  }

  // Check TOEFL
  if (userScores.toefl && university.toeflMin) {
    const toeflMin = university.toeflMin;
    const toeflAvg = toeflMin + 10;
    
    if (userScores.toefl < toeflMin) {
      totalModifier -= 2;
    } else if (userScores.toefl >= toeflAvg) {
      totalModifier += 1;
    }
    scoreCount++;
  }

  // Check IELTS
  if (userScores.ielts && university.ieltsMin) {
    const ieltsMin = university.ieltsMin;
    const ieltsAvg = ieltsMin + 0.5;
    
    if (userScores.ielts < ieltsMin) {
      totalModifier -= 2;
    } else if (userScores.ielts >= ieltsAvg) {
      totalModifier += 1;
    }
    scoreCount++;
  }

  // Calculate final probability
  const avgModifier = scoreCount > 0 ? totalModifier / scoreCount : 0;
  const baseProbability = (baseMin + baseMax) / 2;
  const finalProbability = Math.max(1, Math.min(baseProbability + avgModifier, baseMax + 2));

  return Math.round(finalProbability);
};

export const getProbabilityColor = (prob) => {
  if (prob >= 20) return '#87f5d6'; // Green
  if (prob >= 10) return '#ffd18c'; // Orange
  return '#ff8a8a'; // Red
};

export const getProbabilityMessage = (prob, rank) => {
  if (rank <= 20) {
    if (prob >= 7) return 'Outstanding profile for a top-tier university! 🌟';
    if (prob >= 5) return 'Competitive profile for this elite institution 💪';
    return 'Challenging but not impossible - strengthen your profile 📚';
  } else if (rank <= 50) {
    if (prob >= 12) return 'Strong chance at this prestigious university! 🎉';
    if (prob >= 10) return 'Good competitive standing 👍';
    return 'Consider strengthening your application 🤔';
  } else {
    if (prob >= 25) return 'Excellent chance of admission! 🎉';
    if (prob >= 15) return 'Good probability of acceptance 👍';
    return 'Solid chance with a strong application 💪';
  }
};
