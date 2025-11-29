import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserCode } from '../context/UserCodeContext.jsx';

const Header = () => {
  const { code } = useUserCode();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  
  // Check if user has a token (for now, we'll use code as session ID)
  // In the future, you can add a separate token check here
  const userToken = null; // Replace with actual token check when you implement login
  const displayCode = userToken || code;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <header className="header">
      <motion.div
        className="logo"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Yonko Scholars
      </motion.div>
      <nav className="nav">
        <NavLink to="/" className="nav-link">
          Discover
        </NavLink>
        {displayCode && (
          <div className="profile-container" ref={dropdownRef}>
            <button
              type="button"
              className="profile-icon-button"
              onClick={() => setShowDropdown(!showDropdown)}
              aria-label="Profile"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
            {showDropdown && (
              <motion.div
                className="profile-dropdown"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="profile-dropdown-header">
                  <span className="profile-label">{userToken ? 'User Token' : 'Session ID'}</span>
                </div>
                <div className="profile-dropdown-content">
                  <code className="session-id">{displayCode}</code>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;

