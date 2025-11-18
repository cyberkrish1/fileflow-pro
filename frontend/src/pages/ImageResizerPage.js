import React, { useState } from 'react';
import '../App.css'; // We'll add new styles to App.css

function ImageResizerPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [width, setWidth] = useState(''); // State for width
  const [height, setHeight] = useState(''); // State for height
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

  const handleResize = () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }
    if (!width || !height) {
      setError('Please enter both width and height.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('width', width); // Add width to form data
    formData.append('height', height); // Add height to form data

    fetch('http://localhost:5000/api/resize-image', {
      method: 'POST',
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(err.error || 'Something went wrong');
          });
        }
        // Get the filename from the Content-Disposition header
        const disposition = response.headers.get('Content-Disposition');
        let downloadName = 'resized-image.jpg'; // Default
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
        setWidth('');
        setHeight('');
      })
      .catch((err) => {
        console.error('Resize Error:', err);
        setError(err.message);
        setIsLoading(false);
      });
  };

  return (
    <div className="converter-container">
      <h2>Image Resizer</h2>
      <p>Upload your JPEG or PNG file to resize it.</p>
      
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

        {/* New Width/Height Inputs */}
        <div className="dimension-inputs">
          <input
            type="number"
            className="dimension-input"
            placeholder="Width (e.g., 1920)"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            disabled={isLoading}
          />
          <span className="dimension-separator">x</span>
          <input
            type="number"
            className="dimension-input"
            placeholder="Height (e.g., 1080)"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        <button 
          className="convert-button"
          onClick={handleResize} 
          disabled={isLoading || !selectedFile || !width || !height}
        >
          {isLoading ? 'Resizing...' : 'Resize & Download'} <i className="fas fa-download"></i>
        </button>
        
        {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default ImageResizerPage;