'use client';

import { useState, useRef, useEffect } from 'react';

// Run data
const runData = [
  { date: '2026-01-08', distance: 5.01, time: '1:03:58', pace: '12:46', hr: 143, cadence: 136 },
  { date: '2026-01-06', distance: 3.50, time: '0:44:03', pace: '12:35', hr: 143, cadence: 136 },
  { date: '2026-01-03', distance: 5.01, time: '1:04:29', pace: '12:52', hr: 144, cadence: 135 },
  { date: '2026-01-01', distance: 3.10, time: '0:39:42', pace: '12:46', hr: 147, cadence: 134 },
  { date: '2025-12-30', distance: 3.01, time: '0:40:11', pace: '13:20', hr: 142, cadence: 131 },
  { date: '2025-12-24', distance: 2.02, time: '0:28:59', pace: '14:20', hr: 132, cadence: 122 },
  { date: '2025-12-20', distance: 6.01, time: '1:15:55', pace: '12:38', hr: 147, cadence: 136 },
  { date: '2025-12-18', distance: 4.00, time: '0:50:48', pace: '12:40', hr: 147, cadence: 134 },
  { date: '2025-12-16', distance: 3.50, time: '0:44:15', pace: '12:37', hr: 146, cadence: 132 },
  { date: '2025-12-13', distance: 5.01, time: '1:00:58', pace: '12:09', hr: 145, cadence: 135 },
  { date: '2025-12-11', distance: 3.11, time: '0:40:22', pace: '12:58', hr: 140, cadence: 130 },
  { date: '2025-12-09', distance: 3.10, time: '0:39:09', pace: '12:36', hr: 136, cadence: 130 },
  { date: '2025-12-06', distance: 5.02, time: '1:01:29', pace: '12:15', hr: 149, cadence: 133 },
  { date: '2025-11-30', distance: 10.01, time: '2:08:33', pace: '12:50', hr: 140, cadence: 131 },
  { date: '2025-11-28', distance: 3.13, time: '0:40:10', pace: '12:49', hr: 144, cadence: 131 },
  { date: '2025-11-27', distance: 3.17, time: '0:40:03', pace: '12:36', hr: 138, cadence: 134 },
  { date: '2025-11-25', distance: 3.44, time: '0:46:14', pace: '13:26', hr: 140, cadence: 126 },
  { date: '2025-11-22', distance: 8.01, time: '1:39:54', pace: '12:28', hr: 155, cadence: 133 },
  { date: '2025-11-19', distance: 3.47, time: '0:45:17', pace: '13:02', hr: 143, cadence: 131 },
  { date: '2025-11-15', distance: 7.02, time: '1:35:14', pace: '13:33', hr: 152, cadence: 125 },
  { date: '2025-11-12', distance: 5.08, time: '1:08:34', pace: '13:30', hr: 150, cadence: 126 },
  { date: '2025-11-10', distance: 3.11, time: '0:43:51', pace: '14:05', hr: 142, cadence: 122 },
  { date: '2025-11-08', distance: 5.01, time: '1:05:02', pace: '12:58', hr: 156, cadence: 125 },
  { date: '2025-11-06', distance: 3.11, time: '0:41:29', pace: '13:19', hr: 155, cadence: 124 }
];

const milestones = [
  { icon: '🎉', title: 'First 5K', desc: 'Ran your first 3.1 miles', date: 'Nov 6, 2025', achieved: true },
  { icon: '🔥', title: 'First 5 Miles', desc: 'Reached 5 mile distance', date: 'Nov 8, 2025', achieved: true },
  { icon: '⭐', title: 'First 10K', desc: 'Crushed 6.2 miles!', date: 'Nov 15, 2025', achieved: true },
  { icon: '🚀', title: '10 Mile Club', desc: 'Double digits — 10.01 mi', date: 'Nov 30, 2025', achieved: true },
  { icon: '💯', title: 'Century Club', desc: '100+ total miles logged', date: 'Jan 8, 2026', achieved: true },
  { icon: '📈', title: 'Pace Improver', desc: '30+ sec/mi faster', date: 'Jan 6, 2026', achieved: true },
  { icon: '🎯', title: '12 Mile Long Run', desc: 'Peak training distance', date: 'Week 9', achieved: false },
  { icon: '🏅', title: 'Half Marathon', desc: '13.1 miles — Race Day!', date: 'Mar 21, 2026', achieved: false },
];

const trainingPlan = [
  { week: 1, phase: 'Foundation', runs: ['3.5 Mi', '4.5 Mi', '5.0 Mi'], status: 'completed' },
  { week: 2, phase: 'Foundation', runs: ['3.5 Mi', '5.0 Mi', '6.0 Mi'], status: 'completed' },
  { week: 3, phase: 'Foundation', runs: ['3.5 Mi', '4.5 Mi', '8.0 Mi'], status: 'current' },
  { week: 4, phase: 'Foundation', runs: ['4.0 Mi', '5.5 Mi', '9.0 Mi'], status: 'upcoming' },
  { week: 5, phase: 'Strength', runs: ['4.5 Mi', '6.0 Mi', '10.0 Mi'], status: 'upcoming' },
  { week: 6, phase: 'Strength', runs: ['4.5 Mi', '6.5 Mi', '10.0 Mi'], status: 'upcoming' },
  { week: 7, phase: 'Strength', runs: ['5.0 Mi', '7.0 Mi', '11.0 Mi'], status: 'upcoming' },
  { week: 8, phase: 'Recovery', runs: ['5.0 Mi', '6.0 Mi', '8.0 Mi'], status: 'upcoming' },
  { week: 9, phase: 'Peak', runs: ['5.5 Mi', '7.5 Mi', '12.0 Mi'], status: 'upcoming' },
  { week: 10, phase: 'Taper', runs: ['5.0 Mi', '6.0 Mi', '10.0 Mi'], status: 'upcoming' },
  { week: 11, phase: 'Taper', runs: ['4.0 Mi', '5.0 Mi', '6.0 Mi'], status: 'upcoming' },
  { week: 12, phase: 'Race Week', runs: ['3.0 Mi', '2.0 Mi', '13.1 Mi'], status: 'upcoming' },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

  // Log run state
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [feelings, setFeelings] = useState({ energy: null, legs: null, breathing: null, mood: null });
  const [notes, setNotes] = useState('');
  const [logStatus, setLogStatus] = useState('form');
  const [extractedData, setExtractedData] = useState(null);
  const [error, setError] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const race = new Date('2026-03-21T07:00:00');
      const now = new Date();
      const diff = race - now;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setCountdown({ days, hours, minutes });
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  // Calculate stats
  const totalMiles = runData.reduce((sum, r) => sum + r.distance, 0).toFixed(1);
  const avgPace = '12:46';
  const avgHR = Math.round(runData.reduce((sum, r) => sum + r.hr, 0) / runData.length);
  const totalCalories = Math.round(runData.reduce((sum, r) => sum + r.distance * 100, 0)).toLocaleString();

  // Log run handlers
  const handleFiles = (newFiles) => {
    const imageFiles = Array.from(newFiles).filter((f) => f.type.startsWith('image/'));
    setFiles((prev) => [...prev, ...imageFiles]);
    imageFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews((prev) => [...prev, { name: file.name, url: e.target.result }]);
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
    setLogStatus('processing');
    setError(null);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));
      const response = await fetch('/api/extract', { method: 'POST', body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Extraction failed');
      setExtractedData(result.data);
      setLogStatus('confirmation');
    } catch (err) {
      setError(err.message);
      setLogStatus('form');
    }
  };

  const handleConfirmSave = () => setLogStatus('success');

  const handleLogAnother = () => {
    setFiles([]);
    setPreviews([]);
    setFeelings({ energy: null, legs: null, breathing: null, mood: null });
    setNotes('');
    setExtractedData(null);
    setError(null);
    setLogStatus('form');
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

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return { day: d.getDate().toString().padStart(2, '0'), month: d.toLocaleDateString('en-US', { month: 'short' }) };
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
              <div className="logo-text">RUN<span>COACH</span></div>
            </div>
            <nav>
              {['dashboard', 'logrun', 'training', 'insights', 'history'].map((tab) => (
                <button
                  key={tab}
                  className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'logrun' ? 'LOG RUN' : tab.toUpperCase()}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            {/* Race Hero */}
            <section className="race-hero">
              <div className="race-hero-inner">
                <div className="race-info">
                  <div className="race-label">YOUR NEXT RACE</div>
                  <h1 className="race-title">DC Half Marathon</h1>
                  <p className="race-meta">March 21, 2026 · <strong>Week 3 of 12</strong> · Foundation Phase</p>
                </div>
                <div className="countdown-container">
                  <div className="countdown">
                    <div className="countdown-block">
                      <div className="countdown-value">{countdown.days}</div>
                      <div className="countdown-label">DAYS</div>
                    </div>
                    <div className="countdown-block">
                      <div className="countdown-value">{countdown.hours.toString().padStart(2, '0')}</div>
                      <div className="countdown-label">HOURS</div>
                    </div>
                    <div className="countdown-block">
                      <div className="countdown-value">{countdown.minutes.toString().padStart(2, '0')}</div>
                      <div className="countdown-label">MIN</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Strip */}
            <div className="stats-strip">
              <div className="stat-block">
                <div className="stat-icon">🏃</div>
                <div className="stat-value">{totalMiles}</div>
                <div className="stat-label">Total Miles</div>
                <div className="stat-trend up">+16.6 this week</div>
              </div>
              <div className="stat-block">
                <div className="stat-icon">⚡</div>
                <div className="stat-value">{avgPace}</div>
                <div className="stat-label">Avg Pace</div>
                <div className="stat-trend up">33s faster</div>
              </div>
              <div className="stat-block">
                <div className="stat-icon">❤️</div>
                <div className="stat-value">{avgHR}</div>
                <div className="stat-label">Avg Heart Rate</div>
                <div className="stat-trend up">-6 bpm</div>
              </div>
              <div className="stat-block">
                <div className="stat-icon">🔥</div>
                <div className="stat-value">{totalCalories}</div>
                <div className="stat-label">Calories Burned</div>
                <div className="stat-trend up">+2,195</div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="main-grid">
              {/* Recent Runs */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <h2 className="card-title">Recent Runs</h2>
                    <p className="card-subtitle">Your last 5 workouts</p>
                  </div>
                </div>
                <div className="runs-list">
                  {runData.slice(0, 5).map((run, i) => {
                    const { day, month } = formatDate(run.date);
                    return (
                      <div key={i} className="run-item">
                        <div className="run-date">
                          <div className="run-date-day">{day}</div>
                          <div className="run-date-month">{month}</div>
                        </div>
                        <div className="run-details">
                          <div className="run-distance">{run.distance.toFixed(2)} miles</div>
                          <div className="run-meta">{run.time} · {run.hr} bpm</div>
                        </div>
                        <div className="run-pace">{run.pace}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Insights */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <h2 className="card-title">Quick Insights</h2>
                    <p className="card-subtitle">Your training at a glance</p>
                  </div>
                </div>
                <div className="insights-mini">
                  <div className="insight-mini positive">
                    <span className="insight-mini-icon">💪</span>
                    <div>
                      <strong>Aerobic Progress</strong>
                      <p>Heart rate dropped 6 bpm at same pace</p>
                    </div>
                  </div>
                  <div className="insight-mini warning">
                    <span className="insight-mini-icon">⚠️</span>
                    <div>
                      <strong>Recovery Watch</strong>
                      <p>HRV trending down — consider rest</p>
                    </div>
                  </div>
                  <div className="insight-mini info">
                    <span className="insight-mini-icon">🎯</span>
                    <div>
                      <strong>Race Projection</strong>
                      <p>On track for 2:48:00 finish</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Milestones */}
            <section className="milestones-section">
              <div className="section-header">
                <h2 className="section-title">Milestones</h2>
              </div>
              <div className="milestones-grid">
                {milestones.map((m, i) => (
                  <div key={i} className={`milestone ${m.achieved ? 'achieved' : ''}`}>
                    <span className="milestone-icon">{m.icon}</span>
                    <h3 className="milestone-title">{m.title}</h3>
                    <p className="milestone-desc">{m.desc}</p>
                    <p className="milestone-date">{m.date}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* LOG RUN TAB */}
        {activeTab === 'logrun' && (
          <section className="logrun-container">
            {logStatus === 'form' && (
              <div className="logrun-grid">
                <div className="upload-zone">
                  <h2 className="card-title" style={{ marginBottom: '8px' }}>Upload Run Screenshots</h2>
                  <p className="card-subtitle" style={{ marginBottom: '24px' }}>Drag & drop your Apple Watch workout screenshots</p>
                  <div
                    className={`upload-dropzone ${dragOver ? 'dragover' : ''} ${files.length > 0 ? 'has-files' : ''}`}
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    <span className="upload-icon">📸</span>
                    <h3 className="upload-title">Drop Screenshots Here</h3>
                    <p className="upload-subtitle">or click to browse your files</p>
                    <button className="upload-btn" type="button" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}>Select Files</button>
                    <input ref={fileInputRef} type="file" multiple accept="image/*" style={{ display: 'none' }} onChange={(e) => handleFiles(e.target.files)} />
                  </div>
                  {previews.length > 0 && (
                    <div className="preview-grid">
                      {previews.map((preview) => (
                        <div key={preview.name} className="preview-thumb">
                          <img src={preview.url} alt="Preview" />
                          <button className="remove-btn" onClick={() => removeFile(preview.name)}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                  {files.length > 0 && <p style={{ marginTop: '16px', fontSize: '14px', color: 'var(--stone)', textAlign: 'center' }}>📸 {files.length} screenshot(s) ready</p>}
                  {error && <div style={{ marginTop: '16px', padding: '16px', background: 'rgba(232, 93, 4, 0.1)', borderRadius: '10px', color: 'var(--burnt-orange)', fontSize: '14px' }}>⚠️ {error}</div>}
                </div>

                <div className="feelings-zone">
                  <h2 className="feelings-title">How Did You Feel?</h2>
                  <p className="feelings-subtitle">Quick check-in to track recovery</p>
                  {Object.entries(feelingOptions).map(([key, options]) => (
                    <div key={key} className="feeling-tracker">
                      <div className="feeling-label">{key === 'energy' ? '⚡' : key === 'legs' ? '🦵' : key === 'breathing' ? '💨' : '🧠'} {key.charAt(0).toUpperCase() + key.slice(1)}</div>
                      <div className="feeling-options">
                        {options.map((opt) => (
                          <div key={opt.value} className={`feeling-option ${feelings[key] === opt.value ? 'selected' : ''}`} onClick={() => setFeelings((f) => ({ ...f, [key]: opt.value }))}>
                            <span className="feeling-emoji">{opt.emoji}</span>
                            <span className="feeling-text">{opt.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="notes-section">
                    <div className="notes-label">📝 Notes (Optional)</div>
                    <textarea className="notes-textarea" placeholder="How did the run go?" value={notes} onChange={(e) => setNotes(e.target.value)} />
                  </div>
                  <div className="save-section">
                    <button className="save-btn" disabled={files.length === 0} onClick={handleUploadAndExtract}>📤 UPLOAD & EXTRACT</button>
                  </div>
                </div>
              </div>
            )}

            {logStatus === 'processing' && (
              <div className="card" style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', padding: '60px 40px' }}>
                <div className="processing-spinner"></div>
                <h3 className="card-title" style={{ marginTop: '24px' }}>Processing Screenshots...</h3>
                <p className="card-subtitle">Extracting run data from your images</p>
              </div>
            )}

            {logStatus === 'confirmation' && extractedData && (
              <div className="card" style={{ maxWidth: '700px', margin: '0 auto' }}>
                <div className="card-header">
                  <div>
                    <h2 className="card-title">✅ Data Extracted — Please Confirm</h2>
                    <p className="card-subtitle">Review the extracted data before saving</p>
                  </div>
                </div>
                <div className="extracted-data">
                  <div className="extracted-header"><span>📊</span> Run Data</div>
                  <div className="extracted-grid">
                    <div className="extracted-item"><div className="extracted-value">{extractedData.distance || '--'} mi</div><div className="extracted-label">Distance</div></div>
                    <div className="extracted-item"><div className="extracted-value">{extractedData.time || '--'}</div><div className="extracted-label">Time</div></div>
                    <div className="extracted-item"><div className="extracted-value">{extractedData.pace || '--'}/mi</div><div className="extracted-label">Avg Pace</div></div>
                    <div className="extracted-item"><div className="extracted-value">{extractedData.hr || '--'} bpm</div><div className="extracted-label">Avg HR</div></div>
                    <div className="extracted-item"><div className="extracted-value">{extractedData.cadence || '--'} spm</div><div className="extracted-label">Cadence</div></div>
                    <div className="extracted-item"><div className="extracted-value">{extractedData.calories || '--'} cal</div><div className="extracted-label">Calories</div></div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '16px', marginTop: '24px' }}>
                  <button className="log-another-btn" style={{ flex: 1, background: 'var(--stone-light)' }} onClick={() => setLogStatus('form')}>← Back</button>
                  <button className="save-btn" style={{ flex: 2 }} onClick={handleConfirmSave}>✓ CONFIRM & SAVE</button>
                </div>
              </div>
            )}

            {logStatus === 'success' && (
              <div className="success-message">
                <div className="success-icon">🎉</div>
                <h3 className="success-title">Run Logged Successfully!</h3>
                <p className="success-text">Your run data has been saved.</p>
                <button className="log-another-btn" onClick={handleLogAnother}>Log Another Run</button>
              </div>
            )}
          </section>
        )}

        {/* TRAINING PLAN TAB */}
        {activeTab === 'training' && (
          <section style={{ padding: '48px 0' }}>
            <div className="card" style={{ padding: '40px' }}>
              <div className="card-header">
                <div>
                  <h2 className="card-title">12-Week Half Marathon Plan</h2>
                  <p className="card-subtitle">DC Half Marathon · March 21, 2026</p>
                </div>
              </div>
              <div className="plan-grid">
                {trainingPlan.map((week) => (
                  <div key={week.week} className={`week-row ${week.status}`}>
                    <div>
                      <div className="week-num">WEEK {week.week}</div>
                      <div className="week-phase">{week.phase}</div>
                    </div>
                    <div className="week-runs">
                      {week.runs.map((run, i) => (
                        <span key={i} className={`run-tag ${i === 2 ? 'long' : ''} ${week.status === 'completed' ? 'completed' : ''}`}>
                          {run} {week.status === 'completed' ? '✓' : ''}
                        </span>
                      ))}
                    </div>
                    <div className="week-status">
                      {week.status === 'completed' ? '✅' : week.status === 'current' ? '🏃' : '⏳'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* INSIGHTS TAB */}
        {activeTab === 'insights' && (
          <section style={{ padding: '48px 0' }}>
            <div className="main-grid">
              <div className="card">
                <div className="card-header">
                  <div>
                    <h2 className="card-title">Heart Rate Zones</h2>
                    <p className="card-subtitle">Time distribution</p>
                  </div>
                </div>
                <div className="hr-zones">
                  {[
                    { label: 'Zone 1 (Easy)', pct: 15, color: '#95D5B2' },
                    { label: 'Zone 2 (Aerobic)', pct: 35, color: '#52B788' },
                    { label: 'Zone 3 (Tempo)', pct: 30, color: '#F4A261' },
                    { label: 'Zone 4 (Threshold)', pct: 15, color: '#E76F51' },
                    { label: 'Zone 5 (Max)', pct: 5, color: '#E63946' },
                  ].map((zone) => (
                    <div key={zone.label} className="hr-zone-row">
                      <div className="hr-zone-label">{zone.label}</div>
                      <div className="hr-zone-bar">
                        <div className="hr-zone-fill" style={{ width: `${zone.pct}%`, background: zone.color }}></div>
                      </div>
                      <div className="hr-zone-value">{zone.pct}%</div>
                    </div>
                  ))}
                </div>
                <div style={{ marginTop: '24px', padding: '20px', background: 'rgba(45,106,79,0.08)', borderRadius: '12px', borderLeft: '4px solid var(--forest)' }}>
                  <p style={{ fontSize: '14px', color: 'var(--charcoal)' }}><strong>💡 Coach Tip:</strong> For half marathon training, aim for 70-80% of runs in Zone 2.</p>
                </div>
              </div>

              <div className="card">
                <div className="card-header">
                  <div>
                    <h2 className="card-title">Training Insights</h2>
                    <p className="card-subtitle">Key observations</p>
                  </div>
                </div>
                <div className="insights-mini">
                  <div className="insight-mini positive">
                    <span className="insight-mini-icon">📊</span>
                    <div><strong>Cadence Growth</strong><p>Increased from 124 to 136 SPM</p></div>
                  </div>
                  <div className="insight-mini info">
                    <span className="insight-mini-icon">🌡️</span>
                    <div><strong>Indoor Focused</strong><p>96% indoor runs — try outdoor</p></div>
                  </div>
                  <div className="insight-mini positive">
                    <span className="insight-mini-icon">📈</span>
                    <div><strong>Long Run Progress</strong><p>Built from 5mi to 10mi successfully</p></div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          <section style={{ padding: '48px 0' }}>
            <div className="card" style={{ padding: '40px' }}>
              <div className="card-header">
                <div>
                  <h2 className="card-title">Complete Run History</h2>
                  <p className="card-subtitle">{runData.length} runs · Nov 2025 – Jan 2026</p>
                </div>
              </div>
              <div className="runs-list">
                {runData.map((run, i) => {
                  const { day, month } = formatDate(run.date);
                  return (
                    <div key={i} className="run-item">
                      <div className="run-date">
                        <div className="run-date-day">{day}</div>
                        <div className="run-date-month">{month}</div>
                      </div>
                      <div className="run-details">
                        <div className="run-distance">{run.distance.toFixed(2)} miles</div>
                        <div className="run-meta">{run.time} · {run.hr} bpm · {run.cadence} spm</div>
                      </div>
                      <div className="run-pace">{run.pace}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        <footer>
          <p>Built with ❤️ for <strong>Nemo&apos;s</strong> half marathon journey</p>
        </footer>
      </div>
    </>
  );
}
