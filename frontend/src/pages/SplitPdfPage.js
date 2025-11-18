import React, { useState } from 'react';
import { API_URL } from '../apiConfig'; // <-- 1. IMPORT

function SplitPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [startPage, setStartPage] = useState('');
  const [endPage, setEndPage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'application/pdf') {
      setSelectedFile(file);
      setError(null);
    } else {
      setSelectedFile(null);
      setError('Please select a valid .pdf file');
      event.target.value = null;
    }
  };

  const handleSplit = () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }
    if (!startPage || !endPage) {
      setError('Please enter both a start and end page.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('startPage', startPage);
    formData.append('endPage', endPage);

    // 2. USE THE API_URL VARIABLE
    fetch(`${API_URL}/api/split-pdf`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error || 'Something went wrong');
          });
        }
        const disposition = response.headers.get('Content-Disposition');
        let downloadName = 'split.pdf';
        if (disposition && disposition.indexOf('attachment') !== -1) {
          const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
          const matches = filenameRegex.exec(disposition);
          if (matches && matches[1]) {
            downloadName = matches[1].replace(/['"]/g, '');
          }
        }
        return response.blob().then(blob => ({ blob, downloadName }));
      })
      .then(({ blob, downloadName }) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = downloadName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        setIsLoading(false);
        setSelectedFile(null);
        setStartPage('');
        setEndPage('');
      })
      .catch((err) => {
        console.error('Split Error:', err);
        setError(err.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="converter-container">
      <h2>Split PDF by Range</h2>
      <p>Upload your PDF and select a page range to extract.</p>
      
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

        <div className="dimension-inputs">
          <input
            type="number"
            className="dimension-input"
            placeholder="Start Page"
            value={startPage}
            onChange={(e) => setStartPage(e.target.value)}
            disabled={isLoading}
          />
          <span className="dimension-separator">-</span>
          <input
            type="number"
            className="dimension-input"
            placeholder="End Page"
            value={endPage}
            onChange={(e) => setEndPage(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <button 
          className="convert-button"
          onClick={handleSplit} 
          disabled={isLoading || !selectedFile || !startPage || !endPage}
        >
          {isLoading ? 'Splitting...' : 'Split & Download'} <i className="fas fa-download"></i>
        </button>
        
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default SplitPdfPage;