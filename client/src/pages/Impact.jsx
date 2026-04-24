import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../services/api';
import './Impact.css';

const Impact = () => {
  const [stats, setStats] = useState({
    peopleHelped: 10000,
    guidesPublished: 500,
    citiesReached: 50
  });
  const [animateProgress, setAnimateProgress] = useState(false);

  useEffect(() => {
    // Fetch real stats
    const fetchStats = async () => {
      try {
        const res = await analyticsAPI.getDailyStats(1);
        if (res.data?.length > 0) {
          const today = res.data[0];
          setStats({
            peopleHelped: today.unique_users || 10000,
            guidesPublished: 500,
            citiesReached: 50
          });
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();

    // Trigger progress animation
    setTimeout(() => setAnimateProgress(true), 500);
  }, []);

  const helpCategories = [
    {
      image: '/images/pic2.png',
      title: 'STUDENTS',
      description: 'Applying for HEC scholarships and university portals with confidence.'
    },
    {
      image: '/images/pic9.png',
      title: 'WORKING PROFESSIONALS',
      description: 'Guidance for filing taxes on FBR Iris, online banking, and passport renewals.'
    },
    {
      image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=400&q=80',
      title: 'RURAL COMMUNITIES',
      description: 'Simplified guidance in plain Urdu for users with limited digital exposure.'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="impact-hero-section">
        <div className="container-xl">
          <div className="row align-items-center g-5">
            <div className="col-lg-6" data-aos="fade-right">
              <div className="hero-urdu-sub mb-3" dir="rtl">
                بنانا <span className="urdu-highlight">پاکستان</span>
              </div>
              <h1 className="impact-main-title">Digital Pakistan</h1>
              <p className="impact-lead-text">
                Together we can bridge the digital divide and build a Pakistan where every citizen 
                has equal access to digital services and opportunities.
              </p>
              <a href="#" className="btn-pakistan">
                Join Our Community <i className="fas fa-users ms-2"></i>
              </a>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="impact-image-grid">
                <div className="impact-img-card offset-top">
                  <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80" alt="Community" />
                </div>
                <div className="impact-img-card">
                  <img src="https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&q=80" alt="Empowerment" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who We Help Section */}
      <section className="py-5 overflow-hidden">
        <div className="container-xl">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="section-title">Who We Help</h2>
            <p className="text-soft mx-auto" style={{ maxWidth: '700px' }}>
              Asaan Digital 2.0 was built for the people of Pakistan. From students in Islamabad 
              to farmers in rural Sindh, we serve anyone navigating the digital world.
            </p>
          </div>

          <div className="help-circles-wrapper">
            {helpCategories.map((item, index) => (
              <div 
                className="help-circle-item" 
                key={index}
                data-aos="zoom-in" 
                data-aos-delay={index * 100}
              >
                <div className="help-circle-img">
                  <img src={item.image} alt={item.title} />
                </div>
                <div className="help-circle-info">
                  <h3 className="help-title">{item.title}</h3>
                  <p className="help-desc">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Numbers Section */}
      <section className="impact-stats-section">
        <div className="container-xl">
          <h2 className="section-title text-center mb-5 text-white" data-aos="fade-up">
            Our Impact in Numbers
          </h2>
          <div className="row justify-content-center">
            <div className="col-lg-9" data-aos="fade-up">
              <div className="impact-bars">
                {/* People Helped */}
                <div className="impact-bar-item">
                  <div className="impact-bar-header">
                    <span>People Helped</span>
                    <span>{stats.peopleHelped.toLocaleString()}+</span>
                  </div>
                  <div className="impact-bar-track">
                    <div 
                      className={`impact-bar-fill green ${animateProgress ? 'animate' : ''}`}
                      style={{ '--target-width': '78%' }}
                    ></div>
                  </div>
                </div>

                {/* Guides Published */}
                <div className="impact-bar-item">
                  <div className="impact-bar-header">
                    <span>Guides Published</span>
                    <span>{stats.guidesPublished.toLocaleString()}+</span>
                  </div>
                  <div className="impact-bar-track">
                    <div 
                      className={`impact-bar-fill gold ${animateProgress ? 'animate' : ''}`}
                      style={{ '--target-width': '65%' }}
                    ></div>
                  </div>
                </div>

                {/* Cities Reached */}
                <div className="impact-bar-item">
                  <div className="impact-bar-header">
                    <span>Cities Reached</span>
                    <span>{stats.citiesReached}+</span>
                  </div>
                  <div className="impact-bar-track">
                    <div 
                      className={`impact-bar-fill green ${animateProgress ? 'animate' : ''}`}
                      style={{ '--target-width': '45%' }}
                    ></div>
                  </div>
                </div>
              </div>
              
              <p className="impact-quote">
                Every guide written and every question answered brings us closer to a truly Digital Pakistan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="vision-section">
        <div className="container-xl">
          <div className="row g-5 align-items-center">
            <div className="col-lg-4" data-aos="fade-right">
              <h2 className="vision-title">
                Future<br />Impact<br />
                <span className="vision-highlight">Vision</span>
              </h2>
            </div>
            <div className="col-lg-8" data-aos="fade-left">
              <div className="vision-card">
                <p className="vision-text">
                  Asaan Digital 2.0 is just getting started. In the next phase, we plan to introduce 
                  an AI-powered chatbot that can respond to queries in real-time Urdu and Roman Urdu.
                </p>
                <p className="vision-text">
                  Our long-term vision includes a dedicated mobile application, voice input support, 
                  and integration with official government APIs for real-time updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Impact;