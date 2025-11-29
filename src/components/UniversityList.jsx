import UniversityCard from './UniversityCard.jsx';

const UniversityList = ({ universities }) => (
  <section className="university-list">
    {universities.length === 0 ? (
      <p className="muted">Nothing matches your filters yet. Try selecting another subject.</p>
    ) : (
      universities.map((uni) => <UniversityCard key={uni.id} university={uni} />)
    )}
  </section>
);

export default UniversityList;

