import React from 'react';
import './About.css';

const About = () => {
  const teamMembers = [
    {
      name: 'Abiha Ehtisham',
      role: 'UI/UX Designer',
      image: '/images/abiha.png',
      delay: 100
    },
    {
      name: 'Azka Saqib',
      role: 'Research Lead & Content Strategist',
      image: '/images/Azka_Sports.png',
      delay: 200
    },
    {
      name: 'Eman Fatima',
      role: 'Frontend Developer',
      image: '/images/eman.png',
      delay: 300
    }
  ];

  return (
    <>
{/* About Hero Section */}
<section className="about-hero-section">
  <div className="about-hero-grid">
    {/* Left Text Column */}
    <div className="about-text-column animate-up delay-100">
      <span className="about-eyebrow">Our Platform</span>
      <h1 className="about-main-title">
        About<br />
        <span className="about-title-highlight">Asaan</span>
        Digital 2.0
      </h1>
      <span className="about-urdu-text" dir="rtl">ہمارے بارے میں</span>
      <p className="about-lead-text">
        We are a team of NUST BSCS students on a mission to bridge Pakistan's digital divide — 
        making technology simple, accessible, and available in the language every Pakistani understands.
      </p>
    </div>

    {/* Right Mosaic Column - Swapped: Students & Learners is now Tall, Digital Access is Wide */}
    <div className="about-mosaic-column" data-aos="fade-left">
      <div className="about-mosaic-grid">
        {/* Cell 1: Tall photo - NOW Students & Learners */}
        <div className="mosaic-cell tall">
          <img src="/images/pic10.png" alt="Students" />
          <div className="mosaic-label" style={{ background: '#0a0a0a', color: '#fff' }}>
            Students & Learners
          </div>
        </div>

        {/* Cell 2: Green solid */}
        <div className="mosaic-cell solid green-bg">
          <span className="mosaic-tag">Platform</span>
          <span className="mosaic-name">Asaan<br />Digital 2.0</span>
        </div>

        {/* Cell 3: Photo */}
        <div className="mosaic-cell">
          <img src="/images/pic6.png" alt="Community" />
          <div className="mosaic-label" style={{ background: '#0a0a0a', color: '#fff' }}>
            Community
          </div>
        </div>

        {/* Cell 4: Gold solid */}
        <div className="mosaic-cell solid gold-bg">
          <span className="mosaic-tag dark">Mission</span>
          <span className="mosaic-name dark">Apni<br />Madad Aap</span>
        </div>

        {/* Cell 5: Photo */}
        <div className="mosaic-cell">
          <img src="/images/pic15.png" alt="Urban Digital" />
          <div className="mosaic-label" style={{ background: 'var(--green)', color: '#fff' }}>
            Urban
          </div>
        </div>

        {/* Cell 6: Wide photo - NOW Digital Access */}
        <div className="mosaic-cell wide">
          <img src="/images/pic12.png" alt="Digital Pakistan" />
          <div className="mosaic-label" style={{ background: 'var(--green)', color: '#fff' }}>
            Digital Access
          </div>
        </div>

        {/* Cell 7: Black solid */}
        <div className="mosaic-cell solid black-bg">
          <span className="mosaic-tag">Est.</span>
          <span className="mosaic-name">2026<br /><span className="gold-text">NUST</span></span>
        </div>
      </div>
    </div>
  </div>
</section>

{/* Project Overview Section - Side by Side with Fading Vertical Line */}
<section className="project-overview-section">
  <div className="container-xl">
    <div className="text-center mb-5" data-aos="fade-up">
      <h2 className="section-title">Project Overview</h2>
      <p className="section-sub">Our mission, scope, and vision for a digitally inclusive Pakistan</p>
    </div>
    
    <div className="project-overview-row">
      {/* Fading vertical line */}
      <div className="vertical-line"></div>
      
      <div className="overview-card-left" data-aos="fade-right" data-aos-delay="100">
        <h3> What is Asaan Digital 2.0?</h3>
        <p>
          Asaan Digital 2.0 is a digital assistance platform designed for Pakistani users who 
          struggle with technology due to language barriers and low digital literacy. 
          <strong style={{ color: '#3b82f6' }}>Over 60% of Pakistanis speak Urdu</strong> as 
          their primary language, yet most websites and government portals are in English. We bridge 
          this gap by providing clear, step-by-step guidance in 
          <strong style={{ color: '#3b82f6' }}>Urdu and Roman Urdu</strong> — from CNIC 
          applications to mobile banking.
        </p>
        <p className="mt-3">
          The name <strong style={{ color: '#3b82f6' }}>"Asaan Digital"</strong> means "Easy Digital" 
          in Urdu. We walk you through every step in plain language. No technical background required. 
          No English needed.
        </p>
      </div>
      
      <div className="overview-card-right" data-aos="fade-left" data-aos-delay="150">
        <h3> Why We Built This</h3>
        <p>
          Access to digital services is <strong style={{ color: '#3b82f6' }}>not a privilege, it 
          is a right</strong>. Every Pakistani, whether in Karachi or a village in Khyber Pakhtunkhwa, 
          deserves equal access to digital tools.
        </p>
        <p className="mt-3">
          This project was developed for <strong>CS 236 Advanced Database Management Systems</strong> at 
          NUST SEECS, Spring 2026, demonstrating the application of advanced database techniques including 
          PL/pgSQL, materialized views, full-text search, and query optimization.
        </p>
      </div>
    </div>
  </div>
</section>

{/* Explore Our Work Section - English LTR */}
<section className="explore-section">
  <div className="container-xl">
    <div className="row align-items-center g-5">
      <div className="col-lg-5">
        <img 
          src="/images/pic16.png" 
          alt="Asaan Digital 2.0 Platform" 
          className="explore-image"
        />
      </div>
      <div className="col-lg-7">
        <h3 className="explore-title">Explore Our Work</h3>
        <p className="explore-text">
          Asaan Digital 2.0 is a comprehensive digital literacy platform built for the people of Pakistan. 
          Every page was designed from scratch, starting with Figma wireframes and developed with React 
          for a fully responsive experience across all devices.
        </p>
        <p className="explore-text">
          From the Poochna Q&A section to the Seekhna learning hub, every feature was researched, written, 
          and tested on real Pakistani websites and apps. Our guides cover CNIC renewal, mobile banking, 
          FBR tax filing, HEC scholarships, and much more — all in plain English and Urdu.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* Team Section */}
      <section className="team-section">
        <div className="container-xl">
          <div className="text-center mb-5" data-aos="fade-up">
            <h2 className="section-title">Our Team</h2>
            <p className="section-sub">Three NUST BSCS sophomores who collaboratively built Asaan Digital 2.0</p>
          </div>

          <div className="team-cards-wrapper">
            {teamMembers.map((member, index) => (
              <div 
                className={`team-member-card ${index === 0 ? 'left' : index === 1 ? 'center' : 'right'}`}
                key={index}
                data-aos={index === 0 ? 'fade-right' : index === 1 ? 'fade-up' : 'fade-left'}
                data-aos-delay={member.delay}
              >
                <img src={member.image} alt={member.name} className="team-member-img" />
                <h4 className="team-member-name">{member.name}</h4>
                <p className="team-member-role">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default About;