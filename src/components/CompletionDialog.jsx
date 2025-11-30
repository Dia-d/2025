import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoadmap } from '../context/RoadmapContext.jsx';
import { useUniversities } from '../context/UniversitiesContext.jsx';
import { calculateAdmissionProbability, getProbabilityColor, getProbabilityMessage } from '../utils/admissionProbability.js';
import { useMemo } from 'react';

const CompletionDialog = ({ isOpen, onClose, universityName }) => {
  const navigate = useNavigate();
  const { universityId } = useParams();
  const { roadmapData } = useRoadmap();
  const { getUniversity } = useUniversities();

  const university = useMemo(() => getUniversity(universityId), [universityId, getUniversity]);

  // Extract scores from notes
  const userScores = useMemo(() => {
    if (!roadmapData?.notes) return {};
    
    const scores = {};
    Object.entries(roadmapData.notes).forEach(([reqId, note]) => {
      if (note && note.startsWith('Score: ')) {
        const score = parseFloat(note.replace('Score: ', ''));
        if (reqId === 'minimum_gpa') scores.gpa = score;
        if (reqId === 'sat_scores') scores.sat = score;
        if (reqId === 'toefl_ielts' || reqId === 'language_proficiency') {
          // Determine if TOEFL or IELTS based on score range
          if (score <= 9) scores.ielts = score;
          else scores.toefl = score;
        }
      }
    });
    return scores;
  }, [roadmapData]);

  const probability = useMemo(() => {
    if (!university) return null;
    return calculateAdmissionProbability(university, userScores);
  }, [university, userScores]);

  const handleExploreMore = () => {
    onClose();
    navigate('/universities/global');
  };

  const handleFurtherProgress = () => {
    onClose();
    navigate(`/further-progress/${universityId}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '500px',
              textAlign: 'center',
              padding: '2.5rem'
            }}
          >
            {/* Celebration Icon */}
            <div style={{
              fontSize: '4rem',
              marginBottom: '1rem',
              animation: 'bounce 1s ease-in-out'
            }}>
              🎉
            </div>

            {/* Title */}
            <h2 style={{
              margin: '0 0 1rem 0',
              fontSize: '2rem',
              background: 'linear-gradient(135deg, #87f5d6, #8ad2ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Congratulations!
            </h2>

            {/* Message */}
            <p style={{
              color: 'var(--muted)',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              marginBottom: probability ? '1rem' : '2rem'
            }}>
              You're all set for <strong style={{ color: 'var(--accent)' }}>{universityName}</strong>! 
              All requirements have been completed.
            </p>

            {/* Admission Probability */}
            {probability && university && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: `2px solid ${getProbabilityColor(probability)}`,
                  borderRadius: '1rem',
                  padding: '1.5rem',
                  marginBottom: '2rem'
                }}
              >
                <div style={{
                  fontSize: '0.85rem',
                  color: 'var(--muted)',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em'
                }}>
                  Estimated Admission Probability
                </div>
                <div style={{
                  fontSize: '3.5rem',
                  fontWeight: '700',
                  color: getProbabilityColor(probability),
                  marginBottom: '0.5rem',
                  lineHeight: 1
                }}>
                  {probability}%
                </div>
                <div style={{
                  fontSize: '1rem',
                  marginBottom: '0.75rem',
                  color: 'white'
                }}>
                  {getProbabilityMessage(probability, university.rank)}
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  color: 'var(--muted)',
                  fontStyle: 'italic'
                }}>
                  ⚠️ This is experimental and might not be accurate
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <button
                onClick={handleFurtherProgress}
                style={{
                  padding: '0.75rem 2rem',
                  borderRadius: '0.75rem',
                  border: 'none',
                  background: 'linear-gradient(135deg, #87f5d6, #8ad2ff)',
                  color: '#04121b',
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 20px rgba(135, 245, 214, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                Further Your Progress 🚀
              </button>

              <button
                onClick={handleExploreMore}
                className="ghost-button"
                style={{
                  padding: '0.75rem 2rem',
                  fontSize: '1rem'
                }}
              >
                Explore More Universities
              </button>
            </div>

            {/* Confetti Animation */}
            <style>{`
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
              }
            `}</style>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CompletionDialog;
