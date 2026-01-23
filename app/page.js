'use client';

import { useState, useRef } from 'react';

export default function Home() {
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [feelings, setFeelings] = useState({
    energy: null,
    legs: null,
    breathing: null,
    mood: null,
  });
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('form'); // form, processing, confirmation, success
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const fileInputRef = useRef(null);

  const handleFiles = (newFiles) => {
    const imageFiles = Array.from(newFiles).filter((f) =>
      f.type.startsWith('image/')
    );

    setFiles((prev) => [...prev, ...imageFiles]);

    // Create previews
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [
          ...prev,
          { name: file.name, url: e.target.result },
        ]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (fileName) => {
    setFiles((prev) => prev.filter((f) => f.name !== fileName));
    setPreviews((prev) => prev.filter((p) => p.name !== fileName));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleUploadAndExtract = async () => {
    if (files.length === 0) return;

    setStatus('processing');
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('images', file);
      });

      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Extraction failed');
      }

      setExtractedData(result.data);
      setStatus('confirmation');
    } catch (err) {
      setError(err.message);
      setStatus('form');
    }
  };

  const handleConfirmSave = () => {
    // In a full app, this would save to a database
    // For now, just show success
    setStatus('success');
  };

  const handleLogAnother = () => {
    setFiles([]);
    setPreviews([]);
    setFeelings({ energy: null, legs: null, breathing: null, mood: null });
    setNotes('');
    setExtractedData(null);
    setError(null);
    setStatus('form');
  };

  const feelingOptions = {
    energy: [
      { value: 1, emoji: '😴', text: 'Exhausted' },
      { value: 2, emoji: '😔', text: 'Low' },
      { value: 3, emoji: '😐', text: 'Normal' },
      { value: 4, emoji: '😊', text: 'Good' },
      { value: 5, emoji: '🔥', text: 'Energized' },
    ],
    legs: [
      { value: 1, emoji: '😫', text: 'Very Sore' },
      { value: 2, emoji: '😣', text: 'Sore' },
      { value: 3, emoji: '😌', text: 'Mild' },
      { value: 4, emoji: '😀', text: 'Light' },
      { value: 5, emoji: '💪', text: 'Fresh' },
    ],
    breathing: [
      { value: 1, emoji: '😵', text: 'Gasping' },
      { value: 2, emoji: '😤', text: 'Heavy' },
      { value: 3, emoji: '😮‍💨', text: 'Moderate' },
      { value: 4, emoji: '😊', text: 'Controlled' },
      { value: 5, emoji: '😎', text: 'Easy' },
    ],
    mood: [
      { value: 1, emoji: '😞', text: 'Struggling' },
      { value: 2, emoji: '😕', text: 'Meh' },
      { value: 3, emoji: '🙂', text: 'Okay' },
      { value: 4, emoji: '😄', text: 'Good' },
      { value: 5, emoji: '🤩', text: 'Amazing' },
    ],
  };

  return (
    <>
      <div className="topo-bg"></div>
      <div className="container">
        {/* Header */}
        <header>
          <div className="header-inner">
            <div className="logo">
              <div className="logo-mark">↗</div>
              <div className="logo-text">
                RUN<span>COACH</span>
              </div>
            </div>
            <nav>
              <button className="nav-link active">LOG RUN</button>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <section className="logrun-container">
          {status === 'form' && (
            <div className="logrun-grid">
              {/* Upload Zone */}
              <div className="upload-zone">
                <h2 className="card-title" style={{ marginBottom: '8px' }}>
                  Upload Run Screenshots
                </h2>
                <p className="card-subtitle" style={{ marginBottom: '24px' }}>
                  Drag & drop your Apple Watch workout screenshots
                </p>

                <div
                  className={`upload-dropzone ${dragOver ? 'dragover' : ''} ${
                    files.length > 0 ? 'has-files' : ''
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  <span className="upload-icon">📸</span>
                  <h3 className="upload-title">Drop Screenshots Here</h3>
                  <p className="upload-subtitle">or click to browse your files</p>
                  <button
                    className="upload-btn"
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                  >
                    Select Files
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                </div>

                {previews.length > 0 && (
                  <div className="preview-grid">
                    {previews.map((preview) => (
                      <div key={preview.name} className="preview-thumb">
                        <img src={preview.url} alt="Preview" />
                        <button
                          className="remove-btn"
                          onClick={() => removeFile(preview.name)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {files.length > 0 && (
                  <p
                    style={{
                      marginTop: '16px',
                      fontSize: '14px',
                      color: 'var(--stone)',
                      textAlign: 'center',
                    }}
                  >
                    📸 {files.length} screenshot(s) ready to upload
                  </p>
                )}

                {error && (
                  <div
                    style={{
                      marginTop: '16px',
                      padding: '16px',
                      background: 'rgba(232, 93, 4, 0.1)',
                      borderRadius: '10px',
                      color: 'var(--burnt-orange)',
                      fontSize: '14px',
                    }}
                  >
                    ⚠️ {error}
                  </div>
                )}
              </div>

              {/* Feelings Zone */}
              <div className="feelings-zone">
                <h2 className="feelings-title">How Did You Feel?</h2>
                <p className="feelings-subtitle">
                  Quick check-in to help track your recovery and progress
                </p>

                {/* Energy Level */}
                <div className="feeling-tracker">
                  <div className="feeling-label">⚡ Energy Level</div>
                  <div className="feeling-options">
                    {feelingOptions.energy.map((opt) => (
                      <div
                        key={opt.value}
                        className={`feeling-option ${
                          feelings.energy === opt.value ? 'selected' : ''
                        }`}
                        onClick={() =>
                          setFeelings((f) => ({ ...f, energy: opt.value }))
                        }
                      >
                        <span className="feeling-emoji">{opt.emoji}</span>
                        <span className="feeling-text">{opt.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Leg Soreness */}
                <div className="feeling-tracker">
                  <div className="feeling-label">🦵 Leg Soreness</div>
                  <div className="feeling-options">
                    {feelingOptions.legs.map((opt) => (
                      <div
                        key={opt.value}
                        className={`feeling-option ${
                          feelings.legs === opt.value ? 'selected' : ''
                        }`}
                        onClick={() =>
                          setFeelings((f) => ({ ...f, legs: opt.value }))
                        }
                      >
                        <span className="feeling-emoji">{opt.emoji}</span>
                        <span className="feeling-text">{opt.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Breathing */}
                <div className="feeling-tracker">
                  <div className="feeling-label">💨 Breathing</div>
                  <div className="feeling-options">
                    {feelingOptions.breathing.map((opt) => (
                      <div
                        key={opt.value}
                        className={`feeling-option ${
                          feelings.breathing === opt.value ? 'selected' : ''
                        }`}
                        onClick={() =>
                          setFeelings((f) => ({ ...f, breathing: opt.value }))
                        }
                      >
                        <span className="feeling-emoji">{opt.emoji}</span>
                        <span className="feeling-text">{opt.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mood */}
                <div className="feeling-tracker">
                  <div className="feeling-label">🧠 Post-Run Mood</div>
                  <div className="feeling-options">
                    {feelingOptions.mood.map((opt) => (
                      <div
                        key={opt.value}
                        className={`feeling-option ${
                          feelings.mood === opt.value ? 'selected' : ''
                        }`}
                        onClick={() =>
                          setFeelings((f) => ({ ...f, mood: opt.value }))
                        }
                      >
                        <span className="feeling-emoji">{opt.emoji}</span>
                        <span className="feeling-text">{opt.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="notes-section">
                  <div className="notes-label">📝 Notes (Optional)</div>
                  <textarea
                    className="notes-textarea"
                    placeholder="How did the run go? Any observations about your form, the route, how you paced yourself?"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                {/* Upload Button */}
                <div className="save-section">
                  <button
                    className="save-btn"
                    disabled={files.length === 0}
                    onClick={handleUploadAndExtract}
                  >
                    📤 UPLOAD & EXTRACT
                  </button>
                </div>
              </div>
            </div>
          )}

          {status === 'processing' && (
            <div
              className="card"
              style={{
                maxWidth: '500px',
                margin: '0 auto',
                textAlign: 'center',
                padding: '60px 40px',
              }}
            >
              <div className="processing-spinner"></div>
              <h3 className="card-title" style={{ marginTop: '24px' }}>
                Processing Screenshots...
              </h3>
              <p className="card-subtitle">
                Extracting run data from your images
              </p>
            </div>
          )}

          {status === 'confirmation' && extractedData && (
            <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
              <div className="card-header">
                <div>
                  <h2 className="card-title">✅ Data Extracted — Please Confirm</h2>
                  <p className="card-subtitle">
                    Review the extracted data before saving
                  </p>
                </div>
              </div>

              <div className="extracted-data">
                <div className="extracted-header">
                  <span>📊</span> Run Data
                </div>
                <div className="extracted-grid">
                  <div className="extracted-item">
                    <div className="extracted-value">
                      {extractedData.distance || '--'} mi
                    </div>
                    <div className="extracted-label">Distance</div>
                  </div>
                  <div className="extracted-item">
                    <div className="extracted-value">
                      {extractedData.time || '--'}
                    </div>
                    <div className="extracted-label">Time</div>
                  </div>
                  <div className="extracted-item">
                    <div className="extracted-value">
                      {extractedData.pace || '--'}/mi
                    </div>
                    <div className="extracted-label">Avg Pace</div>
                  </div>
                  <div className="extracted-item">
                    <div className="extracted-value">
                      {extractedData.hr || '--'} bpm
                    </div>
                    <div className="extracted-label">Avg HR</div>
                  </div>
                  <div className="extracted-item">
                    <div className="extracted-value">
                      {extractedData.cadence || '--'} spm
                    </div>
                    <div className="extracted-label">Cadence</div>
                  </div>
                  <div className="extracted-item">
                    <div className="extracted-value">
                      {extractedData.calories || '--'} cal
                    </div>
                    <div className="extracted-label">Calories</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                <button
                  className="log-another-btn"
                  style={{ flex: 1, background: 'var(--stone-light)' }}
                  onClick={() => setStatus('form')}
                >
                  ← Back to Edit
                </button>
                <button
                  className="save-btn"
                  style={{ flex: 2 }}
                  onClick={handleConfirmSave}
                >
                  ✓ CONFIRM & SAVE
                </button>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="success-message">
              <div className="success-icon">🎉</div>
              <h3 className="success-title">Run Logged Successfully!</h3>
              <p className="success-text">
                Your run data has been extracted and saved.
              </p>
              <button className="log-another-btn" onClick={handleLogAnother}>
                Log Another Run
              </button>
            </div>
          )}
        </section>

        <footer>
          <p>
            Built with ❤️ for <strong>your</strong> running journey
          </p>
        </footer>
      </div>
    </>
  );
}
