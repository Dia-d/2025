import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoadmap } from '../context/RoadmapContext.jsx';
import { useUserCode } from '../context/UserCodeContext.jsx';
import { useUniversities } from '../context/UniversitiesContext.jsx';
import RoadmapProgress from '../components/RoadmapProgress.jsx';
import {
  getAllRequirements,
  getGroupLabel,
  REQUIREMENT_GROUPS,
  areDependenciesMet,
} from '../data/requirementsConfig.js';

const Roadmap = () => {
  const { universityId } = useParams();
  const navigate = useNavigate();
  const { code } = useUserCode();
  const { getUniversity } = useUniversities();
  const {
    roadmapData,
    loading,
    initializeRoadmap,
    updateRequirement,
    calculateProgress,
  } = useRoadmap();

  const university = useMemo(
    () => getUniversity(universityId),
    [universityId, getUniversity],
  );

  const countryCode = university?.country || null;

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

  const requirements = getAllRequirements(countryCode);
  const progress = calculateProgress(countryCode);
  const completedRequirements = Object.entries(roadmapData.requirements || {})
    .filter(([_, completed]) => completed)
    .map(([id]) => id);

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

        {groupOrder.map((groupKey) => {
          const groupRequirements = requirementsByGroup[groupKey] || [];
          if (groupRequirements.length === 0) return null;

          return (
            <div key={groupKey} className="roadmap-group panel">
              <header className="panel-header">
                <h3>{getGroupLabel(groupKey)}</h3>
                <p className="muted">
                  {groupRequirements.filter((req) =>
                    completedRequirements.includes(req.id),
                  ).length}{' '}
                  of {groupRequirements.length} completed
                </p>
              </header>
              <div className="roadmap-checklist">
                {groupRequirements.map((requirement) => {
                  const isCompleted =
                    roadmapData.requirements?.[requirement.id] || false;
                  const dependenciesMet = areDependenciesMet(
                    requirement,
                    completedRequirements,
                  );
                  const isDisabled = !dependenciesMet && !isCompleted;

                  return (
                    <div
                      key={requirement.id}
                      className={`roadmap-item ${isCompleted ? 'completed' : ''} ${
                        isDisabled ? 'disabled' : ''
                      }`}
                      onClick={() => {
                        if (!isDisabled) {
                          handleRequirementToggle(requirement.id, isCompleted);
                        }
                      }}
                      style={{
                        cursor: isDisabled ? 'not-allowed' : 'pointer',
                        opacity: isDisabled ? 0.6 : 1,
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
                      <div className="roadmap-item-content">
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
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Roadmap;
