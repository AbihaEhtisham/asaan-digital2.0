import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tutorialAPI } from '../services/api';
import toast from 'react-hot-toast';
import './TutorialDetail.css';

const TutorialDetail = () => {
  const { id } = useParams();
  const [tutorial, setTutorial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [progress, setProgress] = useState(0);
  const [videoData, setVideoData] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);
  
  // Dropdown states
  const [quickNavOpen, setQuickNavOpen] = useState(true);
  const [prereqOpen, setPrereqOpen] = useState(true);
  const [descriptionOpen, setDescriptionOpen] = useState(true);

  // Fetch tutorial data
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

  // Fetch video data
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setVideoLoading(true);
        const response = await fetch(`http://localhost:5000/api/videos/tutorial/${id}`);
        const data = await response.json();
        
        console.log('Video API Response:', data);
        
        if (data.success && data.data && data.data.embed_url) {
          setVideoData(data.data);
          console.log('Video loaded successfully:', data.data);
        } else {
          console.log('No video found for tutorial:', id);
        }
      } catch (error) {
        console.error('Failed to fetch video:', error);
      } finally {
        setVideoLoading(false);
      }
    };
    
    if (id) {
      fetchVideo();
    }
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
        <div className="spinner-border" style={{ color: '#3b82f6' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading tutorial...</p>
      </div>
    );
  }

  if (!tutorial) {
    return (
      <div className="tutorial-not-found">
        <i className="fas fa-exclamation-circle fa-3x mb-3" style={{ color: '#f59e0b' }}></i>
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
                <span className="detail-meta-tag difficulty" style={{ borderColor: '#3b82f6', color: '#3b82f6' }}>
                  <i className="fas fa-signal me-1"></i>
                  {getDifficultyLabel(tutorial.difficulty_level)}
                </span>
                <span className="detail-meta-tag">
                  <i className="fas fa-list me-1"></i>
                  {tutorial.steps?.length || 0} Steps
                </span>
                <span className="detail-meta-tag">
                  <i className="fas fa-clock me-1"></i>
                  {tutorial.estimated_time_minutes || 5} min
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

      {/* Steps Section with Blue Background */}
      <div className="steps-section-wrapper">
        <div className="container-xl">
          {/* Video Container - Above Step by Step Guide */}
          {!videoLoading && videoData && videoData.embed_url ? (
            <div className="tutorial-video-container">
              <div className="video-header">
                <h3><i className="fas fa-play-circle me-2"></i> Video Tutorial</h3>
                {videoData.duration_minutes > 0 && (
                  <span className="video-duration">
                    <i className="fas fa-clock me-1"></i> {videoData.duration_minutes} minutes
                  </span>
                )}
              </div>
              <div className="video-wrapper">
                <iframe
                  src={videoData.embed_url}
                  title={videoData.tutorial_title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              {videoData.description && (
                <p className="video-description">
                  <i className="fas fa-info-circle me-2"></i>
                  {videoData.description}
                </p>
              )}
            </div>
          ) : !videoLoading && (
            <div className="video-placeholder-message">
              <i className="fas fa-video"></i>
              <p>No video tutorial available for this guide yet.</p>
            </div>
          )}

          {videoLoading && (
            <div className="video-loading">
              <div className="spinner-border-sm spinner-grow-sm" style={{ color: '#3b82f6' }} role="status"></div>
              <p>Loading video...</p>
            </div>
          )}

          <div className="row g-4">
            {/* Steps List - Left Column */}
            <div className="col-lg-8">
              <h3 className="steps-section-title">Step-by-Step Guide</h3>
              
              {tutorial.steps?.map((step, index) => (
                <div 
                  key={step.step_number}
                  className={`step-detail-card ${completedSteps.includes(step.step_number) ? 'completed' : ''} ${currentStep === step.step_number ? 'active' : ''}`}
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
            
            {/* Sidebar - Right Column with Collapsible Dropdowns */}
            <div className="col-lg-4 sidebar-section">
              {/* Quick Navigation Dropdown */}
              <div className="sidebar-card">
                <div 
                  className="sidebar-dropdown-header"
                  onClick={() => setQuickNavOpen(!quickNavOpen)}
                >
                  <h4 className="sidebar-title">Quick Navigation</h4>
                  <i className={`fas fa-chevron-down dropdown-icon ${quickNavOpen ? 'open' : ''}`}></i>
                </div>
                {quickNavOpen && (
                  <div className="sidebar-dropdown-content">
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
                )}
              </div>
              
              {/* Prerequisites Dropdown */}
              {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
                <div className="sidebar-card">
                  <div 
                    className="sidebar-dropdown-header"
                    onClick={() => setPrereqOpen(!prereqOpen)}
                  >
                    <h4 className="sidebar-title">Prerequisites</h4>
                    <i className={`fas fa-chevron-down dropdown-icon ${prereqOpen ? 'open' : ''}`}></i>
                  </div>
                  {prereqOpen && (
                    <div className="sidebar-dropdown-content">
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
                </div>
              )}
              
              {/* Description Dropdown */}
              <div className="sidebar-card">
                <div 
                  className="sidebar-dropdown-header"
                  onClick={() => setDescriptionOpen(!descriptionOpen)}
                >
                  <h4 className="sidebar-title">Description</h4>
                  <i className={`fas fa-chevron-down dropdown-icon ${descriptionOpen ? 'open' : ''}`}></i>
                </div>
                {descriptionOpen && (
                  <div className="sidebar-dropdown-content">
                    <p className="sidebar-text">{tutorial.description_english}</p>
                    {tutorial.description_urdu && (
                      <p className="sidebar-text-urdu" dir="rtl">{tutorial.description_urdu}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Your Knowledge Section at Bottom */}
      <div className="container-xl">
        <div className="test-knowledge-section">
          <h2>📚 Ready to Test Your Knowledge?</h2>
          <p>Take this quiz to see what you've learned!</p>
          <Link to={`/tutorial/${id}/quiz`} className="quiz-bottom-btn">
            Start Quiz <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      </div>
    </>
  );
};

export default TutorialDetail;