import React, { useState } from 'react';
import { API_URL } from '../apiConfig'; // <-- 1. IMPORT

function ProtectPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState('');
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

  const handleProtect = () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }
    if (!password) {
      setError('Please enter a password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('password', password);

    // 2. USE THE API_URL VARIABLE
    fetch(`${API_URL}/api/protect-pdf`, {
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
        a.download = 'protected.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        setIsLoading(false);
        setSelectedFile(null);
        setPassword('');
      })
      .catch((err) => {
        console.error('Protection Error:', err);
        setError(err.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="converter-container">
      <h2>Protect PDF with Password</h2>
      <p>Upload your PDF and add a password to encrypt it.</p>
      
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

        <div className="password-input-container">
          <input
            type="password"
            className="password-input"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <button 
          className="convert-button"
          onClick={handleProtect} 
          disabled={isLoading || !selectedFile || !password}
        >
          {isLoading ? 'Protecting...' : 'Protect & Download'} <i className="fas fa-lock"></i>
        </button>
        
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default ProtectPdfPage;