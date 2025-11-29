const FiltersPanel = ({ subjects, activeSubjects, onToggle, search, onSearch }) => (
  <aside className="filters-panel">
    <h4>Refine results</h4>
    <label className="filter-field">
      <span>Search university</span>
      <input
        type="text"
        placeholder="e.g. Helsinki"
        value={search}
        onChange={(event) => onSearch(event.target.value)}
      />
    </label>
    <div className="filter-chips">
      {subjects.map((subject) => {
        const isActive = activeSubjects.includes(subject.id);
        return (
          <button
            key={subject.id}
            type="button"
            className={isActive ? 'chip active' : 'chip'}
            onClick={() => onToggle(subject.id)}
          >
            {subject.name}
          </button>
        );
      })}
    </div>
  </aside>
);

export default FiltersPanel;

