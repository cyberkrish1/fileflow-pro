import React, { useState } from 'react';

// This is the new component for Word to PDF
function WordToPdfPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    
    // Accept .doc and .docx
    const validTypes = [
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document' // .docx
    ];

    if (file && (validTypes.includes(file.type) || file.name.endsWith('.doc') || file.name.endsWith('.docx'))) {
      setSelectedFile(file);
      setError(null);
    } else {
      setSelectedFile(null);
      setError('Please select a valid .doc or .docx file');
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
    fetch('http://localhost:5000/api/word-to-pdf', {
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
        
        a.download = 'converted.pdf'; // Set the download name to .pdf
        
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
      <h2>Word to PDF Converter</h2>
      <p>Upload your .doc or .docx file to convert it to a PDF.</p>
      
      <div className="upload-box">
        <input 
          type="file" 
          id="fileUpload"
          className="file-input"
          accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
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
          <strong>Note:</strong> This conversion requires <strong>Microsoft Word</strong> (on Windows) or 
          <strong> LibreOffice</strong> (on Mac/Linux) to be installed on the server.
      </div>
    </div>
  );
}

export default WordToPdfPage;