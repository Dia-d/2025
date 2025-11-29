import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useUniversities } from '../context/UniversitiesContext.jsx';

const UniversityEditModal = ({ university, isOpen, onClose }) => {
  const { updateUniversity } = useUniversities();
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    country: '',
    minimumgpa: '',
    satsmin: '',
    requiresToefl: false,
    requiresIelts: false,
    toeflMin: '',
    ieltsMin: '',
    specialisedsubj: [],
    tags: [],
  });
  const [subjectInput, setSubjectInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (university && isOpen) {
      setFormData({
        name: university.name || '',
        city: university.city || '',
        country: university.country || '',
        minimumgpa: university.minimumgpa?.toString() || '',
        satsmin: university.satsmin?.toString() || '',
        requiresToefl: university.requiresToefl ?? false,
        requiresIelts: university.requiresIelts ?? false,
        toeflMin: university.toeflMin?.toString() || '',
        ieltsMin: university.ieltsMin?.toString() || '',
        specialisedsubj: [...(university.specialisedsubj || university.focus || [])],
        tags: [...(university.tags || [])],
      });
    }
  }, [university, isOpen]);

  if (!isOpen || !university) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const updates = {
      name: formData.name.trim(),
      city: formData.city.trim(),
      country: formData.country.trim().toUpperCase(),
      minimumgpa: formData.minimumgpa ? parseFloat(formData.minimumgpa) : null,
      satsmin: formData.satsmin ? parseInt(formData.satsmin, 10) : null,
      requiresToefl: formData.requiresToefl,
      requiresIelts: formData.requiresIelts,
      toeflMin: formData.toeflMin ? parseInt(formData.toeflMin, 10) : null,
      ieltsMin: formData.ieltsMin ? parseFloat(formData.ieltsMin) : null,
      specialisedsubj: formData.specialisedsubj,
      tags: formData.tags,
    };

    updateUniversity(university.id, updates);
    onClose();
  };

  const addSubject = () => {
    const subject = subjectInput.trim().toLowerCase();
    if (subject && !formData.specialisedsubj.includes(subject)) {
      setFormData((prev) => ({
        ...prev,
        specialisedsubj: [...prev.specialisedsubj, subject],
      }));
      setSubjectInput('');
    }
  };

  const removeSubject = (subject) => {
    setFormData((prev) => ({
      ...prev,
      specialisedsubj: prev.specialisedsubj.filter((s) => s !== subject),
    }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div
        className="modal-content"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Edit University</h2>
          <button type="button" className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label htmlFor="name">University Name</label>
            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input
                id="city"
                type="text"
                value={formData.city}
                onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="country">Country Code</label>
              <input
                id="country"
                type="text"
                value={formData.country}
                onChange={(e) => setFormData((prev) => ({ ...prev, country: e.target.value.toUpperCase() }))}
                maxLength={2}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="minimumgpa">Minimum GPA</label>
              <input
                id="minimumgpa"
                type="number"
                step="0.1"
                min="0"
                max="4"
                value={formData.minimumgpa}
                onChange={(e) => setFormData((prev) => ({ ...prev, minimumgpa: e.target.value }))}
                placeholder="e.g., 3.5"
              />
            </div>
            <div className="form-group">
              <label htmlFor="satsmin">Minimum SAT Score</label>
              <input
                id="satsmin"
                type="number"
                min="400"
                max="1600"
                value={formData.satsmin}
                onChange={(e) => setFormData((prev) => ({ ...prev, satsmin: e.target.value }))}
                placeholder="e.g., 1500"
              />
            </div>
          </div>

          <div className="form-section">
            <h3>Language Requirements</h3>
            <div className="form-row">
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.requiresToefl}
                    onChange={(e) => setFormData((prev) => ({ ...prev, requiresToefl: e.target.checked }))}
                  />
                  Requires TOEFL
                </label>
                {formData.requiresToefl && (
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={formData.toeflMin}
                    onChange={(e) => setFormData((prev) => ({ ...prev, toeflMin: e.target.value }))}
                    placeholder="Min TOEFL score"
                    style={{ marginTop: '0.5rem' }}
                  />
                )}
              </div>
              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.requiresIelts}
                    onChange={(e) => setFormData((prev) => ({ ...prev, requiresIelts: e.target.checked }))}
                  />
                  Requires IELTS
                </label>
                {formData.requiresIelts && (
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="9"
                    value={formData.ieltsMin}
                    onChange={(e) => setFormData((prev) => ({ ...prev, ieltsMin: e.target.value }))}
                    placeholder="Min IELTS score"
                    style={{ marginTop: '0.5rem' }}
                  />
                )}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="subjects">Specialized Subjects</label>
            <div className="input-with-button">
              <input
                id="subjects"
                type="text"
                value={subjectInput}
                onChange={(e) => setSubjectInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSubject();
                  }
                }}
                placeholder="Add subject (e.g., engineering)"
              />
              <button type="button" onClick={addSubject} className="add-button">
                Add
              </button>
            </div>
            <div className="tag-list">
              {formData.specialisedsubj.map((subject) => (
                <span key={subject} className="tag-item">
                  {subject}
                  <button
                    type="button"
                    onClick={() => removeSubject(subject)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <div className="input-with-button">
              <input
                id="tags"
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Add tag (e.g., Ivy League)"
              />
              <button type="button" onClick={addTag} className="add-button">
                Add
              </button>
            </div>
            <div className="tag-list">
              {formData.tags.map((tag) => (
                <span key={tag} className="tag-item">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="tag-remove"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="ghost-button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="cta-button">
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UniversityEditModal;

