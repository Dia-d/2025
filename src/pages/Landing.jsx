import { useMemo, useState } from 'react';
import Hero from '../components/Hero.jsx';
import SubjectGrid from '../components/SubjectGrid.jsx';
import WorldMap from '../components/WorldMap.jsx';
import subjects from '../data/subjects.js';
import universities from '../data/universities.js';

const Landing = () => {
  const [activeSubjects, setActiveSubjects] = useState([subjects[0].id]);

  const highlightCountries = useMemo(() => {
    if (activeSubjects.length === 0) return [];
    const matched = universities.filter((uni) =>
      activeSubjects.some((subject) => uni.focus.includes(subject)),
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

