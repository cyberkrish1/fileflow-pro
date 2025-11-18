import React, { useState } from 'react';
import { API_URL } from '../apiConfig'; // <-- 1. IMPORT

function TextToPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    if (file && (file.type === 'text/plain' || file.name.endsWith('.txt'))) {
      setSelectedFile(file);
      setError(null);
    } else {
      setSelectedFile(null);
      setError('Please select a valid .txt file');
      event.target.value = null;
    }
  };

  const handleConvert = () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    // 2. USE THE API_URL VARIABLE
    fetch(`${API_URL}/api/text-to-pdf`, {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error || 'Something went wrong');
          });
        }
        return response.blob();
      })
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'converted.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        setIsLoading(false);
        setSelectedFile(null);
      })
      .catch((err) => {
        console.error('Conversion Error:', err);
        setError(err.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="converter-container">
      <h2>Text to PDF Converter</h2>
      <p>Upload your .txt file to convert it to a simple PDF.</p>
      
      <div className="upload-box">
        <input 
          type="file" 
          id="fileUpload"
          className="file-input"
          accept=".txt,text/plain" 
          onChange={handleFileChange}
          key={selectedFile ? selectedFile.name : 'no-file'} 
        />
        <label htmlFor="fileUpload" className={`file-label ${selectedFile ? 'selected' : ''}`}>
          {selectedFile ? 'File Selected: ' + selectedFile.name : 'Click to choose a file'}
        </label>
        
        <button 
          className="convert-button"
          onClick={handleConvert} 
          disabled={isLoading || !selectedFile}
        >
          {isLoading ? 'Converting...' : 'Convert & Download'} <i className="fas fa-download"></i>
        </button>
        
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default TextToPdfPage;