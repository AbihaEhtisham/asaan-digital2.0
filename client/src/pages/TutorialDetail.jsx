import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tutorialAPI } from '../services/api';
import toast from 'react-hot-toast';
import './TutorialDetail.css';
import TutorialQuiz from './TutorialQuiz';

const TutorialDetail = () => {
  const { id } = useParams();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchTutorial = async () => {
      try {
        setLoading(true);
        const res = await tutorialAPI.getTutorialById(id);
        if (res.data) {
          setTutorial(res.data);
        } else {
          toast.error('Tutorial not found');
        }
      } catch (error) {
        console.error('Failed to fetch tutorial:', error);
        toast.error('Failed to load tutorial');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTutorial();
    window.scrollTo(0, 0);
  }, [id]);

  const handleStepComplete = (stepNumber) => {
    if (!completedSteps.includes(stepNumber)) {
      const newCompleted = [...completedSteps, stepNumber];
      setCompletedSteps(newCompleted);
      
      const totalSteps = tutorial?.steps?.length || 0;
      const newProgress = Math.round((newCompleted.length / totalSteps) * 100);
      setProgress(newProgress);
      
      // Move to next step
      if (stepNumber < totalSteps) {
        setCurrentStep(stepNumber + 1);
      }
      
      toast.success(`Step ${stepNumber} completed!`);
    }
  };

  const getDifficultyLabel = (level) => {
    const labels = { 1: 'Very Easy', 2: 'Easy', 3: 'Medium', 4: 'Hard', 5: 'Advanced' };
    return labels[level] || 'Easy';
  };

  if (loading) {
    return (
      <div className="tutorial-loading">
        <div className="spinner-border" style={{ color: 'var(--green)' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading tutorial...</p>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="tutorial-not-found">
        <i className="fas fa-exclamation-circle fa-3x mb-3" style={{ color: 'var(--gold)' }}></i>
        <h3>Tutorial Not Found</h3>
        <p className="text-soft">The tutorial you're looking for doesn't exist or has been removed.</p>
        <Link to="/seekhna" className="btn-pakistan mt-3">Browse Tutorials</Link>
      </div>
    );
  }

  return (
    <>
      {/* Tutorial Header */}
      <div className="tutorial-header">
        <div className="container-xl">
          <Link to="/seekhna" className="back-link">
            <i className="fas fa-arrow-left me-2"></i> Back to Tutorials
          </Link>
          
          <div className="tutorial-header-content">
            <div className="tutorial-header-info">
              <span className="tutorial-category-badge">
                {tutorial.category?.name_english || 'General'}
              </span>
              <h1 className="tutorial-detail-title">
                {tutorial.title_urdu}
              </h1>
              <p className="tutorial-detail-subtitle">
                {tutorial.title_english}
              </p>
              
              <div className="tutorial-detail-meta">
                <span className="detail-meta-tag difficulty" style={{ borderColor: 'var(--green)' }}>
                  <i className="fas fa-signal me-1"></i>
                  {getDifficultyLabel(tutorial.difficulty_level)}
                </span>
                <span className="detail-meta-tag">
                  <i className="fas fa-list me-1"></i>
                  {tutorial.steps?.length || 0} Steps
                </span>
                <span className="detail-meta-tag">
                  <i className="fas fa-clock me-1"></i>
                  {tutorial.estimated_time || 5} min
                </span>
              </div>
            </div>
            
            {/* Progress Circle */}
            <div className="progress-circle-wrapper">
              <svg className="progress-circle" viewBox="0 0 120 120">
                <circle className="progress-bg" cx="60" cy="60" r="54" />
                <circle 
                  className="progress-fill" 
                  cx="60" cy="60" r="54"
                  style={{ 
                    strokeDasharray: `${2 * Math.PI * 54}`,
                    strokeDashoffset: `${2 * Math.PI * 54 * (1 - progress / 100)}`
                  }}
                />
              </svg>
              <div className="progress-text">
                <span className="progress-percent">{progress}%</span>
                <span className="progress-label">Complete</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Steps Section */}
      <div className="container-xl py-5">
        <div className="row g-4">
          {/* Steps List */}
          <div className="col-lg-8">
            <h3 className="steps-section-title">Step-by-Step Guide</h3>
            
            {tutorial.steps?.map((step, index) => (
              <div 
                key={step.step_number}
                className={`step-detail-card ${completedSteps.includes(step.step_number) ? 'completed' : ''} ${currentStep === step.step_number ? 'active' : ''}`}
                data-aos="fade-up"
                data-aos-delay={index * 50}
              >
                <div className="step-detail-header">
                  <div className="step-detail-number">
                    {completedSteps.includes(step.step_number) ? (
                      <i className="fas fa-check"></i>
                    ) : (
                      step.step_number
                    )}
                  </div>
                  <div className="step-detail-texts">
                    <p className="step-instruction-urdu" dir="rtl">
                      {step.instruction_urdu}
                    </p>
                    <p className="step-instruction-english">
                      {step.instruction_english}
                    </p>
                  </div>
                </div>
                
                {step.image_url && (
                  <div className="step-image-container">
                    <img src={step.image_url} alt={`Step ${step.step_number}`} />
                  </div>
                )}
                
                <div className="step-actions">
                  {!completedSteps.includes(step.step_number) && (
                    <button 
                      className="complete-step-btn"
                      onClick={() => handleStepComplete(step.step_number)}
                    >
                      <i className="fas fa-check-circle me-2"></i>
                      Mark as Complete
                    </button>
                  )}
                  {completedSteps.includes(step.step_number) && (
                    <span className="step-completed-badge">
                      <i className="fas fa-check-circle me-1"></i> Completed
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Sidebar */}
          <div className="col-lg-4">
            {/* Quick Navigation */}
            <div className="sidebar-card">
              <h4 className="sidebar-title">Quick Navigation</h4>
              <div className="step-nav-list">
                {tutorial.steps?.map((step) => (
                  <button
                    key={step.step_number}
                    className={`step-nav-item ${currentStep === step.step_number ? 'active' : ''} ${completedSteps.includes(step.step_number) ? 'done' : ''}`}
                    onClick={() => setCurrentStep(step.step_number)}
                  >
                    <span className="step-nav-number">
                      {completedSteps.includes(step.step_number) ? '✓' : step.step_number}
                    </span>
                    <span className="step-nav-text">
                      {step.instruction_english?.substring(0, 40)}...
                    </span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Prerequisites */}
            {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
              <div className="sidebar-card">
                <h4 className="sidebar-title">Prerequisites</h4>
                <div className="prereq-list">
                  {tutorial.prerequisites.map((prereq) => (
                    <Link 
                      key={prereq.id}
                      to={`/tutorial/${prereq.id}`}
                      className="prereq-item"
                    >
                      <i className="fas fa-link me-2"></i>
                      {prereq.title_english}
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Description */}
            <div className="sidebar-card">
              <h4 className="sidebar-title">Description</h4>
              <p className="sidebar-text">{tutorial.description_english}</p>
              {tutorial.description_urdu && (
                <p className="sidebar-text-urdu" dir="rtl">{tutorial.description_urdu}</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {tutorial && (
        <div className="container-xl py-4">
          <TutorialQuiz 
            tutorialId={id} 
            tutorialTitle={tutorial.title_english} 
          />
        </div>
      )}
    </>
  );
};

export default TutorialDetail;