import React, { useState } from 'react';
import { API_URL } from '../apiConfig'; // <-- 1. IMPORT

function PdfSummarizerPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [summaryText, setSummaryText] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
      setSummaryText('');
    } else {
      setSelectedFile(null);
      setError('Please select a valid .pdf file');
      event.target.value = null;
    }
  };

  const handleSummarize = () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSummaryText('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    // 2. USE THE API_URL VARIABLE
    fetch(`${API_URL}/api/summarize-pdf`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        return response.json().then(data => {
          if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
          }
          return data;
        });
      })
      .then((data) => {
        setSummaryText(data.summary);
        setIsLoading(false);
        setSelectedFile(null);
      })
      .catch((err) => {
        console.error('Summarize Error:', err);
        setError(err.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="converter-container">
      <h2>PDF AI Summarizer</h2>
      <p>Upload a text-based PDF to get a summary from our AI.</p>
      
      <div className="upload-box">
        <input 
          type="file" 
          id="fileUpload"
          className="file-input"
          accept=".pdf" 
          onChange={handleFileChange}
          key={selectedFile ? selectedFile.name : 'no-file'} 
        />
        <label htmlFor="fileUpload" className={`file-label ${selectedFile ? 'selected' : ''}`}>
          {selectedFile ? 'File: ' + selectedFile.name : 'Click to choose a file'}
        </label>
        
        <button 
          className="convert-button"
          onClick={handleSummarize} 
          disabled={isLoading || !selectedFile}
        >
          {isLoading ? 'Summarizing...' : 'Summarize PDF'} <i className="fas fa-brain"></i>
        </button>
        
        {error && <p className="error-message">{error}</p>}
      </div>

      {isLoading && (
        <div className="loading-spinner-container">
          <div className="loading-spinner"></div>
          <p>AI is reading your document... This may take a moment.</p>
        </div>
      )}

      {summaryText && (
        <div className="summary-result-box">
          <h3>Summary:</h3>
          <p>{summaryText}</p>
        </div>
      )}
    </div>
  );
}

export default PdfSummarizerPage;