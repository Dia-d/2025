import { motion } from 'framer-motion';

const RoadmapProgress = ({ progress }) => {
  const percentage = typeof progress === 'number' ? progress : 0;
  
  return (
    <div className="roadmap-progress-container">
      <div className="roadmap-progress-bar">
        <motion.div
          className="roadmap-progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
};

export default RoadmapProgress;

