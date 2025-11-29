import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const UniversityCard = ({ university, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/roadmap/${university.id}`);
    }
  };

  return (
    <motion.article
      className="university-card"
      onClick={handleClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
    <header>
      <h3>{university.name}</h3>
      <p>
        {university.city}, {university.country}
      </p>
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
      {(university.minimumgpa || university.satsmin) && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
          {university.minimumgpa && (
            <span style={{ marginRight: '1rem' }}>Min GPA: {university.minimumgpa}</span>
          )}
          {university.satsmin && <span>Min SAT: {university.satsmin}</span>}
        </div>
      )}
    </footer>
    </motion.article>
  );
};

export default UniversityCard;

