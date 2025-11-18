import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Handles scrolling to an element on the homepage.
   * If not on the homepage, navigates there first.
   */
  const handleScroll = (id) => {
    // If we are not on the homepage...
    if (location.pathname !== '/') {
      // ...first navigate to the homepage and pass the ID to scroll to.
      navigate('/', { state: { scrollToId: id } });
    } else {
      // We are already on the homepage, just scroll.
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header className="header">
      <div className="container header-content">
        <Link to="/" className="logo">
          FileFlow Pro
        </Link>
        <nav className="main-nav">
          {/* --- THESE ARE NOW <button> TAGS --- */}
          <button className="nav-link" onClick={() => handleScroll('ai-summarizer')}>
            AI Summarizer
          </button>
          <button className="nav-link" onClick={() => handleScroll('pdf-tools')}>
            PDF Tools
          </button>
          <button className="nav-link" onClick={() => handleScroll('document-converters')}>
            Document Converters
          </button>
          <button className="nav-link" onClick={() => handleScroll('image-converters')}>
            Image Converters
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Header;