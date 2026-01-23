'use client';
import { useState, useRef, useEffect } from 'react';

export default function RunCoach() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [extractedData, setExtractedData] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [feelings, setFeelings] = useState({ effort: null, energy: null, mood: null });
  const [notes, setNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef(null);

  // Race date: March 21, 2026
  const raceDate = new Date('2026-03-21T07:00:00');

  // Run data from your training
  const runData = [
    { date: '2025-11-06', distance: 3.02, duration: '0:45:29', pace: '15:04', hr: 156, calories: 470 },
    { date: '2025-11-08', distance: 5.04, duration: '1:15:30', pace: '14:59', hr: 154, calories: 775 },
    { date: '2025-11-11', distance: 2.50, duration: '0:35:45', pace: '14:18', hr: 148, calories: 380 },
    { date: '2025-11-13', distance: 4.02, duration: '0:58:52', pace: '14:39', hr: 150, calories: 615 },
    { date: '2025-11-15', distance: 6.21, duration: '1:32:18', pace: '14:51', hr: 152, calories: 955 },
    { date: '2025-11-17', distance: 3.00, duration: '0:42:30', pace: '14:10', hr: 146, calories: 455 },
    { date: '2025-11-20', distance: 4.51, duration: '1:02:23', pace: '13:50', hr: 148, calories: 690 },
    { date: '2025-11-22', distance: 5.01, duration: '1:08:38', pace: '13:42', hr: 147, calories: 765 },
    { date: '2025-11-25', distance: 3.52, duration: '0:47:32', pace: '13:30', hr: 145, calories: 535 },
    { date: '2025-11-27', distance: 4.00, duration: '0:53:20', pace: '13:20', hr: 146, calories: 610 },
    { date: '2025-11-30', distance: 10.01, duration: '2:16:14', pace: '13:37', hr: 149, calories: 1545 },
    { date: '2025-12-03', distance: 3.01, duration: '0:40:04', pace: '13:18', hr: 144, calories: 455 },
    { date: '2025-12-05', distance: 4.50, duration: '0:59:15', pace: '13:10', hr: 145, calories: 685 },
    { date: '2025-12-08', distance: 5.50, duration: '1:11:30', pace: '13:00', hr: 146, calories: 840 },
    { date: '2025-12-10', distance: 3.25, duration: '0:42:15', pace: '13:00', hr: 143, calories: 490 },
    { date: '2025-12-13', distance: 6.01, duration: '1:18:08', pace: '13:00', hr: 147, calories: 920 },
    { date: '2025-12-16', distance: 3.50, duration: '0:45:30', pace: '13:00', hr: 142, calories: 530 },
    { date: '2025-12-19', distance: 4.01, duration: '0:52:08', pace: '13:00', hr: 144, calories: 610 },
    { date: '2025-12-22', distance: 5.00, duration: '1:05:00', pace: '13:00', hr: 145, calories: 765 },
    { date: '2025-12-27', distance: 3.01, duration: '0:40:14', pace: '13:22', hr: 143, calories: 455 },
    { date: '2025-12-30', distance: 3.01, duration: '0:40:11', pace: '13:20', hr: 142, calories: 455 },
    { date: '2026-01-01', distance: 3.10, duration: '0:39:42', pace: '12:46', hr: 147, calories: 475 },
    { date: '2026-01-03', distance: 5.01, duration: '1:04:29', pace: '12:52', hr: 144, calories: 765 },
    { date: '2026-01-06', distance: 3.50, duration: '0:44:03', pace: '12:35', hr: 143, calories: 535 },
    { date: '2026-01-08', distance: 5.01, duration: '1:03:58', pace: '12:46', hr: 143, calories: 770 },
  ];

  // Milestones
  const milestones = [
    { icon: '🎉', title: 'First 5K', desc: 'Ran your first 3.1 miles', date: 'Nov 6, 2025', achieved: true },
    { icon: '🔥', title: 'First 5 Miles', desc: 'Reached 5 mile distance', date: 'Nov 8, 2025', achieved: true },
    { icon: '⭐', title: 'First 10K', desc: 'Crushed 6.2 miles!', date: 'Nov 15, 2025', achieved: true },
    { icon: '🚀', title: '10 Mile Club', desc: 'Double digits — 10.01 mi', date: 'Nov 30, 2025', achieved: true },
    { icon: '💯', title: 'Century Club', desc: '100+ total miles logged', date: 'Jan 8, 2026', achieved: true },
    { icon: '📈', title: 'Pace Improver', desc: '30+ sec/mi faster', date: 'Jan 6, 2026', achieved: true },
    { icon: '🎯', title: '12 Mile Long Run', desc: 'Peak training distance', date: null, achieved: false },
    { icon: '🏅', title: 'Half Marathoner', desc: 'Complete DC Half!', date: null, achieved: false },
  ];

  // Training plan
  const trainingPlan = [
    { week: 1, phase: 'Base', runs: ['3 mi', '4 mi', '5 mi'], status: 'completed' },
    { week: 2, phase: 'Base', runs: ['3 mi', '4 mi', '6 mi'], status: 'completed' },
    { week: 3, phase: 'Foundation', runs: ['3 mi', '5 mi', '10 mi'], status: 'completed' },
    { week: 4, phase: 'Foundation', runs: ['3 mi', '5 mi', '6 mi'], status: 'current' },
    { week: 5, phase: 'Build', runs: ['4 mi', '5 mi', '8 mi'], status: 'upcoming' },
    { week: 6, phase: 'Build', runs: ['4 mi', '6 mi', '9 mi'], status: 'upcoming' },
    { week: 7, phase: 'Build', runs: ['4 mi', '6 mi', '10 mi'], status: 'upcoming' },
    { week: 8, phase: 'Peak', runs: ['4 mi', '6 mi', '11 mi'], status: 'upcoming' },
    { week: 9, phase: 'Peak', runs: ['4 mi', '6 mi', '12 mi'], status: 'upcoming' },
    { week: 10, phase: 'Taper', runs: ['3 mi', '5 mi', '8 mi'], status: 'upcoming' },
    { week: 11, phase: 'Taper', runs: ['3 mi', '4 mi', '5 mi'], status: 'upcoming' },
    { week: 12, phase: 'Race Week', runs: ['2 mi', '3 mi', '13.1 mi'], status: 'upcoming' },
  ];

  // Calculate stats
  const totalMiles = runData.reduce((sum, r) => sum + r.distance, 0).toFixed(1);
  const totalCalories = runData.reduce((sum, r) => sum + r.calories, 0).toLocaleString();
  const avgHR = Math.round(runData.reduce((sum, r) => sum + r.hr, 0) / runData.length);

  // Calculate weekly mileage from actual run data
  const getWeeklyData = () => {
    const weeks = {};

    runData.forEach(run => {
      const date = new Date(run.date);
      // Get the Monday of that week
      const day = date.getDay();
      const diff = date.getDate() - day + (day === 0 ? -6 : 1);
      const monday = new Date(date.setDate(diff));
      const weekKey = monday.toISOString().split('T')[0];

      if (!weeks[weekKey]) {
        weeks[weekKey] = { total: 0, date: new Date(weekKey) };
      }
      weeks[weekKey].total += run.distance;
    });

    // Sort by date and format
    const sortedWeeks = Object.entries(weeks)
      .sort((a, b) => new Date(a[0]) - new Date(b[0]))
      .map(([key, data]) => {
        const date = new Date(key);
        const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
        const weekOfMonth = Math.ceil(date.getDate() / 7);
        return {
          label: `W${weekOfMonth} ${month}`,
          actual: Math.round(data.total * 10) / 10
        };
      });

    // Target mileage per week (progressive training plan)
    const targets = [12.5, 14, 15.5, 17, 18, 20, 22.5, 18, 24.5, 20, 16, 13.1];

    return sortedWeeks.map((week, i) => ({
      ...week,
      target: targets[i] || 20
    }));
  };

  const weeklyData = getWeeklyData();

  // Countdown timer
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = raceDate - now;
      if (diff > 0) {
        setCountdown({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        });
      }
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  // File handling
  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files]);
      extractDataFromImages(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setUploadedFiles(prev => [...prev, ...files]);
      extractDataFromImages(files);
    }
  };

  const extractDataFromImages = async (files) => {
    setIsExtracting(true);
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      const response = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setExtractedData(data.runData);
      }
    } catch (error) {
      console.error('Extraction error:', error);
    } finally {
      setIsExtracting(false);
    }
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    if (uploadedFiles.length <= 1) {
      setExtractedData(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaveSuccess(true);
    setIsSaving(false);
  };

  const resetLogRun = () => {
    setUploadedFiles([]);
    setExtractedData(null);
    setFeelings({ effort: null, energy: null, mood: null });
    setNotes('');
    setSaveSuccess(false);
  };

  // Format date
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleString('default', { month: 'short' })
    };
  };

  const recentRuns = [...runData].reverse().slice(0, 5);

  return (
    <>
      {/* Topographic Background */}
      <div className="topo-bg"></div>

      <div className="container">
        {/* Header */}
        <header className="animate-in">
          <div className="header-inner">
            <div className="logo">
              <div className="logo-mark">↗</div>
              <div className="logo-text">RUN<span>COACH</span></div>
            </div>
            <nav>
              {['dashboard', 'logrun', 'training', 'insights', 'history'].map(tab => (
                <button
                  key={tab}
                  className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'logrun' ? 'LOG RUN' : tab === 'training' ? 'TRAINING PLAN' : tab.toUpperCase()}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="tab-content active">
            {/* Race Hero */}
            <section className="race-hero animate-in delay-1">
              <div className="race-hero-inner">
                <div className="race-info">
                  <div className="race-label">YOUR NEXT RACE</div>
                  <h1 className="race-title">DC Half Marathon</h1>
                  <p className="race-meta">
                    March 21, 2026 · <strong>Week 3 of 12</strong> · Foundation Phase
                  </p>
                </div>
                <div className="countdown-container">
                  <div className="countdown">
                    <div className="countdown-block">
                      <div className="countdown-value">{countdown.days}</div>
                      <div className="countdown-label">DAYS</div>
                    </div>
                    <div className="countdown-block">
                      <div className="countdown-value">{countdown.hours}</div>
                      <div className="countdown-label">HOURS</div>
                    </div>
                    <div className="countdown-block">
                      <div className="countdown-value">{countdown.minutes}</div>
                      <div className="countdown-label">MIN</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Strip */}
            <div className="stats-strip animate-in delay-2">
              <div className="stat-block">
                <div className="stat-icon">🏃</div>
                <div className="stat-value">{totalMiles}</div>
                <div className="stat-label">Total Miles</div>
                <div className="stat-trend up">+16.6 this week</div>
              </div>
              <div className="stat-block">
                <div className="stat-icon">⚡</div>
                <div className="stat-value">12:46</div>
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
            <div className="main-grid animate-in delay-3">
              {/* Progress Chart Card */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <h2 className="card-title">Weekly Mileage</h2>
                    <p className="card-subtitle">Building toward 13.1 miles</p>
                  </div>
                  <div className="progress-ring-wrap">
                    <svg className="progress-ring" width="100" height="100">
                      <circle className="progress-ring-bg" cx="50" cy="50" r="42" />
                      <circle className="progress-ring-fill" cx="50" cy="50" r="42" style={{ strokeDashoffset: 264 - (264 * 0.25) }} />
                    </svg>
                    <div className="progress-ring-center">
                      <span className="progress-percent">25%</span>
                      <span className="progress-label">Complete</span>
                    </div>
                  </div>
                </div>
                <div className="chart-container">
                  {/* Legend */}
                  <div className="chart-legend">
                    <div className="legend-item">
                      <span className="legend-color actual"></span>
                      <span className="legend-text">ACTUAL</span>
                    </div>
                    <div className="legend-item">
                      <span className="legend-color target"></span>
                      <span className="legend-text">TARGET</span>
                    </div>
                  </div>

                  {/* Chart with Y-axis */}
                  <div className="chart-wrapper">
                    <div className="chart-y-axis">
                      <span>25</span>
                      <span>20</span>
                      <span>15</span>
                      <span>10</span>
                      <span>5</span>
                      <span>0</span>
                    </div>
                    <div className="chart-area">
                      {weeklyData.map((week, i) => (
                        <div key={i} className="chart-bar-group">
                          <div className="bar-pair">
                            <div className="chart-bar actual" style={{ height: `${(week.actual / 25) * 100}%` }}></div>
                            <div className="chart-bar target" style={{ height: `${(week.target / 25) * 100}%` }}></div>
                          </div>
                          <span className="chart-label">{week.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Runs */}
              <div className="card">
                <div className="card-header">
                  <div>
                    <h2 className="card-title">Recent Runs</h2>
                    <p className="card-subtitle">Your last 5 workouts</p>
                  </div>
                </div>
                <div className="runs-list">
                  {recentRuns.map((run, i) => {
                    const { day, month } = formatDate(run.date);
                    return (
                      <div key={i} className="run-item">
                        <div className="run-date">
                          <div className="run-date-day">{day}</div>
                          <div className="run-date-month">{month}</div>
                        </div>
                        <div className="run-details">
                          <div className="run-distance">{run.distance.toFixed(2)} miles</div>
                          <div className="run-meta">{run.duration} · {run.hr} bpm</div>
                        </div>
                        <div className="run-pace">{run.pace}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Milestones */}
            <section className="milestones-section animate-in delay-4">
              <div className="section-header">
                <h2 className="section-title">Milestones Achieved</h2>
              </div>
              <div className="milestones-grid">
                {milestones.map((m, i) => (
                  <div key={i} className={`milestone ${m.achieved ? 'achieved' : ''}`}>
                    <span className="milestone-icon">{m.icon}</span>
                    <h3 className="milestone-title">{m.title}</h3>
                    <p className="milestone-desc">{m.desc}</p>
                    {m.achieved && <p className="milestone-date">{m.date}</p>}
                  </div>
                ))}
              </div>
            </section>

            {/* Insights Grid */}
            <div className="insights-grid animate-in delay-5">
              <div className="insight-card positive">
                <div className="insight-icon">📈</div>
                <h3 className="insight-title">Pace Improving</h3>
                <p className="insight-text">Your average pace has improved by 2+ min/mi since you started. Fantastic aerobic development!</p>
              </div>
              <div className="insight-card warning">
                <div className="insight-icon">💤</div>
                <h3 className="insight-title">Recovery Reminder</h3>
                <p className="insight-text">After your 10-mile run, consider extra rest. Long runs need 48-72 hours recovery.</p>
              </div>
              <div className="insight-card info">
                <div className="insight-icon">🎯</div>
                <h3 className="insight-title">Race Prediction</h3>
                <p className="insight-text">Based on current pace, you're on track for a 2:45-2:55 half marathon finish. Keep it up!</p>
              </div>
            </div>
          </div>
        )}

        {/* Log Run Tab */}
        {activeTab === 'logrun' && (
          <div className="tab-content active">
            <div className="logrun-container">
              {!saveSuccess ? (
                <div className="logrun-grid">
                  {/* Upload Zone */}
                  <div className="upload-zone">
                    <div
                      className={`upload-dropzone ${uploadedFiles.length > 0 ? 'has-files' : ''}`}
                      onDrop={handleDrop}
                      onDragOver={(e) => e.preventDefault()}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {uploadedFiles.length === 0 ? (
                        <>
                          <span className="upload-icon">📸</span>
                          <h3 className="upload-title">Drop Screenshots Here</h3>
                          <p className="upload-subtitle">Upload Apple Watch workout screenshots</p>
                          <button className="upload-btn">SELECT FILES</button>
                        </>
                      ) : (
                        <div className="preview-grid">
                          {uploadedFiles.map((file, i) => (
                            <div key={i} className="preview-thumb">
                              <img src={URL.createObjectURL(file)} alt="" />
                              <button className="remove-btn" onClick={(e) => { e.stopPropagation(); removeFile(i); }}>×</button>
                            </div>
                          ))}
                        </div>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="upload-input"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                      />
                    </div>

                    {isExtracting && (
                      <div className="processing-state" style={{ textAlign: 'center', padding: '24px' }}>
                        <div className="processing-spinner"></div>
                        <p style={{ marginTop: '16px', color: 'var(--stone)' }}>Extracting run data...</p>
                      </div>
                    )}

                    {extractedData && !isExtracting && (
                      <div className="extracted-data visible">
                        <div className="extracted-header">✓ Data Extracted</div>
                        <div className="extracted-grid">
                          <div className="extracted-item">
                            <div className="extracted-value">{extractedData.distance || '--'}</div>
                            <div className="extracted-label">Distance</div>
                          </div>
                          <div className="extracted-item">
                            <div className="extracted-value">{extractedData.duration || '--'}</div>
                            <div className="extracted-label">Duration</div>
                          </div>
                          <div className="extracted-item">
                            <div className="extracted-value">{extractedData.pace || '--'}</div>
                            <div className="extracted-label">Pace</div>
                          </div>
                          <div className="extracted-item">
                            <div className="extracted-value">{extractedData.heartRate || '--'}</div>
                            <div className="extracted-label">Avg HR</div>
                          </div>
                          <div className="extracted-item">
                            <div className="extracted-value">{extractedData.calories || '--'}</div>
                            <div className="extracted-label">Calories</div>
                          </div>
                          <div className="extracted-item">
                            <div className="extracted-value">{extractedData.date || '--'}</div>
                            <div className="extracted-label">Date</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Feelings Zone */}
                  <div className="feelings-zone">
                    <h3 className="feelings-title">How Did It Feel?</h3>
                    <p className="feelings-subtitle">Track your subjective experience</p>

                    {/* Effort */}
                    <div className="feeling-tracker">
                      <div className="feeling-label">💪 EFFORT LEVEL</div>
                      <div className="feeling-options">
                        {[{ emoji: '😌', text: 'Easy' }, { emoji: '🙂', text: 'Moderate' }, { emoji: '😤', text: 'Hard' }, { emoji: '🥵', text: 'All Out' }].map((opt, i) => (
                          <div
                            key={i}
                            className={`feeling-option ${feelings.effort === i ? 'selected' : ''}`}
                            onClick={() => setFeelings(prev => ({ ...prev, effort: i }))}
                          >
                            <span className="feeling-emoji">{opt.emoji}</span>
                            <span className="feeling-text">{opt.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Energy */}
                    <div className="feeling-tracker">
                      <div className="feeling-label">⚡ ENERGY LEVEL</div>
                      <div className="feeling-options">
                        {[{ emoji: '😴', text: 'Tired' }, { emoji: '😐', text: 'Normal' }, { emoji: '💪', text: 'Strong' }, { emoji: '🚀', text: 'Amazing' }].map((opt, i) => (
                          <div
                            key={i}
                            className={`feeling-option ${feelings.energy === i ? 'selected' : ''}`}
                            onClick={() => setFeelings(prev => ({ ...prev, energy: i }))}
                          >
                            <span className="feeling-emoji">{opt.emoji}</span>
                            <span className="feeling-text">{opt.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Mood */}
                    <div className="feeling-tracker">
                      <div className="feeling-label">🧠 POST-RUN MOOD</div>
                      <div className="feeling-options">
                        {[{ emoji: '😞', text: 'Down' }, { emoji: '😐', text: 'Okay' }, { emoji: '😊', text: 'Good' }, { emoji: '🤩', text: 'Amazing' }].map((opt, i) => (
                          <div
                            key={i}
                            className={`feeling-option ${feelings.mood === i ? 'selected' : ''}`}
                            onClick={() => setFeelings(prev => ({ ...prev, mood: i }))}
                          >
                            <span className="feeling-emoji">{opt.emoji}</span>
                            <span className="feeling-text">{opt.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="notes-section">
                      <div className="notes-label">📝 NOTES</div>
                      <textarea
                        className="notes-textarea"
                        placeholder="How did this run feel? Any observations about weather, terrain, or how your body felt..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                    {/* Save Button */}
                    <div className="save-section">
                      <button
                        className={`save-btn ${isSaving ? 'loading' : ''}`}
                        onClick={handleSave}
                        disabled={!extractedData || isSaving}
                      >
                        <span className="spinner"></span>
                        <span className="btn-text">SAVE RUN</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="success-message visible">
                  <div className="success-icon">✅</div>
                  <h3 className="success-title">Run Logged Successfully!</h3>
                  <p className="success-text">Your run has been added to your training history.</p>
                  <button className="log-another-btn" onClick={resetLogRun}>LOG ANOTHER RUN</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Training Plan Tab */}
        {activeTab === 'training' && (
          <div className="tab-content active">
            <section className="race-hero animate-in">
              <div className="race-info">
                <div className="race-label">12-WEEK TRAINING PLAN</div>
                <h1 className="race-title">Half Marathon Build</h1>
                <p className="race-meta">Progressive mileage with peak at Week 9</p>
              </div>
            </section>

            <div className="plan-grid animate-in delay-1">
              {trainingPlan.map((week, i) => (
                <div key={i} className={`week-row ${week.status}`}>
                  <div>
                    <div className="week-num">WEEK {week.week}</div>
                    <div className="week-phase">{week.phase}</div>
                  </div>
                  <div className="week-runs">
                    {week.runs.map((run, j) => (
                      <span key={j} className={`run-tag ${j === week.runs.length - 1 ? 'long' : ''} ${week.status === 'completed' ? 'completed' : ''}`}>
                        {run}
                      </span>
                    ))}
                  </div>
                  <div className="week-status">
                    {week.status === 'completed' ? '✓' : week.status === 'current' ? '→' : '○'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="tab-content active">
            <section className="race-hero animate-in">
              <div className="race-info">
                <div className="race-label">TRAINING INSIGHTS</div>
                <h1 className="race-title">Your Progress</h1>
                <p className="race-meta">Data-driven analysis of your training</p>
              </div>
            </section>

            <div className="insights-grid animate-in delay-1">
              <div className="insight-card positive">
                <div className="insight-icon">📈</div>
                <h3 className="insight-title">Pace Improving</h3>
                <p className="insight-text">Your average pace has improved by 2+ min/mi since you started. Fantastic aerobic development!</p>
              </div>
              <div className="insight-card warning">
                <div className="insight-icon">💤</div>
                <h3 className="insight-title">Recovery Reminder</h3>
                <p className="insight-text">After your 10-mile run, consider extra rest. Long runs need 48-72 hours recovery.</p>
              </div>
              <div className="insight-card info">
                <div className="insight-icon">🎯</div>
                <h3 className="insight-title">Race Prediction</h3>
                <p className="insight-text">Based on current pace, you're on track for a 2:45-2:55 half marathon finish.</p>
              </div>
            </div>

            <div className="card animate-in delay-2" style={{ marginTop: '32px' }}>
              <div className="card-header">
                <div>
                  <h2 className="card-title">Heart Rate Zones</h2>
                  <p className="card-subtitle">Time spent in each zone</p>
                </div>
              </div>
              <div className="hr-zones">
                {[
                  { label: 'Zone 1 (Recovery)', pct: 15, color: 'zone1' },
                  { label: 'Zone 2 (Easy)', pct: 45, color: 'zone2' },
                  { label: 'Zone 3 (Tempo)', pct: 25, color: 'zone3' },
                  { label: 'Zone 4 (Threshold)', pct: 12, color: 'zone4' },
                  { label: 'Zone 5 (Max)', pct: 3, color: 'zone5' },
                ].map((zone, i) => (
                  <div key={i} className="hr-zone-row">
                    <div className="hr-zone-label">{zone.label}</div>
                    <div className="hr-zone-bar">
                      <div className={`hr-zone-fill ${zone.color}`} style={{ width: `${zone.pct}%` }}></div>
                    </div>
                    <div className="hr-zone-value">{zone.pct}%</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="tab-content active">
            <section className="race-hero animate-in">
              <div className="race-info">
                <div className="race-label">RUN HISTORY</div>
                <h1 className="race-title">All Your Runs</h1>
                <p className="race-meta">{runData.length} runs · {totalMiles} total miles</p>
              </div>
            </section>

            <div className="card animate-in delay-1">
              <div className="runs-list">
                {[...runData].reverse().map((run, i) => {
                  const { day, month } = formatDate(run.date);
                  return (
                    <div key={i} className="run-item">
                      <div className="run-date">
                        <div className="run-date-day">{day}</div>
                        <div className="run-date-month">{month}</div>
                      </div>
                      <div className="run-details">
                        <div className="run-distance">{run.distance.toFixed(2)} miles</div>
                        <div className="run-meta">{run.duration} · {run.hr} bpm · {run.calories} cal</div>
                      </div>
                      <div className="run-pace">{run.pace}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer>
          <p>Built with ❤️ for your <strong>DC Half Marathon</strong> journey</p>
        </footer>
      </div>
    </>
  );
}
