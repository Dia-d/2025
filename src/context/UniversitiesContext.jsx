import {
  createContext, useContext, useMemo,
} from 'react';
import universitiesData from '../data/universities.json';

const UniversitiesContext = createContext(null);

export const UniversitiesProvider = ({ children }) => {
  // Get all universities from JSON data (read-only)
  const universities = useMemo(() => {
    return Object.entries(universitiesData).map(([id, data]) => ({
      id,
      name: data.name,
      country: data.location, // Country code (US, UK, CA, etc.)
      city: data.city,
      focus: data.specialisedsubj,
      tags: data.tags || [],
      minimumgpa: data.minimumgpa,
      satsmin: data.satsmin,
      averagescores: data.averagescores,
      specialisedsubj: data.specialisedsubj,
      requiresToefl: data.requiresToefl ?? null,
      requiresIelts: data.requiresIelts ?? null,
      toeflMin: data.toeflMin ?? null,
      ieltsMin: data.ieltsMin ?? null,
      // New fields
      rank: data.rank ?? null,
      stats: data.stats ?? null,
      description: data.description ?? null,
      webAddress: data.webAddress ?? null,
      image_url: data.image_url ?? null,
    }));
  }, []);

  // Get a single university
  const getUniversity = (universityId) => {
    const uni = universities.find((u) => u.id === universityId);
    if (!uni) return null;
    
    // Return full data from JSON for detailed view
    return {
      ...uni,
      ...universitiesData[universityId]
    };
  };

  const value = useMemo(
    () => ({
      universities,
      getUniversity,
    }),
    [universities],
  );

  return <UniversitiesContext.Provider value={value}>{children}</UniversitiesContext.Provider>;
};

export const useUniversities = () => {
  const ctx = useContext(UniversitiesContext);
  if (!ctx) {
    throw new Error('useUniversities must be used within a UniversitiesProvider');
  }
  return ctx;
};

