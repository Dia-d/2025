import { useMemo, useState } from 'react';
import Hero from '../components/Hero.jsx';
import SubjectGrid from '../components/SubjectGrid.jsx';
import WorldMap from '../components/WorldMap.jsx';
import subjects from '../data/subjects.js';
import universities from '../data/universities.js';
import { universityMatchesSubjects } from '../data/subjectMapping.js';

const Landing = () => {
  const [activeSubjects, setActiveSubjects] = useState([subjects[0].id]);

  const highlightCountries = useMemo(() => {
    if (activeSubjects.length === 0) return [];
    const matched = universities.filter((uni) =>
      universityMatchesSubjects(uni.specialisedsubj || uni.focus, activeSubjects),
    );
    return [...new Set(matched.map((uni) => uni.country))];
  }, [activeSubjects]);

  const toggleSubject = (subjectId) =>
    setActiveSubjects((prev) =>
      prev.includes(subjectId)
        ? prev.filter((id) => id !== subjectId)
        : [...prev, subjectId],
    );

  return (
    <>
      <Hero />
      <SubjectGrid subjects={subjects} activeSubjects={activeSubjects} onToggle={toggleSubject} />
      <WorldMap highlightCountries={highlightCountries} />
    </>
  );
};

export default Landing;

