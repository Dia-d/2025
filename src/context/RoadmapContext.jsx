import {
  createContext, useContext, useEffect, useMemo, useState,
} from 'react';
import { useUserCode } from './UserCodeContext.jsx';

const RoadmapContext = createContext(null);

const STORAGE_KEY = 'yonko_roadmap_data';
const API_BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

// Initialize default roadmap data structure
const getDefaultRoadmapData = (universityId = null) => ({
  university_id: universityId,
  visa_documents: {
    passport_valid_6_months_beyond_stay: false,
    'DS-160_confirmation_page': false,
    visa_application_fee_receipt: false,
    'SEVIS_I-901_fee_receipt': false,
    'Form_I-20_signed': false,
    passport_size_photo_US_visa_spec: false,
    academic_transcripts_and_certificates: false,
    standardized_test_scores_if_required: false,
    proof_of_financial_support: false,
    university_acceptance_letter: false,
    visa_appointment_confirmation: false,
    evidence_of_ties_to_home_country: false,
  },
});

export const RoadmapProvider = ({ children }) => {
  const { code } = useUserCode();
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load roadmap data from backend or localStorage
  useEffect(() => {
    const loadRoadmapData = async () => {
      if (!code) {
        setLoading(false);
        return;
      }

      try {
        // Try to fetch from backend first
        const response = await fetch(`${API_BASE_URL}/roadmap/${code}`);
        if (response.ok) {
          const data = await response.json();
          setRoadmapData(data);
        } else {
          // Fallback to localStorage
          const stored = window.localStorage.getItem(`${STORAGE_KEY}_${code}`);
          if (stored) {
            setRoadmapData(JSON.parse(stored));
          }
        }
      } catch (error) {
        console.error('Error loading roadmap data:', error);
        // Fallback to localStorage
        const stored = window.localStorage.getItem(`${STORAGE_KEY}_${code}`);
        if (stored) {
          setRoadmapData(JSON.parse(stored));
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
    window.localStorage.setItem(`${STORAGE_KEY}_${code}`, JSON.stringify(data));

    // Try to save to backend
    try {
      await fetch(`${API_BASE_URL}/roadmap/${code}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Error saving roadmap data to backend:', error);
      // Data is already saved to localStorage, so it's okay
    }
  };

  // Initialize roadmap for a university
  const initializeRoadmap = async (universityId) => {
    if (!code) return null;

    const newData = getDefaultRoadmapData(universityId);
    await saveRoadmapData(newData);
    return newData;
  };

  // Update a specific visa document status
  const updateVisaDocument = async (documentKey, value) => {
    if (!code || !roadmapData) return;

    const updatedData = {
      ...roadmapData,
      visa_documents: {
        ...roadmapData.visa_documents,
        [documentKey]: value,
      },
    };

    await saveRoadmapData(updatedData);
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
      updateVisaDocument,
      updateUniversity,
      saveRoadmapData,
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

