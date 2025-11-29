import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRoadmap } from '../context/RoadmapContext.jsx';

const UniversityCard = ({ university, onClick }) => {
  const navigate = useNavigate();
  const [showRequirements, setShowRequirements] = useState(false);
  const { isUniversityCompleted } = useRoadmap();
  
  const isCompleted = isUniversityCompleted(university.id);

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/roadmap/${university.id}`);
    }
  };

  const toggleRequirements = (e) => {
    e.stopPropagation();
    setShowRequirements(!showRequirements);
  };

  return (
    <motion.article
      className="university-card"
      whileHover={{ y: -4 }}
      style={{ 
        cursor: 'default',
        position: 'relative'
      }}
    >
      {/* Completed Badge */}
      {isCompleted && (
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          padding: '0.5rem 1rem',
          background: 'linear-gradient(135deg, #87f5d6, #8ad2ff)',
          color: '#04121b',
          borderRadius: '0.5rem',
          fontSize: '0.85rem',
          fontWeight: '700',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          boxShadow: '0 4px 12px rgba(135, 245, 214, 0.3)',
          zIndex: 1
        }}>
          <span>✓</span>
          <span>COMPLETED</span>
        </div>
      )}
      
      <header>
        <div>
          <h3>{university.name}</h3>
          <p>
            {university.city}, {university.country}
          </p>
          {university.rank && (
            <span style={{
              display: 'inline-block',
              marginTop: '0.25rem',
              padding: '0.25rem 0.5rem',
              background: 'var(--accent)',
              color: 'white',
              borderRadius: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: '600'
            }}>
              Rank #{university.rank}
            </span>
          )}
        </div>
      </header>
      <div className="tag-row">
        {university.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      <footer>
        <small>Subjects: {(university.specialisedsubj || university.focus || []).slice(0, 5).join(' · ')}</small>
        
        {/* Requirements Toggle Button */}
        <button
          onClick={toggleRequirements}
          style={{
            marginTop: '0.75rem',
            padding: '0.5rem 1rem',
            width: '100%',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border)',
            borderRadius: '0.5rem',
            color: 'var(--text)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '500',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--bg)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'var(--bg-secondary)';
          }}
        >
          <span>View Requirements</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            style={{
              width: '20px',
              height: '20px',
              transform: showRequirements ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}
          >
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        {/* Requirements Dropdown */}
        <AnimatePresence>
          {showRequirements && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
              <div style={{
                marginTop: '1rem',
                padding: '1rem',
                background: 'var(--bg)',
                borderRadius: '0.5rem',
                border: '1px solid var(--border)'
              }}>
                <h4 style={{ marginBottom: '0.75rem', fontSize: '0.95rem', color: 'var(--accent)' }}>
                  Admission Requirements
                </h4>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                  {/* GPA */}
                  {university.minimumgpa && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--muted)' }}>Minimum GPA:</span>
                      <span style={{ fontWeight: '600' }}>{university.minimumgpa}</span>
                    </div>
                  )}
                  
                  {/* Average GPA */}
                  {university.averagescores?.gpa && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--muted)' }}>Average GPA:</span>
                      <span style={{ fontWeight: '600' }}>{university.averagescores.gpa}</span>
                    </div>
                  )}

                  {/* SAT */}
                  {university.satsmin && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--muted)' }}>Minimum SAT:</span>
                      <span style={{ fontWeight: '600' }}>{university.satsmin}</span>
                    </div>
                  )}

                  {/* Average SAT */}
                  {university.averagescores?.sats && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--muted)' }}>Average SAT:</span>
                      <span style={{ fontWeight: '600' }}>{university.averagescores.sats}</span>
                    </div>
                  )}

                  {/* TOEFL */}
                  {university.requiresToefl && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--muted)' }}>TOEFL:</span>
                      <span style={{ fontWeight: '600' }}>
                        {university.toeflMin ? `Min ${university.toeflMin}` : 'Required'}
                      </span>
                    </div>
                  )}

                  {/* IELTS */}
                  {university.requiresIelts && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'var(--muted)' }}>IELTS:</span>
                      <span style={{ fontWeight: '600' }}>
                        {university.ieltsMin ? `Min ${university.ieltsMin}` : 'Required'}
                      </span>
                    </div>
                  )}

                  {/* Stats if available */}
                  {university.stats && (
                    <>
                      <div style={{ 
                        marginTop: '0.5rem', 
                        paddingTop: '0.5rem', 
                        borderTop: '1px solid var(--border)' 
                      }}>
                        <h5 style={{ marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--accent)' }}>
                          University Stats
                        </h5>
                      </div>
                      
                      {university.stats.students && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--muted)' }}>Total Students:</span>
                          <span style={{ fontWeight: '600' }}>{university.stats.students.toLocaleString()}</span>
                        </div>
                      )}

                      {university.stats.intlStudents && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--muted)' }}>International Students:</span>
                          <span style={{ fontWeight: '600' }}>{university.stats.intlStudents}%</span>
                        </div>
                      )}

                      {university.stats.studentStaffRatio && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--muted)' }}>Student-Staff Ratio:</span>
                          <span style={{ fontWeight: '600' }}>{university.stats.studentStaffRatio}:1</span>
                        </div>
                      )}

                      {university.stats.overallScore && (
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--muted)' }}>Overall Score:</span>
                          <span style={{ fontWeight: '600', color: 'var(--accent)' }}>
                            {university.stats.overallScore}/100
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Apply Button */}
                <button
                  onClick={handleCardClick}
                  style={{
                    marginTop: '1rem',
                    padding: '0.5rem 1rem',
                    width: '100%',
                    background: 'var(--accent)',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Start Application Roadmap →
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </footer>
    </motion.article>
  );
};

export default UniversityCard;

