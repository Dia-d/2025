import { motion } from 'framer-motion';

const RoadmapProgress = ({ percentage, completed, total }) => (
  <div className="roadmap-progress-container">
    <div className="progress-bar-wrapper">
      <motion.div
        className="progress-bar-fill"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      />
    </div>
    <div className="progress-stats">
      <span className="progress-text">
        {completed} of {total} steps completed
      </span>
      <span className="progress-percentage">{Math.round(percentage)}%</span>
    </div>
  </div>
);

export default RoadmapProgress;

