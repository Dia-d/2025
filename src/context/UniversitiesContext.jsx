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
      country: data.location,
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
    }));
  }, []);

  // Get a single university
  const getUniversity = (universityId) => {
    return universities.find((uni) => uni.id === universityId);
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

