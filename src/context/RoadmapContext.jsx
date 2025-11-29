import {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import { useUserCode } from './UserCodeContext.jsx';
import { getAllRequirements, getTotalScore } from '../data/requirementsConfig.js';

const RoadmapContext = createContext(null);

const STORAGE_KEY = 'yonko_roadmap_data';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Initialize default roadmap data structure
const getDefaultRoadmapData = (universityId = null, countryCode = null) => {
  const requirements = getAllRequirements(countryCode);
  const requirementsStatus = {};
  
  // Initialize all requirements as incomplete
  requirements.forEach((req) => {
    requirementsStatus[req.id] = false;
  });
  
  return {
    university_id: universityId,
    country_code: countryCode,
    requirements: requirementsStatus,
  };
};

export const RoadmapProvider = ({ children }) => {
  const { code } = useUserCode();
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(false); // Start as false, only set to true when actually loading

  // Load roadmap data from backend or localStorage
  useEffect(() => {
    const loadRoadmapData = async () => {
      if (!code) {
        return; // No code, no need to load
      }

      setLoading(true);
      
      try {
        // Try to fetch from backend first (with timeout to prevent hanging)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        try {
          const response = await fetch(`${API_BASE_URL}/roadmap/${code}`, {
            signal: controller.signal,
          });
          clearTimeout(timeoutId);
          
          if (response.ok) {
            const data = await response.json();
            setRoadmapData(data);
            setLoading(false);
            return;
          }
        } catch (fetchError) {
          clearTimeout(timeoutId);
          // Backend not available, continue to localStorage
        }
        
        // Fallback to localStorage
        try {
          const stored = typeof window !== 'undefined' ? window.localStorage.getItem(`${STORAGE_KEY}_${code}`) : null;
          if (stored) {
            setRoadmapData(JSON.parse(stored));
          }
        } catch (storageError) {
          // localStorage not available or error
        }
      } catch (error) {
        // Silently handle all errors
        try {
          const stored = typeof window !== 'undefined' ? window.localStorage.getItem(`${STORAGE_KEY}_${code}`) : null;
          if (stored) {
            setRoadmapData(JSON.parse(stored));
          }
        } catch (parseError) {
          // Invalid stored data, ignore
        }
      } finally {
        setLoading(false);
      }
    };

    loadRoadmapData();
  }, [code]);

  // Save roadmap data to backend and localStorage
  const saveRoadmapData = async (data) => {
    if (!code) return;

    setRoadmapData(data);

    // Save to localStorage immediately
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(`${STORAGE_KEY}_${code}`, JSON.stringify(data));
      }
    } catch (error) {
      // Silently handle localStorage errors
    }

    // Try to save to backend (non-blocking with timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    fetch(`${API_BASE_URL}/roadmap/${code}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    })
      .then(() => clearTimeout(timeoutId))
      .catch(() => {
        clearTimeout(timeoutId);
        // Silently fail - data is already in localStorage
      });
  };

  // Initialize roadmap for a university
  const initializeRoadmap = async (universityId, countryCode) => {
    if (!code) return null;

    const newData = getDefaultRoadmapData(universityId, countryCode);
    await saveRoadmapData(newData);
    return newData;
  };

  // Update a specific requirement status
  const updateRequirement = async (requirementId, value) => {
    if (!code || !roadmapData) return;

    const updatedData = {
      ...roadmapData,
      requirements: {
        ...roadmapData.requirements,
        [requirementId]: value,
      },
    };

    await saveRoadmapData(updatedData);
  };

  // Calculate weighted progress
  const calculateProgress = (countryCode) => {
    if (!roadmapData || !roadmapData.requirements) {
      return { percentage: 0, score: 0, totalScore: 0, completedCount: 0, totalCount: 0 };
    }
    
    const reqCountryCode = countryCode || roadmapData.country_code;
    const requirements = getAllRequirements(reqCountryCode);
    const totalScore = getTotalScore(reqCountryCode);
    const completedRequirements = Object.entries(roadmapData.requirements)
      .filter(([_, completed]) => completed)
      .map(([id]) => id);
    
    let earnedScore = 0;
    requirements.forEach((req) => {
      if (completedRequirements.includes(req.id)) {
        earnedScore += req.score;
      }
    });
    
    const percentage = totalScore > 0 ? (earnedScore / totalScore) * 100 : 0;
    
    return {
      percentage: Math.round(percentage * 10) / 10, // Round to 1 decimal
      score: earnedScore,
      totalScore,
      completedCount: completedRequirements.length,
      totalCount: requirements.length,
    };
  };

  // Update university
  const updateUniversity = async (universityId) => {
    if (!code) return;

    const updatedData = roadmapData
      ? { ...roadmapData, university_id: universityId }
      : getDefaultRoadmapData(universityId);

    await saveRoadmapData(updatedData);
  };

  const value = useMemo(
    () => ({
      roadmapData,
      loading,
      initializeRoadmap,
      updateRequirement,
      updateUniversity,
      saveRoadmapData,
      calculateProgress,
    }),
    [roadmapData, loading],
  );

  return <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>;
};

export const useRoadmap = () => {
  const ctx = useContext(RoadmapContext);
  if (!ctx) {
    throw new Error('useRoadmap must be used within a RoadmapProvider');
  }
  return ctx;
};

