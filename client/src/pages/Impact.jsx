import React, { useEffect, useState, useRef } from 'react';
import { analyticsAPI } from '../services/api';
import './Impact.css';
import NetworkWeb from './NetworkWeb';

const Impact = () => {
  const [stats, setStats] = useState({
    peopleHelped: 10000,
    guidesPublished: 500,
    citiesReached: 50,
    satisfactionRate: 94
  });

  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [formStatus, setFormStatus] = useState(null);
  const storiesRef = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await analyticsAPI.getDailyStats(1);
        if (res.data?.length > 0) {
          const today = res.data[0];
          setStats(prev => ({ ...prev, peopleHelped: today.unique_users || 10000 }));
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };
    fetchStats();
  }, []);

  const userStories = [
    { name: 'Amna Bibi', city: 'Lahore', quote: 'پہلے مجھے بینک اکاؤنٹ کھولنا بہت مشکل لگتا تھا۔ آسان ڈیجیٹل نے مجھے قدم بہ قدم سمجھایا اور اب میں خود سب کام کرتی ہوں۔', quoteEn: 'Opening a bank account felt impossible before. Asaan Digital guided me step by step.' },
    { name: 'Tariq Mahmood', city: 'Peshawar', quote: 'NADRA کا پورٹل بہت الجھا ہوا تھا۔ یہاں آ کر سمجھ آیا کہ شناختی کارڈ کیسے بنوائیں۔', quoteEn: 'The NADRA portal was very confusing. This site helped me understand how to get my CNIC.' },
    { name: 'Sana Rasheed', city: 'Karachi', quote: 'JazzCash سے پیسے بھیجنا اب بالکل آسان ہو گیا ہے۔ شکریہ آسان ڈیجیٹل!', quoteEn: 'Sending money via JazzCash is now super easy for me. Thank you Asaan Digital!' },
    { name: 'Usman Ali', city: 'Multan', quote: 'میرے والدین کو WhatsApp استعمال کرنا نہیں آتا تھا۔ اب وہ خود ویڈیو کال کرتے ہیں!', quoteEn: 'My parents didn\'t know how to use WhatsApp. Now they video call on their own!' },
    { name: 'Fatima Noor', city: 'Faisalabad', quote: 'آن لائن نوکری کی درخواست دینا مشکل تھا۔ یہاں سے CV بنانا اور اپلائی کرنا سیکھا۔', quoteEn: 'Applying for jobs online was hard. I learned to make a CV and apply here.' },
    { name: 'Rizwan Akhtar', city: 'Quetta', quote: 'سرکاری پورٹلز بہت مشکل ہیں لیکن آسان ڈیجیٹل نے سب آسان کر دیا۔', quoteEn: 'Government portals are complex but Asaan Digital made everything simple.' },
  ];

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setFormStatus('error');
      return;
    }
    // Simulate send
    setFormStatus('success');
    setForm({ name: '', email: '', message: '' });
  };

  const scrollStories = (dir) => {
    if (storiesRef.current) {
      storiesRef.current.scrollBy({ left: dir * 340, behavior: 'smooth' });
    }
  };

  const milestones = [
    { number: '10,000+', label: 'People Helped', labelUrdu: 'لوگ مدد یافتہ', icon: '👥' },
    { number: '500+',    label: 'Guides Published', labelUrdu: 'گائیڈز شائع', icon: '📚' },
    { number: '50+',     label: 'Cities Reached', labelUrdu: 'شہروں تک رسائی', icon: '🏙️' },
    { number: '94%',     label: 'Satisfaction Rate', labelUrdu: 'اطمینان کی شرح', icon: '⭐' },
  ];

  return (
    <>
      {/* ── HERO ── */}
      <section className="impact-hero-section">
        <NetworkWeb />
        <div className="impact-hero-overlay" />
        <div className="container-xl">
          <div className="impact-hero-inner">

            {/* Left — single static square image */}
            <div className="impact-hero-img-col">
              <div className="impact-hero-img-box">
                <img src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=600&q=80" alt="Community" />
              </div>
            </div>

            {/* Right — text */}
            <div className="impact-hero-text-col">
              <div className="hero-eyebrow">🌟 Making Digital Pakistan Accessible</div>
              <h1 className="impact-main-title">
                <span className="title-urdu">بنانا پاکستان</span>
                <span className="title-en">Digital Pakistan</span>
              </h1>
              <p className="impact-lead-text">
                ہم ڈیجیٹل تقسیم کو ختم کر رہے ہیں — ہر شہری کو ڈیجیٹل خدمات تک مساوی رسائی۔
              </p>
              <div className="hero-stats-row">
                <div className="hero-stat">
                  <span className="hero-stat-number">{stats.peopleHelped.toLocaleString()}+</span>
                  <span className="hero-stat-label">لوگ مدد یافتہ</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat">
                  <span className="hero-stat-number">{stats.guidesPublished}+</span>
                  <span className="hero-stat-label">گائیڈز</span>
                </div>
                <div className="hero-stat-divider" />
                <div className="hero-stat">
                  <span className="hero-stat-number">{stats.citiesReached}+</span>
                  <span className="hero-stat-label">شہر</span>
                </div>
              </div>
              <a href="/seekhna" className="btn-impact-primary">
                سیکھنا شروع کریں <i className="fas fa-arrow-right ms-2" />
              </a>
            </div>

          </div>
        </div>
      </section>

      {/* ── IMPACT NUMBERS ── */}
      <section className="impact-numbers-section">
        <div className="container-xl">
          <div className="text-center mb-4">
            <h2 className="numbers-title">Our Impact in Numbers</h2>
          </div>
          <div className="numbers-grid">
            {milestones.map((item, i) => (
              <div className="number-card" key={i} data-aos="zoom-in" data-aos-delay={i * 100}>
                <div className="number-icon">{item.icon}</div>
                <div className="number-value">{item.number}</div>
                <div className="number-label-en">{item.label}</div>
                <div className="number-label-urdu">{item.labelUrdu}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── USER STORIES ── */}
      <section className="stories-section">
        <div className="container-xl">
          <div className="text-center mb-4" data-aos="fade-up">
            <h2 className="stories-title">User Stories — صارفین کی آوازیں</h2>
            <p className="stories-sub">Real people, real impact across Pakistan</p>
          </div>
          <div className="stories-scroll-wrapper">
            <button className="stories-arrow left" onClick={() => scrollStories(-1)}>
              <i className="fas fa-chevron-left" />
            </button>
            <div className="stories-track" ref={storiesRef}>
              {userStories.map((s, i) => (
                <div className="story-card" key={i}>
                  <div className="story-quote-icon">"</div>
                  <p className="story-quote-urdu" dir="rtl">{s.quote}</p>
                  <p className="story-quote-en">{s.quoteEn}</p>
                  <div className="story-author">
                    <div className="story-author-avatar">{s.name[0]}</div>
                    <div>
                      <div className="story-author-name">{s.name}</div>
                      <div className="story-author-city">{s.city}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="stories-arrow right" onClick={() => scrollStories(1)}>
              <i className="fas fa-chevron-right" />
            </button>
          </div>
        </div>
      </section>

      {/* ── JOIN THE IMPACT ── */}
      <section className="join-section">
        <NetworkWeb />
        <div className="join-overlay" />
        <div className="container-xl">
          <div className="join-inner">
            <div className="join-text" data-aos="fade-right">
              <div className="join-eyebrow">✉️ Get In Touch</div>
              <h2 className="join-title">Join the Impact<br /><span dir="rtl">اثر میں شامل ہوں</span></h2>
              <p className="join-desc">
                Have feedback, want to contribute, or just want to say hello? Write to us — every message matters.
              </p>
            </div>
            <div className="join-form-wrap" data-aos="fade-left">
              <form className="join-form" onSubmit={handleFormSubmit}>
                <div className="form-field">
                  <label>Your Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Amna Bibi"
                    value={form.name}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-field">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleFormChange}
                  />
                </div>
                <div className="form-field">
                  <label>Message / Description</label>
                  <textarea
                    name="message"
                    rows={4}
                    placeholder="Tell us your thoughts, feedback, or story..."
                    value={form.message}
                    onChange={handleFormChange}
                  />
                </div>
                {formStatus === 'success' && (
                  <div className="form-success">✅ Message sent! We'll get back to you soon.</div>
                )}
                {formStatus === 'error' && (
                  <div className="form-error">⚠️ Please fill in all fields.</div>
                )}
                <button type="submit" className="btn-send">
                  Send Message <i className="fas fa-paper-plane ms-2" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Impact;