import universitiesData from './universities.json';

// Transform JSON data to match the expected format
const universities = Object.entries(universitiesData).map(([id, data]) => ({
  id,
  name: data.name,
  country: data.location,
  city: data.city,
  focus: data.specialisedsubj,
  tags: data.tags || [],
  // Include additional fields from JSON
  minimumgpa: data.minimumgpa,
  satsmin: data.satsmin,
  requiresToefl: data.requiresToefl ?? null,
  requiresIelts: data.requiresIelts ?? null,
  toeflMin: data.toeflMin ?? null,
  ieltsMin: data.ieltsMin ?? null,
  averagescores: data.averagescores,
  specialisedsubj: data.specialisedsubj,
}));

export default universities;

