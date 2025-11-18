import React, { useState } from 'react';

// This is the new component for Merging PDFs
function MergePdfsPage() {
  const [selectedFiles, setSelectedFiles] = useState(null); // Will hold a FileList
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const files = event.target.files;
    
    // Check if user selected at least 2 files
    if (files && files.length >= 2) {
      setSelectedFiles(files);
      setError(null);
    } else {
      setSelectedFiles(null);
      setError('Please select at least 2 PDF files to merge.');
      event.target.value = null; // Clear the input
    }
  };

  const handleMerge = () => {
    if (!selectedFiles || selectedFiles.length < 2) {
      setError('Please select at least 2 files.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    
    // --- KEY CHANGE ---
    // Append each file to the FormData object with the same key 'files'
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('files', selectedFiles[i]);
    }

    // Point to the new backend endpoint
    fetch('http://localhost:5000/api/merge-pdfs', {
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
        
        a.download = 'merged.pdf'; // Set the download name
        
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        setIsLoading(false);
        setSelectedFiles(null);
      })
      .catch((err) => {
        console.error('Merge Error:', err);
        setError(err.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="converter-container">
      <h2>Merge PDFs</h2>
      <p>Combine multiple PDF files into one. Select at least 2 files.</p>
      
      <div className="upload-box">
        <input 
          type="file" 
          id="fileUpload"
          className="file-input"
          accept=".pdf" 
          multiple // --- KEY CHANGE ---
          onChange={handleFileChange}
          key={selectedFiles ? 'files-selected' : 'no-files'} // Reset input
        />
        <label htmlFor="fileUpload" className={`file-label ${selectedFiles ? 'selected' : ''}`}>
          {/* --- KEY CHANGE --- */}
          {selectedFiles ? `${selectedFiles.length} files selected` : 'Click to choose files'}
        </label>
        
        <button 
          className="convert-button"
          onClick={handleMerge} 
          disabled={isLoading || !selectedFiles}
        >
          {isLoading ? 'Merging...' : 'Merge & Download'} <i className="fas fa-download"></i>
        </button>
        
        {error && <p className="error-message">{error}</p>}
      </div>
      <div className="disclaimer-note" style={{marginTop: '20px', fontSize: '14px', color: '#6c757d'}}>
          <strong>Note:</strong> Files are merged in the order you select them.
      </div>
    </div>
  );
}

export default MergePdfsPage;