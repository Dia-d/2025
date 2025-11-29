import {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import { useUserCode } from './UserCodeContext.jsx';
import { getAllRequirements, getTotalScore } from '../data/requirementsConfig.js';

const RoadmapContext = createContext(null);

const STORAGE_KEY = 'yonko_roadmap_data';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Initialize default roadmap data structure
const getDefaultRoadmapData = (universityId = null, countryCode = null) => {
  const requirements = getAllRequirements(countryCode);
  const requirementsStatus = {};
  const notes = {};
  
  // Initialize all requirements as incomplete with empty notes
  requirements.forEach((req) => {
    requirementsStatus[req.id] = false;
    notes[req.id] = '';
  });
  
  return {
    university_id: universityId,
    country_code: countryCode,
    requirements: requirementsStatus,
    notes: notes,
  };
};

export const RoadmapProvider = ({ children }) => {
  const { code } = useUserCode();
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(false); // Start as false, only set to true when actually loading

  // Clear roadmap data when user code changes (logout/login)
  useEffect(() => {
    console.log('🔄 User code changed:', code);
    setRoadmapData(null); // Clear old user's data
  }, [code]);

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
            const allRoadmaps = await response.json();
            // Store all roadmaps in localStorage as backup
            if (typeof window !== 'undefined' && window.localStorage) {
              window.localStorage.setItem(`${STORAGE_KEY}_${code}`, JSON.stringify(allRoadmaps));
            }
            // Don't set roadmapData here - it will be set when a specific university is selected
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
            // Data is stored, but we don't load it until a university is selected
          }
        } catch (storageError) {
          // localStorage not available or error
        }
      } catch (error) {
        // Silently handle all errors
      } finally {
        setLoading(false);
      }
    };

    loadRoadmapData();
  }, [code]);

  // Save roadmap data to backend and localStorage
  const saveRoadmapData = async (data) => {
    if (!code) {
      console.warn('⚠️ Cannot save: No user code');
      return;
    }

    setRoadmapData(data);

    // Save to localStorage immediately - store per university
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const storageKey = `${STORAGE_KEY}_${code}_${data.university_id}`;
        window.localStorage.setItem(storageKey, JSON.stringify(data));
        console.log('✅ Saved to localStorage:', storageKey);
      }
    } catch (error) {
      console.error('❌ localStorage save failed:', error);
    }

    // Try to save to backend (non-blocking with timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    
    try {
      const response = await fetch(`${API_BASE_URL}/roadmap/${code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok) {
        console.log('✅ Saved to backend:', data.university_id);
      } else {
        const errorText = await response.text();
        console.error('❌ Backend save failed:', response.status, errorText);
      }
    } catch (error) {
      clearTimeout(timeoutId);
      console.warn('⚠️ Backend not available:', error.message);
      // Data is already in localStorage, so this is okay
    }
  };

  // Initialize roadmap for a university
  const initializeRoadmap = async (universityId, countryCode) => {
    if (!code) {
      console.warn('⚠️ Cannot initialize roadmap: No user code');
      return null;
    }

    console.log(`🎯 Initializing roadmap for ${universityId} (${countryCode})`);
    
    // Check if data exists in localStorage first
    try {
      const storageKey = `${STORAGE_KEY}_${code}_${universityId}`;
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null;
      
      if (stored) {
        console.log('📦 Found existing data in localStorage');
        const existingData = JSON.parse(stored);
        setRoadmapData(existingData);
        return existingData;
      }
    } catch (error) {
      console.warn('⚠️ Error loading from localStorage:', error);
    }
    
    // No existing data, create new with auto-complete from other universities
    const newData = getDefaultRoadmapData(universityId, countryCode);
    
    // Check other universities for completed requirements
    const autoCompletedRequirements = [];
    try {
      const allRoadmapsKey = `${STORAGE_KEY}_${code}`;
      const allStored = typeof window !== 'undefined' ? window.localStorage.getItem(allRoadmapsKey) : null;
      
      if (allStored) {
        const allRoadmaps = JSON.parse(allStored);
        const roadmapsData = allRoadmaps.roadmaps || allRoadmaps;
        
        // Get all completed requirements from other universities
        const completedInOtherUnis = new Set();
        Object.entries(roadmapsData).forEach(([uniId, roadmap]) => {
          if (uniId !== universityId && roadmap && roadmap.requirements) {
            Object.entries(roadmap.requirements).forEach(([reqId, completed]) => {
              if (completed) {
                completedInOtherUnis.add(reqId);
              }
            });
          }
        });
        
        // Auto-complete matching requirements
        completedInOtherUnis.forEach((reqId) => {
          if (newData.requirements.hasOwnProperty(reqId)) {
            newData.requirements[reqId] = true;
            autoCompletedRequirements.push(reqId);
          }
        });
        
        console.log('✨ Auto-completed requirements:', autoCompletedRequirements);
      }
    } catch (error) {
      console.warn('⚠️ Error checking for auto-complete:', error);
    }
    
    // Store auto-completed items for notification
    if (autoCompletedRequirements.length > 0) {
      newData.autoCompleted = autoCompletedRequirements;
    }
    
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

  // Update notes for a specific requirement
  const updateNote = async (requirementId, note) => {
    if (!code || !roadmapData) return;

    const updatedData = {
      ...roadmapData,
      notes: {
        ...(roadmapData.notes || {}),
        [requirementId]: note,
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

  // Check if a university is completed
  const isUniversityCompleted = (universityId) => {
    if (!code) return false;
    
    try {
      // Try to get from backend data first
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem(`${STORAGE_KEY}_${code}`) : null;
      if (stored) {
        const allRoadmaps = JSON.parse(stored);
        const uniRoadmap = allRoadmaps[universityId];
        if (uniRoadmap && uniRoadmap.requirements) {
          const requirements = getAllRequirements(uniRoadmap.country_code);
          const completedCount = Object.values(uniRoadmap.requirements).filter(Boolean).length;
          return completedCount === requirements.length;
        }
      }
    } catch (error) {
      console.error('Error checking university completion:', error);
    }
    return false;
  };

  const value = useMemo(
    () => ({
      roadmapData,
      loading,
      initializeRoadmap,
      updateRequirement,
      updateNote,
      updateUniversity,
      saveRoadmapData,
      calculateProgress,
      isUniversityCompleted,
    }),
    [roadmapData, loading, code],
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

