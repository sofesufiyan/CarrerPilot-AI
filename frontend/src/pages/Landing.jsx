import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="landing-page">
      <div className="bg-grid"></div>

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="logo">
            <div className="logo-icon">🚀</div>
            <div className="logo-text">CareerPilot <span>AI</span></div>
          </Link>

          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#how-it-works">How It Works</a></li>
            <li><a href="#dashboard">Dashboard</a></li>
            <li><a href="#pricing">Pricing</a></li>
          </ul>

          <div className="nav-actions">
            <Link to="/login" className="btn btn-ghost">Sign In</Link>
            <Link to="/signup" className="btn btn-primary">Get Started Free</Link>
          </div>
        </div>
      </nav>

      <div className="hero-section">
        <div className="hero-content">
          <div className="hero-badge">✨ CareerPilot AI 2.0 is live</div>
          <h1 className="hero-title">Ready to Accelerate<br/>Your Career?</h1>
          <p className="hero-desc">
            Join 50,000+ professionals already using CareerPilot AI to<br/>land their dream roles faster.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary btn-lg">Get Started — It's Free &rarr;</Link>
            <button className="btn btn-ghost btn-lg">Talk to Sales</button>
          </div>
        </div>
      </div>

      <section id="dashboard" className="section dashboard-section">
        <div className="section-inner">
          <div className="dashboard-grid">
            <div className="dashboard-content">
              <div className="section-label">YOUR DASHBOARD</div>
              <h3>Track Every Metric That Matters</h3>
              <p>A beautiful, data-rich dashboard that gives you complete visibility into your career progress, skills development, and job search performance.</p>
              <ul className="check-list">
                <li><div className="check-icon">✓</div>Real-time skill proficiency tracking</li>
                <li><div className="check-icon">✓</div>Application & interview analytics</li>
                <li><div className="check-icon">✓</div>Weekly progress reports via email</li>
                <li><div className="check-icon">✓</div>Industry benchmarking comparisons</li>
                <li><div className="check-icon">✓</div>Learning path completion metrics</li>
              </ul>
              <Link to="/signup" className="btn btn-primary">Explore Dashboard</Link>
            </div>
            
            <div className="floating-card-wrapper">
              <div className="floating-card floating-card-1">
                <div className="fc-label">Profile Strength</div>
                <div className="fc-value">94% <span className="tag tag-green">↑ Top 5%</span></div>
              </div>
              <div className="floating-card floating-card-2">
                <div className="fc-label">Active Applications</div>
                <div className="fc-value">12 <span className="tag tag-green">3 Interviews</span></div>
              </div>
              <div className="mock-dashboard">
                <div className="mock-dash-header">
                  <div className="mock-dash-title">Skills Overview</div>
                  <div className="mock-dash-tabs">
                    <span className="active">Skills</span>
                    <span>Progress</span>
                    <span>Goals</span>
                  </div>
                </div>
                <div className="mock-skill-bars">
                  <div className="mock-skill">
                    <div className="ms-label"><span>Python & ML Libraries</span><span>87%</span></div>
                    <div className="ms-bar"><div className="ms-fill" style={{width: '87%', background: 'var(--accent)'}}></div></div>
                  </div>
                  <div className="mock-skill">
                    <div className="ms-label"><span>System Design</span><span>72%</span></div>
                    <div className="ms-bar"><div className="ms-fill" style={{width: '72%', background: 'var(--gradient-2)'}}></div></div>
                  </div>
                  <div className="mock-skill">
                    <div className="ms-label"><span>Data Structures & Algo</span><span>91%</span></div>
                    <div className="ms-bar"><div className="ms-fill" style={{width: '91%', background: 'var(--success)'}}></div></div>
                  </div>
                  <div className="mock-skill">
                    <div className="ms-label"><span>Behavioral Interview</span><span>65%</span></div>
                    <div className="ms-bar"><div className="ms-fill" style={{width: '65%', background: 'var(--warning)'}}></div></div>
                  </div>
                </div>
                <div className="mock-dash-stats">
                  <div className="mock-stat">
                    <div className="ms-title">Applications Sent</div>
                    <div className="ms-val">47</div>
                    <div className="ms-trend">↑ 23% this week</div>
                  </div>
                  <div className="mock-stat">
                    <div className="ms-title">Interviews Lined Up</div>
                    <div className="ms-val">8</div>
                    <div className="ms-trend">↑ 3 new this week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-label">HOW IT WORKS</div>
            <h2 className="section-title">From Sign-Up to<br/>Career Success</h2>
            <p className="section-desc">Four simple steps to transform your career trajectory with the power of artificial intelligence.</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number">1</div>
              <h3>Create Your Profile</h3>
              <p>Import your resume or LinkedIn profile. Our AI parses and structures your experience automatically.</p>
            </div>
            <div className="step-card">
              <div className="step-number">2</div>
              <h3>Set Your Goals</h3>
              <p>Tell us your dream role, timeline, and preferences. The more specific, the better your roadmap.</p>
            </div>
            <div className="step-card">
              <div className="step-number">3</div>
              <h3>Get AI Insights</h3>
              <p>Receive personalized career plans, skill gap analysis, and curated learning paths instantly.</p>
            </div>
            <div className="step-card">
              <div className="step-number">4</div>
              <h3>Land Your Role</h3>
              <p>Practice with mock interviews, optimize your resume, and apply with confidence to matched jobs.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="section-inner">
          <div className="section-header">
            <div className="section-label">⭐ CORE FEATURES</div>
            <h2 className="section-title">Everything You Need to<br/>Advance Your Career</h2>
            <p className="section-desc">Six powerful AI-driven tools designed to give you an unfair advantage in your career journey.</p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon fi-1">🧭</div>
              <h3>Career Path Mapping</h3>
              <p>AI-generated roadmaps tailored to your goals, showing clear milestones and skill requirements for your dream role.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon fi-2">📄</div>
              <h3>Resume Optimizer</h3>
              <p>Get ATS-friendly suggestions, keyword optimization, and impact-driven bullet point rewrites in seconds.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon fi-3">🎤</div>
              <h3>Mock Interviews</h3>
              <p>Practice with AI interviewers that simulate real scenarios, from behavioral to system design, with instant feedback.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon fi-4">📊</div>
              <h3>Skill Gap Analysis</h3>
              <p>Compare your current skills against market demands and get personalized learning recommendations.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon fi-5">💼</div>
              <h3>Job Match Engine</h3>
              <p>Get matched with opportunities that align perfectly with your experience, preferences, and career trajectory.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon fi-6">📈</div>
              <h3>Salary Intelligence</h3>
              <p>Real-time market data and negotiation strategies personalized for your role, location, and experience level.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="logo">
            <div className="logo-icon">🚀</div>
            <div className="logo-text">CareerPilot <span>AI</span></div>
          </div>
          <div className="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Documentation</a>
            <a href="#">Support</a>
            <a href="#">Blog</a>
          </div>
          <div className="footer-copy">
            &copy; 2025 CareerPilot AI. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
