import SubjectCard from './SubjectCard.jsx';

const SubjectGrid = ({ subjects, activeSubjects, onToggle }) => (
  <section id="subjects" className="panel">
    <header className="panel-header">
      <p className="eyebrow">Step 1</p>
      <h2>Select the subjects guiding your study plan</h2>
      <p>Choose multiple tracks to unlock universities specializing in your blend.</p>
    </header>
    <div className="subject-grid">
      {subjects.map((subject) => (
        <SubjectCard
          key={subject.id}
          subject={subject}
          isActive={activeSubjects.includes(subject.id)}
          onSelect={onToggle}
        />
      ))}
    </div>
  </section>
);

export default SubjectGrid;

