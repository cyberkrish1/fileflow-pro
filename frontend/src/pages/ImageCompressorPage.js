import React, { useState } from 'react';
import '../App.css'; // We'll add new styles to App.css

function ImageCompressorPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [quality, setQuality] = useState(85); // State for compression quality
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setSelectedFile(file);
      setError(null);
    } else {
      setSelectedFile(null);
      setError('Please select a valid .jpg, .jpeg, or .png file');
      event.target.value = null;
    }
  };

  const handleCompress = () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('quality', quality); // Add quality to form data

    fetch('http://localhost:5000/api/compress-image', {
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
        let downloadName = 'compressed.jpg'; // Default
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
        a.download = downloadName; // Use filename from server
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        setIsLoading(false);
        setSelectedFile(null);
        // Don't reset quality, user might want to reuse it
      })
      .catch((err) => {
        console.error('Compress Error:', err);
        setError(err.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="converter-container">
      <h2>Image Compressor</h2>
      <p>Upload your JPEG or PNG file to reduce its file size.</p>
      
      <div className="upload-box">
        <input 
          type="file" 
          id="fileUpload"
          className="file-input"
          accept=".jpg, .jpeg, .png" 
          onChange={handleFileChange}
          key={selectedFile ? selectedFile.name : 'no-file'} 
        />
        <label htmlFor="fileUpload" className={`file-label ${selectedFile ? 'selected' : ''}`}>
          {selectedFile ? 'File: ' + selectedFile.name : 'Click to choose a file'}
        </label>

        {/* New Quality Slider */}
        <div className="compressor-options">
          <label htmlFor="quality">Compression Quality: <strong>{quality}</strong></label>
          <p>(For JPGs. PNGs will be optimized losslessly)</p>
          <input
            type="range"
            id="quality"
            className="compressor-slider"
            min="1"
            max="100"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <button 
          className="convert-button"
          onClick={handleCompress} 
          disabled={isLoading || !selectedFile}
        >
          {isLoading ? 'Compressing...' : 'Compress & Download'} <i className="fas fa-download"></i>
        </button>
        
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default ImageCompressorPage;