import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ScoreInputDialog = ({ isOpen, onClose, onSubmit, requirement, university }) => {
  const [score, setScore] = useState('');

  if (!requirement || !university) return null;

  const handleSubmit = () => {
    if (score) {
      onSubmit(parseFloat(score));
      setScore('');
    }
  };

  const handleClose = () => {
    setScore('');
    onClose();
  };

  const getScoreType = () => {
    if (!requirement) return { label: 'Score', max: 100, min: 0 };
    if (requirement.id === 'sat_scores') return { label: 'SAT Score', max: 1600, min: 400 };
    if (requirement.id === 'minimum_gpa') return { label: 'GPA', max: 4.0, min: 0, step: 0.01 };
    if (requirement.label?.includes('TOEFL')) return { label: 'TOEFL Score', max: 120, min: 0 };
    if (requirement.label?.includes('IELTS')) return { label: 'IELTS Score', max: 9.0, min: 0, step: 0.5 };
    return { label: 'Score', max: 100, min: 0 };
  };

  const scoreType = getScoreType();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="modal-content"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '500px' }}
          >
            <div className="modal-header">
              <h2>Enter Your {scoreType.label}</h2>
              <button className="modal-close" onClick={handleClose}>×</button>
            </div>

            <div style={{ padding: '1.5rem' }}>
              <p style={{ color: 'var(--muted)', marginBottom: '1.5rem' }}>
                Enter your {scoreType.label.toLowerCase()} to calculate your admission probability for {university.name}.
              </p>

              {/* University Stats */}
              {((requirement.id === 'sat_scores' && university.satsmin) || 
                (requirement.id === 'minimum_gpa' && university.minimumgpa)) && (
                <div style={{
                  background: 'rgba(135, 245, 214, 0.08)',
                  border: '1px solid rgba(135, 245, 214, 0.2)',
                  borderRadius: '0.75rem',
                  padding: '1rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  justifyContent: 'space-around',
                  fontSize: '0.9rem'
                }}>
                  {requirement.id === 'sat_scores' && university.satsmin && (
                    <>
                      <div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Minimum</div>
                        <strong style={{ color: 'var(--accent)' }}>{university.satsmin}</strong>
                      </div>
                      <div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Average</div>
                        <strong style={{ color: 'var(--accent)' }}>{university.averagescores?.sats || 'N/A'}</strong>
                      </div>
                    </>
                  )}
                  {requirement.id === 'minimum_gpa' && university.minimumgpa && (
                    <>
                      <div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Minimum</div>
                        <strong style={{ color: 'var(--accent)' }}>{university.minimumgpa}</strong>
                      </div>
                      <div>
                        <div style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>Average</div>
                        <strong style={{ color: 'var(--accent)' }}>{university.averagescores?.gpa || 'N/A'}</strong>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* Score Input */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '0.5rem',
                  color: 'var(--muted)',
                  fontSize: '0.9rem',
                  fontWeight: '500'
                }}>
                  Your {scoreType.label}
                </label>
                <input
                  type="number"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  min={scoreType.min}
                  max={scoreType.max}
                  step={scoreType.step || 1}
                  placeholder={`Enter ${scoreType.label.toLowerCase()}`}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border)',
                    background: 'rgba(255, 255, 255, 0.02)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>

              {/* Action Buttons */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'flex-end'
              }}>
                <button
                  onClick={handleClose}
                  className="ghost-button"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!score}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem',
                    border: 'none',
                    background: score ? 'var(--accent)' : 'var(--muted)',
                    color: '#04121b',
                    fontSize: '1rem',
                    fontWeight: '600',
                    cursor: score ? 'pointer' : 'not-allowed'
                  }}
                >
                  Save & Continue
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScoreInputDialog;
