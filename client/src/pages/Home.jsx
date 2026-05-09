import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [counters, setCounters] = useState({
    guides: 0,
    users: 0,
    topics: 0,
    team: 3
  });

  const statsRef = useRef(null);

  useEffect(() => {
    const targetCounts = { guides: 500, users: 10000, topics: 50 };
    
    const animateCounter = (key, target, duration = 2000) => {
      let start = 0;
      const increment = target / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setCounters(prev => ({ ...prev, [key]: Math.floor(target) }));
          clearInterval(timer);
        } else {
          setCounters(prev => ({ ...prev, [key]: Math.floor(start) }));
        }
      }, 16);
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter('guides', targetCounts.guides);
          animateCounter('users', targetCounts.users);
          animateCounter('topics', targetCounts.topics);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-xl">
          <div className="hero-grid">
            <div className="hero-content">
              <h1 className="hero-title animate-up delay-100">
                Learn Digital Skills
              </h1>
              <p className="hero-subtitle animate-up delay-200">
                Easy tutorials and instant answers for everyone
              </p>
              <p className="hero-description animate-up delay-300">
                Master digital tools step-by-step. No complicated jargon. Just clear, simple lessons designed for you.
              </p>
              <div className="hero-buttons animate-up delay-400">
                <Link to="/poochna" className="btn-pakistan">Ask a Question</Link>
                <Link to="/seekhna" className="btn-pakistan-outline">Start Learning</Link>
              </div>
            </div>
            <div className="hero-image-wrapper animate-right delay-200">
              <img src="/images/pic1.png" alt="Learn Digital Skills" className="hero-img" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" ref={statsRef}>
        <div className="container-xl">
          <div className="stats-grid">
            <div className="stat-card" data-aos="fade-up" data-aos-delay="100">
              <div className="stat-number">{counters.guides}+</div>
              <div className="stat-label">Digital Guides</div>
            </div>
            <div className="stat-card" data-aos="fade-up" data-aos-delay="200">
              <div className="stat-number">{counters.users.toLocaleString()}+</div>
              <div className="stat-label">Happy Users</div>
            </div>
            <div className="stat-card" data-aos="fade-up" data-aos-delay="300">
              <div className="stat-number">{counters.topics}+</div>
              <div className="stat-label">Topics Covered</div>
            </div>
            <div className="stat-card" data-aos="fade-up" data-aos-delay="400">
              <div className="stat-number">{counters.team}</div>
              <div className="stat-label">Team Members</div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems Section */}
      <section className="py-5">
        <div className="container-xl">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="section-title">ہم کیا مسئلہ حل کر رہے ہیں؟</h2>
            <p className="section-sub">What Problems Are We Solving?</p>
          </div>
          <div className="row g-4 justify-content-center">
            <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="100">
              <div className="card-alt text-center">
                <div className="display-5 mb-3">
                  <img src="/images/language-barrier.png" alt="Language Barrier" />
                </div>
                <h3 className="h4 fw-bold mb-3" style={{ color: 'var(--green)' }}>Language Barrier</h3>
                <p className="text-soft">
                  Breaking every process down in simple Urdu and Roman Urdu, making technology accessible to over 60% of the population.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="200">
              <div className="card-alt text-center">
                <div className="display-5 mb-3">
                  <img src="/images/digital-illiteracy.png" alt="Digital Illiteracy" />
                </div>
                <h3 className="h4 fw-bold mb-3" style={{ color: 'var(--green)' }}>Digital Illiteracy</h3>
                <p className="text-soft">
                  Teaching essential digital skills step by step, from basic navigation to advanced online transactions.
                </p>
              </div>
            </div>
            <div className="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="300">
              <div className="card-alt text-center">
                <div className="display-5 mb-3">
                  <img src="/images/confusing-portals.png" alt="Confusing Portals" />
                </div>
                <h3 className="h4 fw-bold mb-3" style={{ color: 'var(--green)' }}>Confusing Portals</h3>
                <p className="text-soft">
                  Providing clear, numbered walkthroughs for complex government portals like NADRA, FBR, and Passports.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-5">
        <div className="container-xl">
          <div className="row align-items-center g-5">
            <div className="col-lg-6" data-aos="fade-right">
              <h2 className="section-title mb-4">ہمارا مشن</h2>
              <div className="card-elegant mb-3">
                <p className="m-0">
                  Making digital Pakistan accessible to every citizen, removing language barriers that prevent millions from using digital tools.
                </p>
              </div>
              <div className="card-elegant mb-3">
                <p className="m-0">
                  Serving both urban users and rural communities who have never had proper digital guidance for government services.
                </p>
              </div>
              <div className="card-elegant">
                <p className="m-0">
                  A trusted digital companion for Karachi, Lahore, Peshawar, and every village in between. Apni Madad Aap.
                </p>
              </div>
            </div>
            <div className="col-lg-6" data-aos="fade-left">
              <div className="mission-grid">
                <div className="mission-cluster">
                  <img src="/images/pic1.png" alt="Digital Pakistan" className="mission-piece d1" />
                  <img src="/images/pic2.png" alt="Community" className="mission-piece d2" />
                  <img src="/images/pic3.png" alt="Students" className="mission-piece d3" />
                  <img src="/images/pic4.png" alt="Rural" className="mission-piece d4" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-5" style={{ background: 'var(--cream)' }}>
        <div className="container-xl">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="section-title">یہ کیسے کام کرتا ہے</h2>
            <p className="section-sub">Four simple steps to digital confidence</p>
          </div>
          <div className="row g-4">
            {[
              { num: 1, title: 'Ask a Question', desc: 'Type your problem in Urdu, Roman Urdu, or English.' },
              { num: 2, title: 'We Process It', desc: 'Our system finds the most relevant guide or answer for you.' },
              { num: 3, title: 'Get Your Answer', desc: 'Receive clear, numbered instructions without technical jargon.' },
              { num: 4, title: 'Take Action', desc: 'Follow the steps and complete your task confidently.' }
            ].map((step, i) => (
              <div className="col-sm-6 col-lg-3" key={i} data-aos="fade-up" data-aos-delay={100 + i * 100}>
                <div className="step-card">
                  <div className="step-number">{step.num}</div>
                  <h3 className="fw-bold">{step.title}</h3>
                  <p>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5">
        <div className="container-xl">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="section-title">ہماری خصوصیات</h2>
            <p className="section-sub">Everything you need in one place</p>
          </div>
          <div className="row g-4">
            <div className="col-md-6" data-aos="fade-right" data-aos-delay="100">
              <div className="feature-card">
                <div className="urdu-feature-title" dir="rtl">کچھ سیکھنا ہے؟</div>
                <p className="text-soft">
                  Step-by-step guides on Digital Basics, Government Services, and Job Applications. Written in plain English and Roman Urdu.
                </p>
                <Link to="/seekhna" className="btn-feature">Explore Seekhna →</Link>
              </div>
            </div>
            <div className="col-md-6" data-aos="fade-left" data-aos-delay="200">
              <div className="feature-card">
                <div className="urdu-feature-title" dir="rtl">کچھ پوچھنا ہے؟</div>
                <p className="text-soft">
                  A safe space to get answers about CNIC, NADRA, JazzCash, and more. Get a clear answer instantly.
                </p>
                <Link to="/poochna" className="btn-feature">Ask on Poochna →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
