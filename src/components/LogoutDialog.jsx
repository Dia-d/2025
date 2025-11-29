import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

const LogoutDialog = ({ isOpen, onClose, onConfirm, sessionId }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(sessionId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.85)',
              backdropFilter: 'blur(4px)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                borderRadius: '1.5rem',
                padding: '2.5rem',
                maxWidth: '550px',
                width: '90%',
                boxShadow: '0 25px 80px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(239, 68, 68, 0.3)',
                position: 'relative',
              }}
            >
              {/* Icon */}
              {/* Animated glow effect */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(239, 68, 68, 0.3)',
                    '0 0 40px rgba(239, 68, 68, 0.5)',
                    '0 0 20px rgba(239, 68, 68, 0.3)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{
                  position: 'absolute',
                  top: '-2px',
                  left: '-2px',
                  right: '-2px',
                  bottom: '-2px',
                  borderRadius: '1.5rem',
                  pointerEvents: 'none',
                  zIndex: -1,
                }}
              />

              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginBottom: '1.5rem' 
              }}>
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.3) 0%, rgba(220, 38, 38, 0.3) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)',
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="#ef4444"
                    style={{ width: '40px', height: '40px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}
                  >
                    <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                  </svg>
                </motion.div>
              </div>

              {/* Title */}
              <h3 style={{ 
                textAlign: 'center', 
                marginBottom: '1rem',
                fontSize: '1.75rem',
                fontWeight: '700',
                color: '#fff',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)',
              }}>
                ⚠️ Logout Confirmation
              </h3>

              {/* Warning */}
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(239, 68, 68, 0.4)',
                    '0 0 0 8px rgba(239, 68, 68, 0)',
                  ],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
                style={{
                  background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)',
                  border: '2px solid rgba(239, 68, 68, 0.5)',
                  borderRadius: '0.75rem',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                }}
              >
                <p style={{
                  fontSize: '1rem',
                  color: '#fff',
                  margin: 0,
                  lineHeight: '1.6',
                  fontWeight: '600',
                  textAlign: 'center',
                }}>
                  ⚠️ Make sure you have saved your Session ID before logging out!
                </p>
              </motion.div>

              {/* Session ID Display */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.3)',
              }}>
                <div style={{
                  fontSize: '0.8rem',
                  color: 'rgba(255, 255, 255, 0.6)',
                  marginBottom: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  fontWeight: '600',
                }}>
                  📋 Your Session ID
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}>
                  <code style={{
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: '#ffd18c',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                    flex: 1,
                    padding: '0.75rem',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '0.5rem',
                  }}>
                    {sessionId}
                  </code>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleCopy}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      border: copied ? '2px solid #10b981' : '2px solid rgba(255, 209, 140, 0.3)',
                      background: copied 
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, rgba(255, 209, 140, 0.2) 0%, rgba(255, 209, 140, 0.1) 100%)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: '50px',
                      height: '50px',
                    }}
                    title={copied ? 'Copied!' : 'Copy Session ID'}
                  >
                    {copied ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="#fff"
                        style={{ width: '24px', height: '24px' }}
                      >
                        <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="#ffd18c"
                        style={{ width: '24px', height: '24px' }}
                      >
                        <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12A1.5 1.5 0 0 1 17 6.622V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1Z" />
                        <path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z" />
                      </svg>
                    )}
                  </motion.button>
                </div>
                {copied && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      marginTop: '0.75rem',
                      padding: '0.5rem',
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '0.5rem',
                      textAlign: 'center',
                      color: '#10b981',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                    }}
                  >
                    ✓ Copied to clipboard!
                  </motion.div>
                )}
              </div>

              {/* Message */}
              <p style={{ 
                textAlign: 'center', 
                color: 'rgba(255, 255, 255, 0.8)',
                marginBottom: '2rem',
                lineHeight: '1.7',
                fontSize: '1rem',
                fontWeight: '500',
              }}>
                You'll need this ID to restore your progress later. Have you copied it?
              </p>

              {/* Buttons */}
              <div style={{ 
                display: 'flex', 
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}>
                <button
                  onClick={onClose}
                  style={{
                    padding: '1rem 2rem',
                    borderRadius: '0.75rem',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '1.05rem',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    minWidth: '140px',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  ← Stay Here
                </button>
                <button
                  onClick={onConfirm}
                  style={{
                    padding: '1rem 2rem',
                    borderRadius: '0.75rem',
                    border: '2px solid #ef4444',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#fff',
                    cursor: 'pointer',
                    fontSize: '1.05rem',
                    fontWeight: '700',
                    transition: 'all 0.3s ease',
                    minWidth: '140px',
                    boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                    e.target.style.transform = 'translateY(-2px) scale(1.05)';
                    e.target.style.boxShadow = '0 15px 40px rgba(239, 68, 68, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                    e.target.style.transform = 'translateY(0) scale(1)';
                    e.target.style.boxShadow = '0 10px 30px rgba(239, 68, 68, 0.4)';
                  }}
                >
                  Yes, Logout →
                </button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LogoutDialog;
