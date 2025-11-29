import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoadmap } from '../context/RoadmapContext.jsx';
import { useUserCode } from '../context/UserCodeContext.jsx';
import { useUniversities } from '../context/UniversitiesContext.jsx';
import RoadmapProgress from '../components/RoadmapProgress.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import CompletionDialog from '../components/CompletionDialog.jsx';
import AutoCompleteNotification from '../components/AutoCompleteNotification.jsx';
import {
  getAllRequirements,
  getGroupLabel,
  REQUIREMENT_GROUPS,
  areDependenciesMet,
} from '../data/requirementsConfig.js';

const Roadmap = () => {
  // All hooks must be at the top level
  const [currentPage, setCurrentPage] = useState(0);
  const [expandedNotes, setExpandedNotes] = useState({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [hasShownCompletion, setHasShownCompletion] = useState(false);
  const [showAutoCompleteNotification, setShowAutoCompleteNotification] = useState(false);
  const [autoCompletedItems, setAutoCompletedItems] = useState([]);
  const { universityId } = useParams();
  const navigate = useNavigate();
  const { code } = useUserCode();
  const { getUniversity } = useUniversities();
  const {
    roadmapData,
    loading,
    initializeRoadmap,
    updateRequirement,
    updateNote,
    calculateProgress,
  } = useRoadmap();

  const university = useMemo(
    () => getUniversity(universityId),
    [universityId, getUniversity],
  );

  const countryCode = university?.country || null;

  const requirements = useMemo(() => getAllRequirements(countryCode), [countryCode]);
  const progress = useMemo(() => calculateProgress(countryCode), [calculateProgress, countryCode]);
  const completedRequirements = useMemo(() => 
    Object.entries(roadmapData?.requirements || {})
      .filter(([_, completed]) => completed)
      .map(([id]) => id),
    [roadmapData]
  );

  // Group requirements by group type
  const requirementsByGroup = useMemo(() => {
    const grouped = {};
    requirements.forEach((req) => {
      if (!grouped[req.group]) {
        grouped[req.group] = [];
      }
      grouped[req.group].push(req);
    });
    return grouped;
  }, [requirements]);

  useEffect(() => {
    if (!code) {
      navigate('/');
      return;
    }

    if (universityId && !roadmapData) {
      initializeRoadmap(universityId, countryCode);
    } else if (
      universityId &&
      (roadmapData?.university_id !== universityId ||
        roadmapData?.country_code !== countryCode)
    ) {
      initializeRoadmap(universityId, countryCode);
    }
  }, [code, universityId, roadmapData, countryCode, initializeRoadmap, navigate]);

  // Check for completion and show dialog
  useEffect(() => {
    if (progress.percentage === 100 && !hasShownCompletion && roadmapData) {
      setShowCompletionDialog(true);
      setHasShownCompletion(true);
    }
  }, [progress.percentage, hasShownCompletion, roadmapData]);

  // Check for auto-completed requirements and show notification
  useEffect(() => {
    if (roadmapData && roadmapData.autoCompleted && roadmapData.autoCompleted.length > 0) {
      const autoCompletedLabels = roadmapData.autoCompleted
        .map(reqId => {
          const req = requirements.find(r => r.id === reqId);
          return req ? req.label : null;
        })
        .filter(Boolean);
      
      if (autoCompletedLabels.length > 0) {
        setAutoCompletedItems(autoCompletedLabels);
        setShowAutoCompleteNotification(true);
        
        // Clear the autoCompleted flag so notification doesn't show again
        const updatedData = { ...roadmapData };
        delete updatedData.autoCompleted;
        // Note: We don't save this back to avoid unnecessary saves
      }
    }
  }, [roadmapData, requirements]);

  // Early returns after all hooks
  if (loading || !roadmapData) {
    return (
      <section className="roadmap-page">
        <div className="page-header">
          <button className="ghost-button" type="button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div>
            <p className="eyebrow">Loading roadmap...</p>
          </div>
        </div>
      </section>
    );
  }

  if (!university) {
    return (
      <section className="roadmap-page">
        <div className="page-header">
          <button className="ghost-button" type="button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div>
            <p className="eyebrow">University Not Found</p>
            <h2>University not found</h2>
            <p>The university you are looking for does not exist.</p>
          </div>
        </div>
      </section>
    );
  }

  // Group order for display
  const groupOrder = [
    REQUIREMENT_GROUPS.ACADEMIC,
    REQUIREMENT_GROUPS.LANGUAGE,
    REQUIREMENT_GROUPS.DOCUMENTS,
    REQUIREMENT_GROUPS.FINANCIAL,
    REQUIREMENT_GROUPS.VISA,
  ];

  const handleRequirementToggle = (requirementId, currentValue) => {
    // Check if dependencies are met before allowing toggle
    const requirement = requirements.find((req) => req.id === requirementId);
    if (!requirement) return;

    // If trying to uncheck, allow it
    if (currentValue) {
      updateRequirement(requirementId, false);
      return;
    }

    // If trying to check, verify dependencies
    if (areDependenciesMet(requirement, completedRequirements)) {
      updateRequirement(requirementId, true);
    }
  };

  // Get current group based on page
  const currentGroup = groupOrder[currentPage];
  const currentGroupRequirements = requirementsByGroup[currentGroup] || [];
  const totalPages = groupOrder.filter(key => (requirementsByGroup[key] || []).length > 0).length;

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      // Check if we're on the first page (Academic Requirements)
      if (currentPage === 0) {
        const firstSectionRequirements = currentGroupRequirements;
        const completedInFirstSection = firstSectionRequirements.filter((req) =>
          completedRequirements.includes(req.id)
        ).length;
        
        // If not all requirements are completed, show confirmation dialog
        if (completedInFirstSection < firstSectionRequirements.length) {
          setShowConfirmDialog(true);
          return;
        }
      }
      
      setCurrentPage(currentPage + 1);
    }
  };

  const handleConfirmProceed = () => {
    setShowConfirmDialog(false);
    setCurrentPage(currentPage + 1);
  };

  const handleCancelProceed = () => {
    setShowConfirmDialog(false);
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const toggleNoteExpansion = (requirementId) => {
    setExpandedNotes(prev => ({
      ...prev,
      [requirementId]: !prev[requirementId]
    }));
  };

  const handleNoteChange = (requirementId, note) => {
    updateNote(requirementId, note);
  };

  return (
    <section className="roadmap-page">
      <div className="page-header">
        <button className="ghost-button" type="button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div>
          <p className="eyebrow">Your Study Roadmap</p>
          <h2>{university.name}</h2>
          <p>
            Track your progress for {university.name} in {university.city},{' '}
            {university.country}. Complete requirements in order.
          </p>
        </div>
      </div>

      <div className="roadmap-content">
        {/* Overall Progress */}
        <div className="roadmap-overview panel">
          <header className="panel-header">
            <h3>Overall Progress</h3>
            <p className="muted">
              {progress.completedCount} of {progress.totalCount} requirements completed
            </p>
          </header>
          <RoadmapProgress progress={progress.percentage} />
          <div
            style={{
              marginTop: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.9rem',
              color: 'var(--muted)',
            }}
          >
            <span>Score: {progress.score} / {progress.totalScore} points</span>
            <span>{progress.percentage.toFixed(1)}% Complete</span>
          </div>
        </div>

        {/* Page Indicator */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          gap: '0.5rem',
          margin: '1.5rem 0'
        }}>
          {groupOrder.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index)}
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                border: 'none',
                background: index === currentPage ? 'var(--accent)' : 'var(--muted)',
                cursor: 'pointer',
                opacity: index === currentPage ? 1 : 0.5,
                transition: 'all 0.3s ease'
              }}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>

        {/* Current Section */}
        <div className="roadmap-group panel">
          <header className="panel-header">
            <h3>{getGroupLabel(currentGroup)}</h3>
            <p className="muted">
              {currentGroupRequirements.filter((req) =>
                completedRequirements.includes(req.id),
              ).length}{' '}
              of {currentGroupRequirements.length} completed
            </p>
          </header>
          <div className="roadmap-checklist">
            {currentGroupRequirements.map((requirement) => {
              const isCompleted =
                roadmapData.requirements?.[requirement.id] || false;
              const dependenciesMet = areDependenciesMet(
                requirement,
                completedRequirements,
              );
              const isDisabled = !dependenciesMet && !isCompleted;
              const note = roadmapData.notes?.[requirement.id] || '';
              const isNoteExpanded = expandedNotes[requirement.id] || false;

              return (
                <div
                  key={requirement.id}
                  className={`roadmap-item ${isCompleted ? 'completed' : ''} ${
                    isDisabled ? 'disabled' : ''
                  }`}
                  style={{
                    opacity: isDisabled ? 0.6 : 1,
                    marginBottom: '1rem'
                  }}
                >
                  <div 
                    onClick={() => {
                      if (!isDisabled) {
                        handleRequirementToggle(requirement.id, isCompleted);
                      }
                    }}
                    style={{
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem'
                    }}
                  >
                    <div className="roadmap-item-checkbox">
                      {isCompleted && (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9.5 14.25a.75.75 0 0 1-1.172.025L2.233 10.53a.75.75 0 0 1 .842-1.085l5.916 4.645 8.58-12.87a.75.75 0 0 1 1.04-.207Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="roadmap-item-content" style={{ flex: 1 }}>
                      <div className="roadmap-item-header">
                        <div>
                          <h4>{requirement.label}</h4>
                          <p className="roadmap-item-description">
                            {requirement.description}
                          </p>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-end',
                            gap: '0.25rem',
                          }}
                        >
                          <span
                            className="roadmap-item-score"
                            style={{
                              fontSize: '0.85rem',
                              color: 'var(--accent)',
                              fontWeight: '600',
                            }}
                          >
                            {requirement.score} pts
                          </span>
                          <span
                            className="roadmap-item-level"
                            style={{
                              fontSize: '0.75rem',
                              color: 'var(--muted)',
                            }}
                          >
                            Level {requirement.level}
                          </span>
                        </div>
                      </div>
                      {requirement.dependencies.length > 0 && (
                        <div
                          className="roadmap-item-dependencies"
                          style={{
                            marginTop: '0.5rem',
                            fontSize: '0.8rem',
                            color: 'var(--muted)',
                          }}
                        >
                          {isDisabled ? (
                            <span style={{ color: '#ef4444' }}>
                              ⚠ Requires:{' '}
                              {requirement.dependencies
                                .map((depId) => {
                                  const dep = requirements.find((r) => r.id === depId);
                                  return dep?.label || depId;
                                })
                                .join(', ')}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--accent)' }}>
                              ✓ Prerequisites met
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="roadmap-item-status">
                      {isCompleted ? (
                        <span className="status-badge completed">Completed</span>
                      ) : (
                        <span className="status-badge pending">Pending</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Notes Section */}
                  <div style={{ marginTop: '0.75rem', paddingLeft: '3rem' }}>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNoteExpansion(requirement.id);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--accent)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        padding: '0.25rem 0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        style={{ width: '16px', height: '16px' }}
                      >
                        <path d="M3 3.5A1.5 1.5 0 0 1 4.5 2h6.879a1.5 1.5 0 0 1 1.06.44l4.122 4.12A1.5 1.5 0 0 1 17 7.622V16.5a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 3 16.5v-13Z" />
                      </svg>
                      {isNoteExpanded ? 'Hide Notes' : note ? 'View/Edit Notes' : 'Add Notes'}
                    </button>
                    {isNoteExpanded && (
                      <textarea
                        value={note}
                        onChange={(e) => handleNoteChange(requirement.id, e.target.value)}
                        placeholder="Add your notes here for future reference..."
                        style={{
                          width: '100%',
                          minHeight: '80px',
                          marginTop: '0.5rem',
                          padding: '0.75rem',
                          borderRadius: '0.5rem',
                          border: '1px solid var(--border)',
                          background: 'var(--bg-secondary)',
                          color: 'var(--text)',
                          fontSize: '0.9rem',
                          fontFamily: 'inherit',
                          resize: 'vertical'
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginTop: '2rem',
          gap: '1rem'
        }}>
          <button
            className="ghost-button"
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            style={{
              opacity: currentPage === 0 ? 0.5 : 1,
              cursor: currentPage === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            ← Previous Section
          </button>
          <button
            className="ghost-button"
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            style={{
              opacity: currentPage === totalPages - 1 ? 0.5 : 1,
              cursor: currentPage === totalPages - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Next Section →
          </button>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onClose={handleCancelProceed}
        onConfirm={handleConfirmProceed}
        title="Academic Requirements Incomplete"
        message="Without completing these foundational requirements, going ahead might be meaningless. Are you sure you want to proceed?"
        completedCount={currentGroupRequirements.filter((req) =>
          completedRequirements.includes(req.id)
        ).length}
        totalCount={currentGroupRequirements.length}
      />

      {/* Completion Dialog */}
      <CompletionDialog
        isOpen={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        universityName={university.name}
      />

      {/* Auto-Complete Notification */}
      <AutoCompleteNotification
        isVisible={showAutoCompleteNotification}
        autoCompletedItems={autoCompletedItems}
        onClose={() => setShowAutoCompleteNotification(false)}
      />
    </section>
  );
};

export default Roadmap;
