import {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import universitiesData from '../data/universities.json';

const UniversitiesContext = createContext(null);

const STORAGE_KEY = 'yonko_edited_universities';

// Get edited universities from localStorage
const getEditedUniversities = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

// Save edited universities to localStorage
const saveEditedUniversities = (edited) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(edited));
  } catch (error) {
    console.error('Failed to save edited universities:', error);
  }
};

export const UniversitiesProvider = ({ children }) => {
  const [editedUniversities, setEditedUniversities] = useState({});

  // Load edited universities on mount
  useEffect(() => {
    setEditedUniversities(getEditedUniversities());
  }, []);

  // Get all universities with edits applied
  const universities = useMemo(() => {
    const baseUniversities = Object.entries(universitiesData).map(([id, data]) => ({
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
      // Add default values for new fields
      requiresToefl: data.requiresToefl ?? null,
      requiresIelts: data.requiresIelts ?? null,
      toeflMin: data.toeflMin ?? null,
      ieltsMin: data.ieltsMin ?? null,
    }));

    // Apply edits
    return baseUniversities.map((uni) => {
      const edits = editedUniversities[uni.id];
      if (!edits) return uni;

      return {
        ...uni,
        ...edits,
      };
    });
  }, [editedUniversities]);

  // Update a university
  const updateUniversity = (universityId, updates) => {
    setEditedUniversities((prev) => {
      const updated = {
        ...prev,
        [universityId]: {
          ...prev[universityId],
          ...updates,
        },
      };
      saveEditedUniversities(updated);
      return updated;
    });
  };

  // Get a single university
  const getUniversity = (universityId) => {
    return universities.find((uni) => uni.id === universityId);
  };

  const value = useMemo(
    () => ({
      universities,
      updateUniversity,
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

