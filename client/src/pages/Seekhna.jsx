import React, { useState } from 'react';
import './Seekhna.css';

export default function Seekhna() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    { id: 1, name: 'Getting Started', tutorials: 8 },
    { id: 2, name: 'Communication', tutorials: 12 },
    { id: 3, name: 'Banking & Money', tutorials: 10 },
    { id: 4, name: 'Social Media', tutorials: 15 },
    { id: 5, name: 'Shopping Online', tutorials: 7 },
    { id: 6, name: 'Safety & Security', tutorials: 9 },
  ];

  const tutorials = [
    { id: 1, category: 1, title: 'What is the Internet?', difficulty: 1, duration: '5 min' },
    { id: 2, category: 1, title: 'How to Use a Smartphone', difficulty: 1, duration: '8 min' },
    { id: 3, category: 2, title: 'Creating an Email Account', difficulty: 2, duration: '10 min' },
    { id: 4, category: 2, title: 'Making Video Calls', difficulty: 2, duration: '7 min' },
    { id: 5, category: 3, title: 'Opening a Bank Account Online', difficulty: 2, duration: '12 min' },
    { id: 6, category: 3, title: 'Sending Money Online', difficulty: 3, duration: '15 min' },
    { id: 7, category: 4, title: 'Setting Up WhatsApp', difficulty: 1, duration: '6 min' },
    { id: 8, category: 4, title: 'Using Facebook', difficulty: 2, duration: '10 min' },
    { id: 9, category: 5, title: 'Shopping on Amazon', difficulty: 3, duration: '20 min' },
    { id: 10, category: 6, title: 'Protecting Your Passwords', difficulty: 2, duration: '8 min' },
  ];

  const filteredTutorials = selectedCategory
    ? tutorials.filter(t => t.category === selectedCategory)
    : tutorials;

  return (
    <div className="seekhna">
      {/* Hero Section */}
      <section className="seekhna-hero">
        <div className="container container-sm">
          <h1>Learn Tutorials</h1>
          <p>Master digital skills with our easy-to-follow step-by-step guides</p>
        </div>
      </section>

      {/* Categories */}
      <section className="categories alt">
        <div className="container">
          <h2>Choose a Category</h2>
          <div className="category-grid">
            {categories.map(cat => (
              <button
                key={cat.id}
                className={`category-card ${selectedCategory === cat.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(selectedCategory === cat.id ? null : cat.id)}
              >
                <h3>{cat.name}</h3>
                <p>{cat.tutorials} tutorials</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tutorials List */}
      <section className="tutorials">
        <div className="container">
          <h2>
            {selectedCategory
              ? `${categories.find(c => c.id === selectedCategory)?.name} Tutorials`
              : 'All Tutorials'}
          </h2>
          <div className="tutorials-list">
            {filteredTutorials.map(tutorial => (
              <div key={tutorial.id} className="tutorial-item card">
                <div className="tutorial-header">
                  <h3>{tutorial.title}</h3>
                  <span className="difficulty">Level {tutorial.difficulty}</span>
                </div>
                <p className="tutorial-duration">Duration: {tutorial.duration}</p>
                <button className="btn btn-small">Start Tutorial</button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
