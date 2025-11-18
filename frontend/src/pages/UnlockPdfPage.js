import React, { useState } from 'react';

// This is the new component for Unlocking PDFs
function UnlockPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [password, setPassword] = useState(''); // State for password
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

  const handleUnlock = () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }
    if (!password) {
      setError('Please enter the password.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('password', password);

    // Point to the new backend endpoint
    fetch('http://localhost:5000/api/unlock-pdf', {
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
        a.download = 'unlocked.pdf'; // New download name
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        setIsLoading(false);
        setSelectedFile(null);
        setPassword('');
      })
      .catch((err) => {
        console.error('Unlock Error:', err);
        setError(err.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="converter-container">
      <h2>Unlock PDF</h2>
      <p>Upload your PDF and enter its password to remove encryption.</p>
      
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

        {/* Re-using styles from Protect PDF */}
        <div className="password-input-container">
          <input
            type="password"
            className="password-input"
            placeholder="Enter PDF password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <button 
          className="convert-button"
          onClick={handleUnlock} 
          disabled={isLoading || !selectedFile || !password}
        >
          {isLoading ? 'Unlocking...' : 'Unlock & Download'} <i className="fas fa-lock-open"></i>
        </button>
        
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default UnlockPdfPage;