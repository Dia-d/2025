import { useMemo, useState } from 'react';
import Hero from '../components/Hero.jsx';
import SubjectGrid from '../components/SubjectGrid.jsx';
import WorldMap from '../components/WorldMap.jsx';
import subjects from '../data/subjects.js';
import { useUniversities } from '../context/UniversitiesContext.jsx';
import { universityMatchesSubjects } from '../data/subjectMapping.js';

const Landing = () => {
  const [activeSubjects, setActiveSubjects] = useState([]);
  const { universities } = useUniversities();

  const highlightCountries = useMemo(() => {
    console.log('🎯 Landing - Calculating highlights for subjects:', activeSubjects);
    console.log('🎯 Total universities:', universities.length);
    
    // If no subjects selected, don't highlight any countries
    if (activeSubjects.length === 0) {
      return { all: [], top: null };
    }
    
    const matched = universities.filter((uni) => {
      const subjects = uni.specialisedsubj || uni.focus;
      const matches = universityMatchesSubjects(subjects, activeSubjects);
      if (matches) {
        console.log(`✅ Matched: ${uni.name} (${uni.country}) - subjects:`, subjects);
      }
      return matches;
    });
    
    console.log('🎯 Total matched universities:', matched.length);
    
    // Count universities per country
    const countryCounts = {};
    matched.forEach((uni) => {
      const country = uni.country;
      if (country) {
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      }
    });
    
    console.log('🎯 Country counts:', countryCounts);
    
    // Find country with most universities
    const topCountryEntry = Object.entries(countryCounts).reduce(
      (max, [country, count]) => (count > (max[1] || 0) ? [country, count] : max),
      [null, 0],
    );
    
    const topCountry = topCountryEntry[1] > 0 ? topCountryEntry[0] : null;
    const allCountries = [...new Set(matched.map((uni) => uni.country).filter(Boolean))];
    
    console.log('🎯 Result:', {
      all: allCountries,
      top: topCountry,
      topCount: topCountryEntry[1]
    });
    
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

