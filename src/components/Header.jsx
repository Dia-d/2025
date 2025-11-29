import { useState, useRef, useEffect, useMemo } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserCode } from '../context/UserCodeContext.jsx';
import { useUniversities } from '../context/UniversitiesContext.jsx';
import LogoutDialog from './LogoutDialog.jsx';

const Header = () => {
  const { code, clearCode } = useUserCode();
  const { universities } = useUniversities();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const dropdownRef = useRef(null);
  
  // Check if user has a token (for now, we'll use code as session ID)
  // In the future, you can add a separate token check here
  const userToken = null; // Replace with actual token check when you implement login
  const displayCode = userToken || code;

  // Get completed universities
  const completedUniversities = useMemo(() => {
    if (!code) return [];
    
    try {
      const STORAGE_KEY = 'yonko_roadmap_data';
      const stored = typeof window !== 'undefined' ? window.localStorage.getItem(`${STORAGE_KEY}_${code}`) : null;
      
      console.log('🏆 Checking achievements for code:', code);
      console.log('🏆 LocalStorage data:', stored);
      
      if (!stored) {
        console.log('🏆 No data in localStorage');
        return [];
      }
      
      const allRoadmaps = JSON.parse(stored);
      console.log('🏆 All roadmaps:', allRoadmaps);
      
      const completed = [];
      
      // Check if data is in the format { roadmaps: { ... } } or just { ... }
      const roadmapsData = allRoadmaps.roadmaps || allRoadmaps;
      
      Object.entries(roadmapsData).forEach(([uniId, roadmap]) => {
        console.log(`🏆 Checking ${uniId}:`, roadmap);
        
        if (roadmap && roadmap.requirements) {
          const totalReqs = Object.keys(roadmap.requirements).length;
          const completedReqs = Object.values(roadmap.requirements).filter(Boolean).length;
          
          console.log(`🏆 ${uniId}: ${completedReqs}/${totalReqs} requirements completed`);
          
          if (totalReqs > 0 && completedReqs === totalReqs) {
            const uni = universities.find(u => u.id === uniId);
            console.log(`🏆 Found completed university:`, uni);
            
            if (uni) {
              completed.push({
                id: uniId,
                name: uni.name,
                country: uni.country,
                city: uni.city,
                image_url: uni.image_url,
                rank: uni.rank
              });
            }
          }
        }
      });
      
      console.log('🏆 Total completed universities:', completed);
      return completed;
    } catch (error) {
      console.error('🏆 Error loading achievements:', error);
      return [];
    }
  }, [code, universities, refreshKey]);

  // Refresh achievements when dropdown opens
  useEffect(() => {
    if (showDropdown) {
      setRefreshKey(prev => prev + 1);
    }
  }, [showDropdown]);

  const handleLogout = () => {
    setShowLogoutDialog(true);
    setShowDropdown(false);
  };

  const confirmLogout = () => {
    clearCode();
    setShowLogoutDialog(false);
    navigate('/');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(displayCode);
    alert('Session ID copied to clipboard!');
  };

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
                  <button
                    type="button"
                    className="dropdown-button copy-button"
                    onClick={handleCopyCode}
                    style={{
                      marginTop: '0.5rem',
                      width: '100%',
                      padding: '0.5rem',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border)',
                      borderRadius: '0.375rem',
                      color: 'var(--text)',
                      cursor: 'pointer',
                      fontSize: '0.875rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      style={{ width: '16px', height: '16px' }}
                    >
                      <path d="M7 3.5A1.5 1.5 0 0 1 8.5 2h3.879a1.5 1.5 0 0 1 1.06.44l3.122 3.12A1.5 1.5 0 0 1 17 6.622V12.5a1.5 1.5 0 0 1-1.5 1.5h-1v-3.379a3 3 0 0 0-.879-2.121L10.5 5.379A3 3 0 0 0 8.379 4.5H7v-1Z" />
                      <path d="M4.5 6A1.5 1.5 0 0 0 3 7.5v9A1.5 1.5 0 0 0 4.5 18h7a1.5 1.5 0 0 0 1.5-1.5v-5.879a1.5 1.5 0 0 0-.44-1.06L9.44 6.439A1.5 1.5 0 0 0 8.378 6H4.5Z" />
                    </svg>
                    Copy ID
                  </button>
                </div>

                {/* Achievements Section */}
                <div className="profile-dropdown-divider" style={{
                  height: '1px',
                  background: 'var(--border)',
                  margin: '0.75rem 0'
                }} />
                
                <button
                  type="button"
                  onClick={() => setShowAchievements(!showAchievements)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(135, 245, 214, 0.1)',
                    border: '1px solid rgba(135, 245, 214, 0.2)',
                    borderRadius: '0.5rem',
                    color: 'var(--accent)',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(135, 245, 214, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(135, 245, 214, 0.1)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.2rem' }}>🏆</span>
                    <span>My Achievements</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{
                      background: 'var(--accent)',
                      color: '#04121b',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '0.25rem',
                      fontSize: '0.75rem',
                      fontWeight: '700'
                    }}>
                      {completedUniversities.length}
                    </span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      style={{
                        width: '16px',
                        height: '16px',
                        transform: showAchievements ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s'
                      }}
                    >
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
                    </svg>
                  </div>
                </button>

                {/* Achievements List */}
                {showAchievements && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    style={{
                      marginTop: '0.75rem',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem'
                    }}
                  >
                    {completedUniversities.length === 0 ? (
                      <div style={{
                        padding: '1rem',
                        textAlign: 'center',
                        color: 'var(--muted)',
                        fontSize: '0.85rem'
                      }}>
                        No completed universities yet. Start your journey!
                      </div>
                    ) : (
                      completedUniversities.map((uni) => (
                        <div
                          key={uni.id}
                          onClick={() => {
                            navigate(`/roadmap/${uni.id}`);
                            setShowDropdown(false);
                          }}
                          style={{
                            padding: '0.75rem',
                            background: 'rgba(135, 245, 214, 0.05)',
                            border: '1px solid rgba(135, 245, 214, 0.2)',
                            borderRadius: '0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            position: 'relative',
                            overflow: 'hidden'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(135, 245, 214, 0.1)';
                            e.currentTarget.style.transform = 'translateX(4px)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(135, 245, 214, 0.2)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(135, 245, 214, 0.05)';
                            e.currentTarget.style.transform = 'translateX(0)';
                            e.currentTarget.style.boxShadow = 'none';
                          }}
                        >
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                          }}>
                            {/* University Badge/Logo */}
                            <div style={{
                              width: '48px',
                              height: '48px',
                              borderRadius: '0.5rem',
                              background: 'rgba(255, 255, 255, 0.05)',
                              border: '1px solid rgba(135, 245, 214, 0.3)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              overflow: 'hidden',
                              position: 'relative'
                            }}>
                              {uni.image_url ? (
                                <img 
                                  src={uni.image_url} 
                                  alt={`${uni.name} badge`}
                                  style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain',
                                    padding: '4px'
                                  }}
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div style={{
                                display: uni.image_url ? 'none' : 'flex',
                                width: '100%',
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                color: 'var(--accent)',
                                background: 'linear-gradient(135deg, rgba(135, 245, 214, 0.2), rgba(138, 210, 255, 0.2))'
                              }}>
                                {uni.name.charAt(0)}
                              </div>
                            </div>

                            {/* University Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '0.25rem'
                              }}>
                                <span style={{
                                  fontSize: '0.9rem',
                                  fontWeight: '600',
                                  color: 'var(--text)',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {uni.name}
                                </span>
                                {uni.rank && (
                                  <span style={{
                                    fontSize: '0.7rem',
                                    padding: '0.15rem 0.4rem',
                                    background: 'var(--accent)',
                                    color: '#04121b',
                                    borderRadius: '0.25rem',
                                    fontWeight: '700',
                                    flexShrink: 0
                                  }}>
                                    #{uni.rank}
                                  </span>
                                )}
                              </div>
                              <div style={{
                                fontSize: '0.75rem',
                                color: 'var(--muted)',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}>
                                <span>📍</span>
                                <span>{uni.city}, {uni.country}</span>
                              </div>
                            </div>

                            {/* Completion Checkmark */}
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: 'var(--accent)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="#04121b"
                                style={{ width: '14px', height: '14px' }}
                              >
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </motion.div>
                )}

                <div className="profile-dropdown-divider" style={{
                  height: '1px',
                  background: 'var(--border)',
                  margin: '0.75rem 0'
                }} />
                <button
                  type="button"
                  className="dropdown-button logout-button"
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'transparent',
                    border: 'none',
                    borderRadius: '0.375rem',
                    color: '#ef4444',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    style={{ width: '16px', height: '16px' }}
                  >
                    <path fillRule="evenodd" d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z" clipRule="evenodd" />
                    <path fillRule="evenodd" d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z" clipRule="evenodd" />
                  </svg>
                  Change Session / Logout
                </button>
              </motion.div>
            )}
          </div>
        )}
      </nav>

      {/* Logout Confirmation Dialog */}
      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={confirmLogout}
        sessionId={displayCode}
      />
    </header>
  );
};

export default Header;

