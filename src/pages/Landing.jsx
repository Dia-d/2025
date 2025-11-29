import { useMemo, useState } from 'react';
import Hero from '../components/Hero.jsx';
import SubjectGrid from '../components/SubjectGrid.jsx';
import WorldMap from '../components/WorldMap.jsx';
import subjects from '../data/subjects.js';
import { useUniversities } from '../context/UniversitiesContext.jsx';
import { universityMatchesSubjects } from '../data/subjectMapping.js';

const Landing = () => {
  const [activeSubjects, setActiveSubjects] = useState([subjects[0].id]);
  const { universities } = useUniversities();

  const highlightCountries = useMemo(() => {
    if (activeSubjects.length === 0) return { all: [], top: null };
    
    const matched = universities.filter((uni) =>
      universityMatchesSubjects(uni.specialisedsubj || uni.focus, activeSubjects),
    );
    
    // Count universities per country
    const countryCounts = {};
    matched.forEach((uni) => {
      const country = uni.country;
      if (country) {
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      }
    });
    
    // Find country with most universities
    const topCountry = Object.entries(countryCounts).reduce(
      (max, [country, count]) => (count > (max[1] || 0) ? [country, count] : max),
      [null, 0],
    )[0];
    
    const allCountries = [...new Set(matched.map((uni) => uni.country).filter(Boolean))];
    
    // Debug logging
    console.log('Landing - Highlight countries calculation:', { 
      all: allCountries, 
      top: topCountry, 
      activeSubjects,
      matchedCount: matched.length,
      universitiesCount: universities.length,
    });
    
    // Log sample universities to verify country codes
    if (matched.length > 0) {
      console.log('Sample matched universities:', matched.slice(0, 3).map(u => ({
        name: u.name,
        country: u.country,
        subjects: u.specialisedsubj || u.focus,
      })));
    }
    
    return {
      all: allCountries,
      top: topCountry,
    };
  }, [activeSubjects, universities]);

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

