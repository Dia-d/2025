import { useState, useEffect } from 'react';
import UniversityCard from './UniversityCard.jsx';

const ITEMS_PER_PAGE = 6;

const UniversityList = ({ universities }) => {
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(universities.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentUniversities = universities.slice(startIndex, endIndex);

  // Reset to first page when universities list changes
  useEffect(() => {
    setCurrentPage(0);
  }, [universities.length]);

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (universities.length === 0) {
    return (
      <section className="university-list">
        <p className="muted">Nothing matches your filters yet. Try selecting another subject.</p>
      </section>
    );
  }

  return (
    <section className="university-list">
      {/* University Cards - Show 6 per page */}
      {currentUniversities.map((uni) => <UniversityCard key={uni.id} university={uni} />)}

      {/* Page Info and Next Button */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem',
        marginTop: '2rem',
        padding: '1rem'
      }}>
        {/* Page Indicator */}
        <div style={{
          color: 'var(--muted)',
          fontSize: '0.9rem'
        }}>
          Page {currentPage + 1} of {totalPages} • Showing {startIndex + 1}-{Math.min(endIndex, universities.length)} of {universities.length} universities
        </div>

        {/* Next Button */}
        {currentPage < totalPages - 1 && (
          <button
            onClick={handleNext}
            style={{
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              border: 'none',
              background: 'var(--accent)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              transition: 'all 0.2s ease',
              minWidth: '200px'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Next →
          </button>
        )}

        {/* End of List Message */}
        {currentPage === totalPages - 1 && (
          <div style={{
            color: 'var(--muted)',
            fontSize: '0.9rem',
            fontStyle: 'italic'
          }}>
            End of results
          </div>
        )}
      </div>
    </section>
  );
};

export default UniversityList;

