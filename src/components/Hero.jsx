import { useState } from 'react';
import { motion } from 'framer-motion';
import DemoModal from './DemoModal.jsx';

const heroStats = [
  { label: 'Subjects', value: '35+' },
  { label: 'Countries', value: '120' },
  { label: 'Universities', value: '4,200+' },
];

const Hero = () => {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <>
      <section className="hero">
        <motion.div
          className="hero-text"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          
          <h1>
            Build your learning path in three steps:
            <span className="accent">pick subjects, tap the globe, filter universities.</span>
          </h1>
          <p className="description">
            A personalised pathway you can use!!!
          </p>
          <div className="hero-actions">
            <button 
              type="button" 
              className="ghost-button"
              onClick={() => setIsDemoOpen(true)}
            >
              Watch Demo
            </button>
          </div>
        </motion.div>
        <motion.div
          className="hero-card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          <div className="hero-card-grid">
            {heroStats.map((stat) => (
              <div key={stat.label} className="hero-card-item">
                <span>{stat.label}</span>
                <strong>{stat.value}</strong>
              </div>
            ))}
          </div>
          <p className="hero-card-note">All recommendations update live as you interact.</p>
        </motion.div>
      </section>

      <DemoModal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} />
    </>
  );
};

export default Hero;

