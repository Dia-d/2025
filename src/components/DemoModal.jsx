import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import subjects from '../data/subjects.js';
import { useUniversities } from '../context/UniversitiesContext.jsx';
import { universityMatchesSubjects } from '../data/subjectMapping.js';

const DemoModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [availableCountries, setAvailableCountries] = useState([]);
  const { universities } = useUniversities();
  const navigate = useNavigate();
  
  const section1Ref = useRef(null);
  const section2Ref = useRef(null);
  const section3Ref = useRef(null);

  // Reset when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(0);
      setSelectedSubject(null);
      setSelectedCountry(null);
      setSelectedUniversity(null);
      setAvailableCountries([]);
    }
  }, [isOpen]);

  // Step 1: Auto-select random subject
  useEffect(() => {
    if (isOpen && step === 0) {
      const timer = setTimeout(() => {
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        setSelectedSubject(randomSubject);
        
        // Find countries with universities for this subject
        const matchedUnis = universities.filter((uni) => {
          const uniSubjects = uni.specialisedsubj || uni.focus;
          return universityMatchesSubjects(uniSubjects, [randomSubject.id]);
        });
        
        const countries = [...new Set(matchedUnis.map(uni => uni.country).filter(Boolean))];
        setAvailableCountries(countries);
        
        setTimeout(() => {
          setStep(1);
          // Scroll to section 2
          section2Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1000);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, step, universities]);

  // Step 2: Auto-select random country
  useEffect(() => {
    if (step === 1 && availableCountries.length > 0) {
      const timer = setTimeout(() => {
        const randomCountry = availableCountries[Math.floor(Math.random() * availableCountries.length)];
        setSelectedCountry(randomCountry);
        
        // Find a university in this country with the selected subject
        const matchedUnis = universities.filter((uni) => {
          const uniSubjects = uni.specialisedsubj || uni.focus;
          return uni.country === randomCountry && 
                 universityMatchesSubjects(uniSubjects, [selectedSubject.id]);
        });
        
        if (matchedUnis.length > 0) {
          const randomUni = matchedUnis[Math.floor(Math.random() * matchedUnis.length)];
          setSelectedUniversity(randomUni);
        }
        
        setTimeout(() => {
          setStep(2);
          // Scroll to section 3
          section3Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 1000);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [step, availableCountries, universities, selectedSubject]);

  // Step 3: Loop back to start after showing university
  useEffect(() => {
    if (step === 2 && selectedUniversity && isOpen) {
      const timer = setTimeout(() => {
        // Reset and start over
        setStep(0);
        setSelectedSubject(null);
        setSelectedCountry(null);
        setSelectedUniversity(null);
        setAvailableCountries([]);
        // Scroll back to top
        section1Ref.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 3000); // Wait 3 seconds before restarting
      return () => clearTimeout(timer);
    }
  }, [step, selectedUniversity, isOpen]);

  const handleGoToUniversity = () => {
    if (selectedUniversity) {
      onClose();
      navigate(`/roadmap/${selectedUniversity.id}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="demo-modal-overlay" onClick={onClose}>
      <motion.div
        className="demo-modal"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <button className="demo-modal-close" onClick={onClose}>×</button>
        
        <div className="demo-modal-content">
          <h2 className="demo-modal-title">Watch How It Works</h2>
          
          {/* Step 1: Subject Selection */}
          <motion.div
            ref={section1Ref}
            className={`demo-section ${step >= 0 ? 'active' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="demo-section-header">
              <span className="demo-step-number">1</span>
              <h3>Pick a Subject</h3>
            </div>
            <AnimatePresence>
              {selectedSubject && (
                <motion.div
                  className="demo-subject-card"
                  style={{ backgroundColor: selectedSubject.color }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <h4>{selectedSubject.name}</h4>
                  <p>{selectedSubject.description}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Step 2: Country Selection */}
          <motion.div
            ref={section2Ref}
            className={`demo-section ${step >= 1 ? 'active' : 'inactive'}`}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: step >= 1 ? 1 : 0.3 }}
          >
            <div className="demo-section-header">
              <span className="demo-step-number">2</span>
              <h3>Select a Country</h3>
            </div>
            <AnimatePresence>
              {selectedCountry && (
                <motion.div
                  className="demo-country-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <div className="demo-country-flag">🌍</div>
                  <h4>{selectedCountry}</h4>
                  <p>{availableCountries.length} countries available</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Step 3: University Result */}
          <motion.div
            ref={section3Ref}
            className={`demo-section ${step >= 2 ? 'active' : 'inactive'}`}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: step >= 2 ? 1 : 0.3 }}
          >
            <div className="demo-section-header">
              <span className="demo-step-number">3</span>
              <h3>Discover Universities</h3>
            </div>
            <AnimatePresence>
              {selectedUniversity && (
                <motion.div
                  className="demo-university-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  <h4>{selectedUniversity.name}</h4>
                  <p className="demo-uni-location">
                    📍 {selectedUniversity.city}, {selectedUniversity.country}
                  </p>
                  <div className="demo-uni-tags">
                    {selectedUniversity.tags?.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="demo-tag">{tag}</span>
                    ))}
                  </div>
                  <button 
                    className="demo-go-button"
                    onClick={handleGoToUniversity}
                  >
                    View Roadmap →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default DemoModal;
