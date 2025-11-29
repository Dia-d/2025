import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import UniversityEditModal from './UniversityEditModal.jsx';

const UniversityCard = ({ university, onClick }) => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleClick = (e) => {
    // Don't navigate if clicking the edit button
    if (e.target.closest('.edit-button')) {
      return;
    }
    if (onClick) {
      onClick();
    } else {
      navigate(`/roadmap/${university.id}`);
    }
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditModalOpen(true);
  };

  return (
    <>
      <motion.article
        className="university-card"
        onClick={handleClick}
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.98 }}
      >
        <header>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h3>{university.name}</h3>
              <p>
                {university.city}, {university.country}
              </p>
            </div>
            <button
              type="button"
              className="edit-button"
              onClick={handleEditClick}
              title="Edit University"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
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
          <small>Subjects: {(university.specialisedsubj || university.focus || []).join(' · ')}</small>
          <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: 'var(--muted)' }}>
            {university.minimumgpa && (
              <span style={{ marginRight: '1rem' }}>Min GPA: {university.minimumgpa}</span>
            )}
            {university.satsmin && <span style={{ marginRight: '1rem' }}>Min SAT: {university.satsmin}</span>}
            {university.requiresToefl && (
              <span style={{ marginRight: '1rem' }}>
                TOEFL: {university.toeflMin ? `Min ${university.toeflMin}` : 'Required'}
              </span>
            )}
            {university.requiresIelts && (
              <span>
                IELTS: {university.ieltsMin ? `Min ${university.ieltsMin}` : 'Required'}
              </span>
            )}
          </div>
        </footer>
      </motion.article>
      <UniversityEditModal
        university={university}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  );
};

export default UniversityCard;

