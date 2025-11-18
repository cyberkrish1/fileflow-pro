import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import JpegToPdfPage from './pages/JpegToPdfPage';
import JpegToPngPage from './pages/JpegToPngPage';
import PngToJpgPage from './pages/PngToJpgPage';
import ImageResizerPage from './pages/ImageResizerPage';
import ImageCompressorPage from './pages/ImageCompressorPage';
import PdfToWordPage from './pages/PdfToWordPage';
import WordToPdfPage from './pages/WordToPdfPage';
import TextToPdfPage from './pages/TextToPdfPage';
import PdfToTextPage from './pages/PdfToTextPage';
import MergePdfsPage from './pages/MergePdfsPage';
import SplitPdfPage from './pages/SplitPdfPage';
import ProtectPdfPage from './pages/ProtectPdfPage';
import UnlockPdfPage from './pages/UnlockPdfPage';
import PdfSummarizerPage from './pages/PdfSummarizerPage'; // <-- 1. IMPORT THE NEW PAGE
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/jpeg-to-pdf" element={<JpegToPdfPage />} />
        <Route path="/jpeg-to-png" element={<JpegToPngPage />} />
        <Route path="/png-to-jpg" element={<PngToJpgPage />} />
        <Route path="/image-resizer" element={<ImageResizerPage />} />
        <Route path="/image-compressor" element={<ImageCompressorPage />} />
        <Route path="/pdf-to-word" element={<PdfToWordPage />} />
        <Route path="/word-to-pdf" element={<WordToPdfPage />} />
        <Route path="/text-to-pdf" element={<TextToPdfPage />} />
        <Route path="/pdf-to-text" element={<PdfToTextPage />} />
        <Route path="/merge-pdfs" element={<MergePdfsPage />} />
        <Route path="/split-pdf" element={<SplitPdfPage />} />
        <Route path="/protect-pdf" element={<ProtectPdfPage />} />
        <Route path="/unlock-pdf" element={<UnlockPdfPage />} />
        <Route path="/pdf-summarizer" element={<PdfSummarizerPage />} /> {/* <-- 2. ADD THE NEW ROUTE */}
      </Routes>
    </div>
  );
}

export default App;