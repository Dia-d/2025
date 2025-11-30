import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUniversities } from '../context/UniversitiesContext.jsx';
import { motion } from 'framer-motion';

const FurtherProgress = () => {
  const { universityId } = useParams();
  const navigate = useNavigate();
  const { getUniversity } = useUniversities();
  
  const university = useMemo(
    () => getUniversity(universityId),
    [universityId, getUniversity],
  );

  if (!university) {
    return (
      <section className="roadmap-page">
        <div className="page-header">
          <button className="ghost-button" type="button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div>
            <p className="eyebrow">University Not Found</p>
          </div>
        </div>
      </section>
    );
  }

  const subjects = university.specialisedsubj || university.focus || [];

  // ECA recommendations based on subjects
  const getECARecommendations = () => {
    const recommendations = [];
    
    subjects.forEach(subject => {
      switch(subject.toLowerCase()) {
        case 'computer science':
        case 'engineering':
          recommendations.push(
            { title: 'Hackathons & Coding Competitions', description: 'Participate in MLH hackathons, Google Code Jam, or local coding competitions', icon: '💻' },
            { title: 'Open Source Contributions', description: 'Contribute to GitHub projects and build your developer portfolio', icon: '🔧' },
            { title: 'Robotics Club', description: 'Join robotics teams and compete in competitions like FIRST Robotics', icon: '🤖' }
          );
          break;
        case 'business and economics':
        case 'business':
          recommendations.push(
            { title: 'Business Case Competitions', description: 'Compete in case competitions like Hult Prize or local business challenges', icon: '💼' },
            { title: 'Entrepreneurship Club', description: 'Start or join a startup incubator on campus', icon: '🚀' },
            { title: 'Investment Club', description: 'Manage a student investment fund and learn portfolio management', icon: '📈' }
          );
          break;
        case 'clinical and health':
        case 'life sciences':
          recommendations.push(
            { title: 'Medical Volunteering', description: 'Volunteer at hospitals, clinics, or health camps', icon: '🏥' },
            { title: 'Research Assistant', description: 'Work with professors on biomedical research projects', icon: '🔬' },
            { title: 'Health Awareness Campaigns', description: 'Organize health drives and awareness programs', icon: '❤️' }
          );
          break;
        case 'arts and humanities':
        case 'education':
          recommendations.push(
            { title: 'Debate & Public Speaking', description: 'Join debate clubs, Model UN, or Toastmasters', icon: '🎤' },
            { title: 'Literary Magazine', description: 'Write for or edit student publications and literary journals', icon: '📚' },
            { title: 'Community Teaching', description: 'Tutor underprivileged students or teach at community centers', icon: '👨‍🏫' }
          );
          break;
        case 'law':
          recommendations.push(
            { title: 'Moot Court Competitions', description: 'Participate in national and international moot court competitions', icon: '⚖️' },
            { title: 'Legal Aid Clinic', description: 'Provide free legal assistance to those in need', icon: '📋' },
            { title: 'Debate Society', description: 'Sharpen your argumentation skills through competitive debate', icon: '🗣️' }
          );
          break;
        case 'social sciences':
        case 'psychology':
          recommendations.push(
            { title: 'Research Projects', description: 'Conduct social research and present at conferences', icon: '📊' },
            { title: 'Community Outreach', description: 'Work with NGOs on social development projects', icon: '🤝' },
            { title: 'Psychology Club', description: 'Organize workshops on mental health and wellbeing', icon: '🧠' }
          );
          break;
      }
    });

    // Remove duplicates
    const unique = recommendations.filter((rec, index, self) =>
      index === self.findIndex((r) => r.title === rec.title)
    );

    return unique.slice(0, 6);
  };

  // Skill development recommendations
  const getSkillRecommendations = () => {
    const skills = [];
    
    subjects.forEach(subject => {
      switch(subject.toLowerCase()) {
        case 'computer science':
        case 'engineering':
          skills.push(
            { title: 'Advanced Programming', description: 'Master Python, Java, C++, or specialized languages', category: 'Technical' },
            { title: 'Cloud Computing', description: 'Get AWS, Azure, or Google Cloud certifications', category: 'Technical' },
            { title: 'Machine Learning', description: 'Complete courses on ML, AI, and data science', category: 'Technical' }
          );
          break;
        case 'business and economics':
          skills.push(
            { title: 'Financial Modeling', description: 'Learn Excel, financial analysis, and valuation techniques', category: 'Professional' },
            { title: 'Data Analytics', description: 'Master Tableau, Power BI, and SQL for business intelligence', category: 'Technical' },
            { title: 'Leadership Training', description: 'Develop management and team leadership skills', category: 'Soft Skills' }
          );
          break;
        case 'clinical and health':
          skills.push(
            { title: 'Medical Certifications', description: 'Get CPR, First Aid, or specialized medical certifications', category: 'Professional' },
            { title: 'Research Methods', description: 'Learn clinical research methodologies and biostatistics', category: 'Academic' },
            { title: 'Patient Communication', description: 'Develop empathy and communication skills for healthcare', category: 'Soft Skills' }
          );
          break;
      }
    });

    const unique = skills.filter((skill, index, self) =>
      index === self.findIndex((s) => s.title === skill.title)
    );

    return unique.slice(0, 6);
  };

  // Networking opportunities
  const getNetworkingOpportunities = () => {
    return [
      { title: 'Alumni Networking Events', description: 'Connect with university alumni in your field', icon: '👥' },
      { title: 'Industry Conferences', description: 'Attend conferences related to your major', icon: '🎯' },
      { title: 'LinkedIn Optimization', description: 'Build a strong professional profile and network', icon: '💼' },
      { title: 'Professional Associations', description: 'Join field-specific professional organizations', icon: '🏛️' },
      { title: 'Mentorship Programs', description: 'Find mentors in your industry of interest', icon: '🌟' },
      { title: 'Career Fairs', description: 'Attend university and industry career fairs', icon: '🎪' }
    ];
  };

  const ecaRecommendations = getECARecommendations();
  const skillRecommendations = getSkillRecommendations();
  const networkingOpportunities = getNetworkingOpportunities();

  return (
    <section className="roadmap-page">
      <div className="page-header">
        <button className="ghost-button" type="button" onClick={() => navigate(-1)}>
          ← Back to Roadmap
        </button>
        <div>
          <p className="eyebrow">Further Your Progress</p>
          <h2>Stand Out at {university.name}</h2>
          <p>
            Personalized recommendations based on your course: {subjects.slice(0, 3).join(', ')}
          </p>
        </div>
      </div>

      <div className="roadmap-content">
        {/* ECA Recommendations */}
        <motion.div 
          className="panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <header className="panel-header">
            <h3>🎯 Extra-Curricular Activities</h3>
            <p className="muted">
              Boost your profile with these activities tailored to your field
            </p>
          </header>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            {ecaRecommendations.map((eca, index) => (
              <motion.div
                key={index}
                className="university-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                style={{ cursor: 'default' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{eca.icon}</div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{eca.title}</h4>
                <p className="muted" style={{ fontSize: '0.9rem', margin: 0 }}>
                  {eca.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Skill Development */}
        <motion.div 
          className="panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <header className="panel-header">
            <h3>📚 Skill Development</h3>
            <p className="muted">
              Essential skills to master during your time at university
            </p>
          </header>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            {skillRecommendations.map((skill, index) => (
              <motion.div
                key={index}
                className="university-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                style={{ cursor: 'default' }}
              >
                <div style={{
                  display: 'inline-block',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '999px',
                  background: 'rgba(135, 245, 214, 0.15)',
                  color: 'var(--accent)',
                  fontSize: '0.75rem',
                  marginBottom: '0.75rem',
                  fontWeight: '600'
                }}>
                  {skill.category}
                </div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{skill.title}</h4>
                <p className="muted" style={{ fontSize: '0.9rem', margin: 0 }}>
                  {skill.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Networking Opportunities */}
        <motion.div 
          className="panel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <header className="panel-header">
            <h3>🤝 Networking & Career Growth</h3>
            <p className="muted">
              Build connections that will shape your future career
            </p>
          </header>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
            marginTop: '1.5rem'
          }}>
            {networkingOpportunities.map((opportunity, index) => (
              <motion.div
                key={index}
                className="university-card"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                style={{ cursor: 'default' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{opportunity.icon}</div>
                <h4 style={{ margin: '0 0 0.5rem 0' }}>{opportunity.title}</h4>
                <p className="muted" style={{ fontSize: '0.9rem', margin: 0 }}>
                  {opportunity.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: '2rem'
          }}
        >
          <button
            className="cta-button"
            onClick={() => navigate('/')}
            style={{ fontSize: '1rem', padding: '0.85rem 2rem' }}
          >
            Explore More Universities
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default FurtherProgress;
