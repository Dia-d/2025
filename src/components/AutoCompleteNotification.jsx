import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

const AutoCompleteNotification = ({ isVisible, autoCompletedItems, onClose }) => {
  useEffect(() => {
    if (isVisible && autoCompletedItems.length > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000); // Auto-close after 5 seconds

      return () => clearTimeout(timer);
    }
  }, [isVisible, autoCompletedItems, onClose]);

  return (
    <AnimatePresence>
      {isVisible && autoCompletedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -50, x: '-50%' }}
          style={{
            position: 'fixed',
            top: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            maxWidth: '500px',
            width: '90%'
          }}
        >
          <div style={{
            background: 'linear-gradient(135deg, rgba(135, 245, 214, 0.95), rgba(138, 210, 255, 0.95))',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            padding: '1.25rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem'
            }}>
              {/* Icon */}
              <div style={{
                fontSize: '2rem',
                flexShrink: 0
              }}>
                ✨
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <h4 style={{
                  margin: '0 0 0.5rem 0',
                  color: '#04121b',
                  fontSize: '1rem',
                  fontWeight: '700'
                }}>
                  Smart Auto-Complete!
                </h4>
                <p style={{
                  margin: '0 0 0.75rem 0',
                  color: '#04121b',
                  fontSize: '0.9rem',
                  lineHeight: '1.4'
                }}>
                  We saw you already completed {autoCompletedItems.length === 1 ? 'this requirement' : 'these requirements'} in another university, so we checked {autoCompletedItems.length === 1 ? 'it' : 'them'} for you:
                </p>
                <ul style={{
                  margin: 0,
                  paddingLeft: '1.25rem',
                  color: '#04121b',
                  fontSize: '0.85rem'
                }}>
                  {autoCompletedItems.map((item, index) => (
                    <li key={index} style={{ marginBottom: '0.25rem' }}>
                      <strong>{item}</strong>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Close Button */}
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(4, 18, 27, 0.2)',
                  border: 'none',
                  borderRadius: '0.5rem',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#04121b',
                  fontSize: '1.25rem',
                  flexShrink: 0,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(4, 18, 27, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(4, 18, 27, 0.2)';
                }}
              >
                ×
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AutoCompleteNotification;
