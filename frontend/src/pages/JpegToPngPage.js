import React, { useState } from 'react';
import Footer from '../components/Footer';

// This is the new component for JPG to PNG
function JpegToPngPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    // Still accepts only JPEG as input
    if (file && (file.type === 'image/jpeg' || file.type === 'image/jpg')) {
      setSelectedFile(file);
      setError(null);
    } else {
      setSelectedFile(null);
      setError('Please select a valid .jpg or .jpeg file');
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

    // --- CHANGED LINE ---
    // Point to the new backend endpoint
    fetch('http://localhost:5000/api/jpg-to-png', {
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
        
        // --- CHANGED LINE ---
        a.download = 'converted.png'; // Set the download name to .png
        
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
      {/* --- CHANGED TEXT --- */}
      <h2>JPEG to PNG Converter</h2>
      <p>Upload your .jpg or .jpeg file to convert it to a PNG.</p>
      
      <div className="upload-box">
        <input 
          type="file" 
          id="fileUpload"
          className="file-input"
          accept=".jpg, .jpeg" 
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

export default JpegToPngPage;