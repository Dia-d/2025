import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRoadmap } from '../context/RoadmapContext.jsx';
import { useUserCode } from '../context/UserCodeContext.jsx';
import RoadmapProgress from '../components/RoadmapProgress.jsx';
import universities from '../data/universities.js';

const Roadmap = () => {
  const { universityId } = useParams();
  const navigate = useNavigate();
  const { code } = useUserCode();
  const { roadmapData, loading, initializeRoadmap, updateVisaDocument } = useRoadmap();

  useEffect(() => {
    if (!code) {
      navigate('/');
      return;
    }

    if (universityId && !roadmapData) {
      initializeRoadmap(universityId);
    } else if (universityId && roadmapData?.university_id !== universityId) {
      initializeRoadmap(universityId);
    }
  }, [code, universityId, roadmapData, initializeRoadmap, navigate]);

  if (loading || !roadmapData) {
    return (
      <section className="roadmap-page">
        <div className="page-header">
          <button className="ghost-button" type="button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <div>
            <p className="eyebrow">Loading roadmap...</p>
          </div>
        </div>
      </section>
    );
  }

  const university = universities.find((uni) => uni.id === universityId);

  const visaDocuments = [
    {
      key: 'passport_valid_6_months_beyond_stay',
      label: 'Passport Valid 6 Months Beyond Stay',
      description: 'Ensure your passport is valid for at least 6 months beyond your intended stay',
    },
    {
      key: 'DS-160_confirmation_page',
      label: 'DS-160 Confirmation Page',
      description: 'Complete and submit the DS-160 form online',
    },
    {
      key: 'visa_application_fee_receipt',
      label: 'Visa Application Fee Receipt',
      description: 'Pay the visa application fee and keep the receipt',
    },
    {
      key: 'SEVIS_I-901_fee_receipt',
      label: 'SEVIS I-901 Fee Receipt',
      description: 'Pay the SEVIS I-901 fee and obtain the receipt',
    },
    {
      key: 'Form_I-20_signed',
      label: 'Form I-20 (Signed)',
      description: 'Receive and sign the Form I-20 from your university',
    },
    {
      key: 'passport_size_photo_US_visa_spec',
      label: 'Passport Size Photo (US Visa Spec)',
      description: 'Get passport-sized photos meeting US visa specifications',
    },
    {
      key: 'academic_transcripts_and_certificates',
      label: 'Academic Transcripts and Certificates',
      description: 'Collect all academic transcripts and certificates',
    },
    {
      key: 'standardized_test_scores_if_required',
      label: 'Standardized Test Scores (if required)',
      description: 'Submit SAT, ACT, GRE, GMAT, or other required test scores',
    },
    {
      key: 'proof_of_financial_support',
      label: 'Proof of Financial Support',
      description: 'Provide bank statements and financial documents',
    },
    {
      key: 'university_acceptance_letter',
      label: 'University Acceptance Letter',
      description: 'Obtain the official acceptance letter from your university',
    },
    {
      key: 'visa_appointment_confirmation',
      label: 'Visa Appointment Confirmation',
      description: 'Schedule and confirm your visa interview appointment',
    },
    {
      key: 'evidence_of_ties_to_home_country',
      label: 'Evidence of Ties to Home Country',
      description: 'Prepare documents showing strong ties to your home country',
    },
  ];

  const completedCount = Object.values(roadmapData.visa_documents).filter(Boolean).length;
  const totalCount = visaDocuments.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <section className="roadmap-page">
      <div className="page-header">
        <button className="ghost-button" type="button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div>
          <p className="eyebrow">Your Roadmap</p>
          <h2>
            {university ? `${university.name} Application Roadmap` : 'Application Roadmap'}
          </h2>
          <p>Track your progress and complete each step to secure your admission.</p>
        </div>
      </div>

      <div className="roadmap-content">
        <div className="roadmap-overview">
          <div className="progress-summary">
            <h3>Overall Progress</h3>
            <RoadmapProgress
              percentage={progressPercentage}
              completed={completedCount}
              total={totalCount}
            />
          </div>
        </div>

        <div className="roadmap-steps">
          <h3>Visa Documents Checklist</h3>
          <div className="steps-list">
            {visaDocuments.map((doc, index) => {
              const isCompleted = roadmapData.visa_documents[doc.key] || false;
              return (
                <div
                  key={doc.key}
                  className={`step-item ${isCompleted ? 'completed' : ''}`}
                  onClick={() => updateVisaDocument(doc.key, !isCompleted)}
                >
                  <div className="step-checkbox">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => updateVisaDocument(doc.key, !isCompleted)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="step-content">
                    <div className="step-header">
                      <span className="step-number">{index + 1}</span>
                      <h4>{doc.label}</h4>
                    </div>
                    <p className="step-description">{doc.description}</p>
                  </div>
                  <div className="step-status">
                    {isCompleted ? (
                      <span className="status-badge completed">Completed</span>
                    ) : (
                      <span className="status-badge pending">Pending</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;

