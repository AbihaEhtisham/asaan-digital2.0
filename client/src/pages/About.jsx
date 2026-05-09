import React from 'react';
import './About.css';

export default function About() {
  const team = [
    { name: 'Sarah Khan', role: 'Founder & CEO', bio: 'Digital education advocate with 10+ years experience' },
    { name: 'Ahmed Hassan', role: 'Head of Content', bio: 'Creates simple, effective digital tutorials' },
    { name: 'Zainab Ali', role: 'Community Manager', bio: 'Builds and nurtures our growing community' },
    { name: 'Malik Raza', role: 'Technical Lead', bio: 'Ensures our platform is safe and accessible' },
  ];

  const values = [
    { title: 'Accessibility', description: 'Making digital learning available to everyone, regardless of background' },
    { title: 'Simplicity', description: 'Breaking down complex concepts into easy, understandable steps' },
    { title: 'Community', description: 'Building a supportive environment where everyone can learn together' },
    { title: 'Empowerment', description: 'Helping people gain confidence in using digital tools' },
  ];

  return (
    <div className="about">
      {/* Hero */}
      <section className="about-hero">
        <div className="container container-sm">
          <h1>About Asaan Digital</h1>
          <p>Empowering people to master digital skills with simple, clear guidance</p>
        </div>
      </section>

      {/* Mission */}
      <section className="mission alt">
        <div className="container container-sm">
          <h2>Our Mission</h2>
          <p>
            Asaan Digital exists to bridge the digital divide. We believe everyone deserves access to clear,
            simple digital education - regardless of age, background, or technical experience. Our mission is to
            empower millions of Pakistanis to confidently use digital tools and services.
          </p>
          <div className="mission-highlights">
            <div className="highlight">
              <div className="highlight-number">2,500+</div>
              <p>Active Learners</p>
            </div>
            <div className="highlight">
              <div className="highlight-number">50+</div>
              <p>Free Tutorials</p>
            </div>
            <div className="highlight">
              <div className="highlight-number">10K+</div>
              <p>Skills Learned</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="values">
        <div className="container">
          <h2>Our Values</h2>
          <div className="values-grid">
            {values.map((value, idx) => (
              <div key={idx} className="value-card card">
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="team alt">
        <div className="container">
          <h2>Our Team</h2>
          <p className="team-intro">
            A dedicated group of educators, developers, and community builders committed to digital literacy
          </p>
          <div className="team-grid">
            {team.map((member, idx) => (
              <div key={idx} className="team-member">
                <div className="member-photo">{member.name.charAt(0)}</div>
                <h3>{member.name}</h3>
                <p className="member-role">{member.role}</p>
                <p className="member-bio">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="faq-section">
        <div className="container container-sm">
          <h2>Frequently Asked Questions</h2>
          <div className="faq-list">
            <details className="faq-item">
              <summary>Is Asaan Digital completely free?</summary>
              <p>Yes, all our tutorials and community features are completely free. We believe education should be accessible to everyone.</p>
            </details>
            <details className="faq-item">
              <summary>Who can use Asaan Digital?</summary>
              <p>Anyone can use Asaan Digital! Our content is designed for beginners, but learners of all levels are welcome.</p>
            </details>
            <details className="faq-item">
              <summary>Can I download the tutorials?</summary>
              <p>Currently, all tutorials are available online. We're working on offline versions for the future.</p>
            </details>
            <details className="faq-item">
              <summary>How can I get help?</summary>
              <p>You can ask questions in our community or reach out to our support team. We're here to help!</p>
            </details>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container container-sm">
          <h2>Join Us Today</h2>
          <p>Start your digital learning journey with Asaan Digital</p>
          <button className="btn">Get Started</button>
        </div>
      </section>
    </div>
  );
}
