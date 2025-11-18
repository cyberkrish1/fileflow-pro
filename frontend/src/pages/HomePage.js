import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ToolCard from '../components/ToolCard';
import Footer from '../components/Footer';

function HomePage() {
  const location = useLocation();

  // This effect runs when the page loads or when location state changes
  useEffect(() => {
    // Check if we were navigated here with a scroll request
    if (location.state && location.state.scrollToId) {
      const id = location.state.scrollToId;
      const element = document.getElementById(id);
      
      if (element) {
        // Scroll after a short delay to ensure the page has rendered
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    }
  }, [location.state]); // Re-run effect when state changes

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-title">
            Your <span className="highlight-bold">Go-To</span> Free <span className="highlight-bold">File</span> <span className="hero-converter-text">Converter</span>
          </h1>
          <p className="hero-subtitle-new">
            Convert, merge, split, resize, and compress your files with ease.
          </p>
        </div>
      </section>

      {/* --- Featured Tool Section (with new ID) --- */}
      <section id="ai-summarizer" className="container featured-tool-section">
        <h2 className="tool-group-heading">Featured AI Tool</h2>
        <ToolCard
          title="PDF AI Summarizer"
          description="Use AI to quickly summarize your PDF documents. Upload a file and get key insights in seconds."
          link="/pdf-summarizer"
          icon="/automation"
          
          
          buttonText="Try AI Summarizer"
        />
      </section>
      
      {/* --- TOOL GROUP CONTAINER --- */}
      <section className="container tool-groups-container">
        
        

        {/* --- Group 1 (with new ID) --- */}
        <div id="pdf-tools" className="tool-group">
          <h2 className="tool-group-heading">PDF Tools</h2>
          <div className="tool-grid">
            <ToolCard
              title="Merge PDFs"
              description="Combine multiple PDF files into a single, organized document."
              link="/merge-pdfs"
              icon="fas fa-object-group"
              buttonText="Try Now"
            />
            <ToolCard
              title="Split PDF"
              description="Extract a specific page range from a PDF file."
              link="/split-pdf"
              icon="fas fa-cut"
              buttonText="Try Now"
            />
            <ToolCard
              title="Protect PDF"
              description="Add a password and encrypt your PDF file."
              link="/protect-pdf"
              icon="fas fa-lock"
              buttonText="Try Now"
            />
            <ToolCard
              title="Unlock PDF"
              description="Remove password protection from an encrypted PDF."
              link="/unlock-pdf"
              icon="fas fa-lock-open"
              buttonText="Try Now"
            />
          </div>
        </div>

        {/* --- Group 2 (with new ID) --- */}
        <div id="image-converters" className="tool-group">
          <h2 className="tool-group-heading">Image Converter</h2>
          <div className="tool-grid">
            <ToolCard
              title="JPG to PNG"
              description="Convert your JPEG images to high-quality PNG files."
              link="/jpeg-to-png"
              icon="fas fa-image"
              buttonText="Try Now"
            />
            <ToolCard
              title="PNG to JPG"
              description="Convert your PNG images to standard JPG files."
              link="/png-to-jpg"
              icon="fas fa-exchange-alt"
              buttonText="Try Now"
            />
            <ToolCard
              title="Image Compressor"
              description="Reduce the file size of your JPG and PNG images."
              link="/image-compressor"
              icon="fas fa-file-zipper"
              buttonText="Try Now"
            />
            <ToolCard
              title="Image Resizer"
              description="Quickly resize any JPG or PNG image to your exact dimensions."
              link="/image-resizer"
              icon="fas fa-compress-arrows-alt"
              buttonText="Try Now"
            />
            
        
          </div>
        </div>

        {/* --- Group 3 (with new ID) --- */}
        <div id="document-converters" className="tool-group">
          <h2 className="tool-group-heading">Document Converters</h2>
          <div className="tool-grid">
            <ToolCard
              title="PDF to Word"
              description="Convert your PDF files into editable .docx Word documents."
              link="/pdf-to-word"
              icon="fas fa-file-word"
              buttonText="Try Now"
            />
            <ToolCard
              title="Word to PDF"
              description="Convert your .doc or .docx files into a professional PDF document."
              link="/word-to-pdf"
              icon="fas fa-file-pdf"
              buttonText="Try Now"
            />
            <ToolCard
              title="Text to PDF"
              description="Convert a plain .txt file into a simple, readable PDF document."
              link="/text-to-pdf"
              icon="fas fa-file-lines"
              buttonText="Try Now"
            />
            <ToolCard
              title="PDF to Text"
              description="Extract all text content from a PDF into a plain .txt file."
              link="/pdf-to-text"
              icon="fas fa-file-alt"
              buttonText="Try Now"
            />
            <ToolCard
              title="JPG to PDF"
              description="Convert your photos and images into a single PDF document."
              link="/jpeg-to-pdf"
              icon="fas fa-file-image"
              buttonText="Try Now"
            />
            <ToolCard
              title="More Converters Coming Soon"
              description="Stay tuned for DOCX to PDF, PNG to JPG, and many more tools!"
              link="#"
              icon="fas fa-plus"
              buttonText="In Development"
              comingSoon={true}
            />
          </div>
        </div>

      </section>
      
      <Footer />
    </>
  );
}

export default HomePage;