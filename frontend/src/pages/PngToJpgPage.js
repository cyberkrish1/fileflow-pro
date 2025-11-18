import React, { useState } from 'react';

// This is the new component for PNG to JPG
function PngToJpgPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    // --- CHANGED LINE ---
    // Accept only PNG
    if (file && file.type === 'image/png') {
      setSelectedFile(file);
      setError(null);
    } else {
      setSelectedFile(null);
      setError('Please select a valid .png file');
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
    fetch('http://localhost:5000/api/png-to-jpg', {
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
        a.download = 'converted.jpg'; // Set the download name to .jpg
        
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
      <h2>PNG to JPG Converter</h2>
      <p>Upload your .png file to convert it to a JPG.</p>
      
      <div className="upload-box">
        <input 
          type="file" 
          id="fileUpload"
          className="file-input"
          // --- CHANGED LINE ---
          accept=".png" 
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

export default PngToJpgPage;