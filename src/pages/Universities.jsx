import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FiltersPanel from '../components/FiltersPanel.jsx';
import UniversityList from '../components/UniversityList.jsx';
import { useUniversities } from '../context/UniversitiesContext.jsx';

const Universities = () => {
  const { countryCode } = useParams();
  const [activeSubjects, setActiveSubjects] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { universities } = useUniversities();

  // First filter by country only to get available subjects
  const countryFilteredUniversities = useMemo(() => {
    return universities.filter((uni) => 
      countryCode === 'global' ? true : uni.country === countryCode
    );
  }, [countryCode, universities]);

  // Extract unique subjects from country-filtered universities (before subject filtering)
  const availableSubjects = useMemo(() => {
    const subjectSet = new Set();
    countryFilteredUniversities.forEach((uni) => {
      const uniSubjects = uni.specialisedsubj || uni.focus || [];
      uniSubjects.forEach((subj) => subjectSet.add(subj));
    });
    return Array.from(subjectSet).sort();
  }, [countryFilteredUniversities]);

  // Now filter by subjects - directly check if university has the selected subject
  const filteredUniversities = useMemo(() => {
    return countryFilteredUniversities
      .filter((uni) => {
        if (activeSubjects.length === 0) return true;
        const uniSubjects = uni.specialisedsubj || uni.focus || [];
        // Check if university has at least one of the selected subjects
        return activeSubjects.some((selectedSubj) => 
          uniSubjects.includes(selectedSubj)
        );
      })
      .filter((uni) => uni.name.toLowerCase().includes(search.toLowerCase()));
  }, [countryFilteredUniversities, activeSubjects, search]);

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

