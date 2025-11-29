import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FiltersPanel from '../components/FiltersPanel.jsx';
import UniversityList from '../components/UniversityList.jsx';
import subjects from '../data/subjects.js';
import universities from '../data/universities.js';
import { universityMatchesSubjects } from '../data/subjectMapping.js';

const Universities = () => {
  const { countryCode } = useParams();
  const [activeSubjects, setActiveSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredUniversities = useMemo(() => {
    return universities
      .filter((uni) => (countryCode === 'global' ? true : uni.country === countryCode))
      .filter((uni) =>
        activeSubjects.length === 0
          ? true
          : universityMatchesSubjects(uni.specialisedsubj || uni.focus, activeSubjects),
      )
      .filter((uni) => uni.name.toLowerCase().includes(search.toLowerCase()));
  }, [countryCode, activeSubjects, search]);

  // Extract unique subjects from filtered universities
  const availableSubjects = useMemo(() => {
    const subjectSet = new Set();
    filteredUniversities.forEach((uni) => {
      const uniSubjects = uni.specialisedsubj || uni.focus || [];
      uniSubjects.forEach((subj) => subjectSet.add(subj));
    });
    return Array.from(subjectSet).sort();
  }, [filteredUniversities]);

  const toggleSubject = (subjectId) =>
    setActiveSubjects((prev) =>
      prev.includes(subjectId) ? prev.filter((id) => id !== subjectId) : [...prev, subjectId],
    );

  return (
    <section className="universities-page">
      <div className="page-header">
        <button className="ghost-button" type="button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div>
          <p className="eyebrow">Step 3</p>
          <h2>
            {countryCode === 'global' ? 'Global Curated Lists' : `Universities in ${countryCode}`}
          </h2>
          <p>Filter in real-time to reveal the experiences that feel easy and obvious.</p>
        </div>
      </div>
      <div className="universities-grid">
        <FiltersPanel
          subjects={availableSubjects.map((subj) => ({ id: subj, name: subj.charAt(0).toUpperCase() + subj.slice(1) }))}
          activeSubjects={activeSubjects}
          onToggle={toggleSubject}
          search={search}
          onSearch={setSearch}
        />
        <UniversityList universities={filteredUniversities} />
      </div>
    </section>
  );
};

export default Universities;

