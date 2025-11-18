import React from 'react';
import { Link } from 'react-router-dom';

function ToolCard({ title, description, link, buttonText, comingSoon, icon }) {
  
  const cardClasses = `tool-card ${comingSoon ? 'coming-soon' : ''}`;

  // If the tool is "Coming Soon", render a non-link div with special styling
  if (comingSoon) {
    return (
      <div className={cardClasses}>
        <div className="icon">
          <i className={icon}></i>
        </div>
        {/* New content wrapper div */}
        <div className="tool-card-content">
          <h3>{title}</h3>
          <p>{description}</p>
          <button className="action-button" disabled>
            {buttonText}
          </button>
        </div>
      </div>
    );
  }

  // Otherwise, render a clickable link
  return (
    <Link to={link} className={cardClasses}>
      <div className="icon">
        <i className={icon}></i>
      </div>
      {/* New content wrapper div */}
      <div className="tool-card-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <div className="action-button">
          {buttonText} <i className="fas fa-arrow-right"></i>
        </div>
      </div>
    </Link>
  );
}

export default ToolCard;