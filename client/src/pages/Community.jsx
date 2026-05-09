import React, { useState } from 'react';
import './Community.css';

export default function Community() {
  const [members] = useState([
    { id: 1, name: 'Fatima Ahmed', location: 'Karachi', joined: 'Jan 2024', tutorials: 5 },
    { id: 2, name: 'Muhammad Ali', location: 'Lahore', joined: 'Feb 2024', tutorials: 8 },
    { id: 3, name: 'Ayesha Khan', location: 'Islamabad', joined: 'Mar 2024', tutorials: 3 },
    { id: 4, name: 'Hassan Raza', location: 'Rawalpindi', joined: 'Mar 2024', tutorials: 6 },
    { id: 5, name: 'Zainab Malik', location: 'Faisalabad', joined: 'Apr 2024', tutorials: 4 },
    { id: 6, name: 'Ahmed Hassan', location: 'Multan', joined: 'Apr 2024', tutorials: 7 },
  ]);

  const [activities] = useState([
    { id: 1, type: 'completed', member: 'Fatima Ahmed', action: 'completed tutorial', detail: 'Email Basics', time: '2 hours ago' },
    { id: 2, type: 'joined', member: 'Muhammad Ali', action: 'joined the community', detail: '', time: '5 hours ago' },
    { id: 3, type: 'question', member: 'Ayesha Khan', action: 'asked a question', detail: 'How to backup photos?', time: '1 day ago' },
    { id: 4, type: 'completed', member: 'Hassan Raza', action: 'completed tutorial', detail: 'Video Calling Guide', time: '2 days ago' },
  ]);

  return (
    <div className="community">
      {/* Hero Section */}
      <section className="community-hero">
        <div className="container container-sm">
          <h1>Join Our Community</h1>
          <p>Connect with thousands of people learning digital skills together</p>
        </div>
      </section>

      {/* Stats */}
      <section className="community-stats alt">
        <div className="container">
          <div className="stats-grid">
            <div className="stat">
              <div className="stat-value">2,500+</div>
              <div className="stat-label">Active Members</div>
            </div>
            <div className="stat">
              <div className="stat-value">10K+</div>
              <div className="stat-label">Tutorials Completed</div>
            </div>
            <div className="stat">
              <div className="stat-value">500+</div>
              <div className="stat-label">Questions Answered</div>
            </div>
            <div className="stat">
              <div className="stat-value">50+</div>
              <div className="stat-label">Cities</div>
            </div>
          </div>
        </div>
      </section>

      {/* Members */}
      <section className="members">
        <div className="container">
          <h2>Community Members</h2>
          <div className="members-grid">
            {members.map(member => (
              <div key={member.id} className="member-card card">
                <div className="member-avatar">{member.name.charAt(0)}</div>
                <h3>{member.name}</h3>
                <p className="member-location">{member.location}</p>
                <p className="member-stat">Joined {member.joined}</p>
                <p className="member-stat">{member.tutorials} tutorials completed</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activity Feed */}
      <section className="activity alt">
        <div className="container container-sm">
          <h2>Recent Activity</h2>
          <div className="activity-feed">
            {activities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-badge"></div>
                <div className="activity-content">
                  <p className="activity-text">
                    <strong>{activity.member}</strong> {activity.action}
                    {activity.detail && <span className="activity-detail"> "{activity.detail}"</span>}
                  </p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="community-cta">
        <div className="container container-sm">
          <h2>Ready to Join?</h2>
          <p>Become part of our growing community of learners</p>
          <button className="btn">Join Community Now</button>
        </div>
      </section>
    </div>
  );
}
