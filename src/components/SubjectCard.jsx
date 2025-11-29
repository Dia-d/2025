import { motion } from 'framer-motion';
import clsx from 'clsx';

const SubjectCard = ({ subject, isActive, onSelect }) => (
  <motion.button
    type="button"
    layout
    className={clsx('subject-card', { active: isActive })}
    style={{ borderColor: subject.color }}
    onClick={() => onSelect(subject.id)}
    whileHover={{ y: -4 }}
    whileTap={{ scale: 0.98 }}
  >
    <span className="dot" style={{ backgroundColor: subject.color }} />
    <div>
      <h3>{subject.name}</h3>
      <p>{subject.description}</p>
    </div>
  </motion.button>
);

export default SubjectCard;

