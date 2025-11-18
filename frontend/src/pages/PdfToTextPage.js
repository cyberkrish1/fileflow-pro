import React, { useState } from 'react';

// This is the new component for PDF to Text
function PdfToTextPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    // Accept .pdf
    if (file && (file.type === 'application/pdf' || file.name.endsWith('.pdf'))) {
      setSelectedFile(file);
      setError(null);
    } else {
      setSelectedFile(null);
      setError('Please select a valid .pdf file');
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

    // Point to the new backend endpoint
    fetch('http://localhost:5000/api/pdf-to-text', {
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
        
        a.download = 'converted.txt'; // Set the download name to .txt
        
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
      <h2>PDF to Text Converter</h2>
      <p>Upload your .pdf file to extract its text content to a .txt file.</p>
      
      <div className="upload-box">
        <input 
          type="file" 
          id="fileUpload"
          className="file-input"
          accept=".pdf,application/pdf" 
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
      <div className="disclaimer-note" style={{marginTop: '20px', fontSize: '14px', color: '#6c757d'}}>
          <strong>Note:</strong> This tool extracts text. It will not work on scanned images of text.
      </div>
    </div>
  );
}

export default PdfToTextPage;