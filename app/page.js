'use client';
import { useState, useRef, useEffect } from 'react';

export default function RunCoach() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const [prevCountdown, setPrevCountdown] = useState({ days: 0, hours: 0, minutes: 0 });
  const [flipping, setFlipping] = useState({ days: [false, false], hours: [false, false], minutes: [false, false] });
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [extractedData, setExtractedData] = useState(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [feelings, setFeelings] = useState({ effort: null, energy: null, mood: null });
  const [notes, setNotes] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', insight: '' });
  const [showAddRaceModal, setShowAddRaceModal] = useState(false);
  const [newRace, setNewRace] = useState({ name: '', date: '', distance: '' });
  const [isAddingRace, setIsAddingRace] = useState(false);
  const [selectedRaceId, setSelectedRaceId] = useState('dc-half-2026');
  const [raceDetailId, setRaceDetailId] = useState(null);
  const [raceTips, setRaceTips] = useState({});
  const [isLoadingTips, setIsLoadingTips] = useState(false);
  const fileInputRef = useRef(null);

  // Races data
  const [races, setRaces] = useState([
    {
      id: 'dc-half-2026',
      name: 'DC Half Marathon',
      date: '2026-03-21',
      distance: 13.1,
      distanceLabel: 'Half Marathon',
      location: 'Washington, D.C.',
      status: 'upcoming', // upcoming, completed
      goalTime: '2:45:00',
      actualTime: null,
      description: 'The Credit Union Cherry Blossom Ten Mile Run & 5K celebrates spring in the nation\'s capital.',
      courseInfo: 'Flat, fast course through the National Mall and Tidal Basin',
      elevation: '150 ft gain',
      website: 'https://www.runrocknroll.com/dc',
      image: 'https://images.unsplash.com/photo-1617581629397-a72507c3de9e?w=800&q=80',
      trainingPlan: [
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
      ]
    }
  ]);

  // Get currently selected race
  const selectedRace = races.find(r => r.id === selectedRaceId) || races[0];
  const raceDate = selectedRace ? new Date(selectedRace.date + 'T07:00:00') : new Date();

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

  // Training plan from selected race
  const trainingPlan = selectedRace?.trainingPlan || [];

  // Calculate stats
  const totalMiles = runData.reduce((sum, r) => sum + r.distance, 0).toFixed(1);
  const totalCalories = runData.reduce((sum, r) => sum + r.calories, 0).toLocaleString();
  const avgHR = Math.round(runData.reduce((sum, r) => sum + r.hr, 0) / runData.length);

  // Weekly mileage data calculated from runs
  const weeklyData = [
    { label: 'W1 NOV', actual: 8.1, target: 12.5 },
    { label: 'W2 NOV', actual: 15.7, target: 14 },
    { label: 'W3 NOV', actual: 18.0, target: 15.5 },
    { label: 'W4 NOV', actual: 17.5, target: 17 },
    { label: 'W1 DEC', actual: 10.5, target: 18 },
    { label: 'W2 DEC', actual: 11.8, target: 20 },
    { label: 'W3 DEC', actual: 9.5, target: 22.5 },
    { label: 'W4 DEC', actual: 6.0, target: 18 },
    { label: 'W1 JAN', actual: 8.1, target: 24.5 },
    { label: 'W2 JAN', actual: 8.5, target: 20 },
  ];

  // Countdown timer with flip animation (updates every minute to save CPU)
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = raceDate - now;
      if (diff > 0) {
        const newCountdown = {
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        };

        // Check which digits changed and trigger flip animation
        if (!isInitialLoad) {
          const newFlipping = { days: [false, false], hours: [false, false], minutes: [false, false] };

          ['days', 'hours', 'minutes'].forEach(unit => {
            const oldStr = String(prevCountdown[unit]).padStart(2, '0');
            const newStr = String(newCountdown[unit]).padStart(2, '0');
            if (oldStr[0] !== newStr[0]) newFlipping[unit][0] = true;
            if (oldStr[1] !== newStr[1]) newFlipping[unit][1] = true;
          });

          setFlipping(newFlipping);

          // Reset flipping state after animation
          setTimeout(() => {
            setFlipping({ days: [false, false], hours: [false, false], minutes: [false, false] });
          }, 800);
        }

        setPrevCountdown(countdown);
        setCountdown(newCountdown);
      }
    };

    updateCountdown();
    // Update every minute instead of every second
    const interval = setInterval(updateCountdown, 60000);

    // End initial load animation after a delay
    if (isInitialLoad) {
      setTimeout(() => setIsInitialLoad(false), 2500);
    }

    return () => clearInterval(interval);
  }, [isInitialLoad, countdown, prevCountdown]);

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

      const result = await response.json();
      console.log('API response:', result);

      if (result.success && result.data) {
        // Map the API response to match our display format
        setExtractedData({
          distance: result.data.distance ? `${result.data.distance} mi` : null,
          duration: result.data.time || null,
          pace: result.data.pace ? `${result.data.pace}/mi` : null,
          heartRate: result.data.hr ? `${result.data.hr} bpm` : null,
          calories: result.data.calories || null,
          date: result.data.date || null,
        });
      } else {
        console.error('Extraction failed:', result.error || 'Unknown error');
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

  // Generate motivating insight based on the run data
  const generateInsight = () => {
    const insights = [];

    if (extractedData) {
      const distance = parseFloat(extractedData.distance);
      const pace = extractedData.pace;

      // Distance-based insights
      if (distance >= 10) {
        insights.push("Double digits! You're building serious endurance. 💪");
        insights.push("10+ miles in the bank! Your half marathon is going to feel amazing.");
      } else if (distance >= 6) {
        insights.push("Great long run! Every mile is making you stronger.");
        insights.push("Solid distance today. Your aerobic base is growing!");
      } else if (distance >= 4) {
        insights.push("Perfect training run. Consistency is your superpower!");
        insights.push("Another quality session logged. Keep stacking those miles!");
      } else {
        insights.push("Every mile counts! Recovery runs build champions.");
        insights.push("Nice easy run. These are the foundation of your training.");
      }

      // Pace insights
      if (pace) {
        const paceMin = parseInt(pace.split(':')[0]);
        if (paceMin <= 10) {
          insights.push("Speedy! You're flying out there! 🚀");
        } else if (paceMin <= 12) {
          insights.push("Strong pace! You're getting faster every week.");
        }
      }
    }

    // Feeling-based insights
    if (feelings.mood === 'great') {
      insights.push("Love that positive energy! Running is your happy place. 🌟");
    }
    if (feelings.energy === 'strong') {
      insights.push("Feeling strong is a sign your training is working!");
    }

    // Default insights
    if (insights.length === 0) {
      insights.push("Another run in the books! You're one step closer to race day.");
      insights.push("Consistency wins races. You showed up today!");
      insights.push("Your future self will thank you for this run.");
    }

    return insights[Math.floor(Math.random() * insights.length)];
  };

  // Play success sound using Web Audio API
  const playSuccessSound = () => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();

      // Create a pleasant "ding" sound with harmonics
      const playTone = (frequency, startTime, duration, gain) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';

        gainNode.gain.setValueAtTime(gain, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
      };

      const now = audioContext.currentTime;

      // Pleasant rising chord: C5, E5, G5 (major chord)
      playTone(523.25, now, 0.3, 0.15);        // C5
      playTone(659.25, now + 0.08, 0.3, 0.12); // E5
      playTone(783.99, now + 0.16, 0.4, 0.15); // G5
      playTone(1046.50, now + 0.24, 0.5, 0.1); // C6 (octave higher for sparkle)

    } catch (e) {
      // Audio not supported, fail silently
    }
  };

  // Show toast notification
  const showToast = (message, insight) => {
    setToast({ visible: true, message, insight });
    playSuccessSound();

    // Auto-hide after 5 seconds
    setTimeout(() => {
      setToast({ visible: false, message: '', insight: '' });
    }, 5000);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    const insight = generateInsight();
    showToast('Run logged successfully!', insight);

    // Reset the form after a brief delay
    setTimeout(() => {
      resetLogRun();
    }, 500);

    setIsSaving(false);
  };

  const resetLogRun = () => {
    setUploadedFiles([]);
    setExtractedData(null);
    setFeelings({ effort: null, energy: null, mood: null });
    setNotes('');
    setSaveSuccess(false);
  };

  // Handle adding a new race
  const handleAddRace = async () => {
    if (!newRace.name || !newRace.date || !newRace.distance) return;

    setIsAddingRace(true);

    try {
      // Call API to get race details and generate training plan
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          raceName: newRace.name,
          raceDate: newRace.date,
          distance: newRace.distance,
          runHistory: runData
        })
      });

      const result = await response.json();

      if (result.success) {
        const distanceMap = {
          '5k': { miles: 3.1, label: '5K' },
          '10k': { miles: 6.2, label: '10K' },
          'half': { miles: 13.1, label: 'Half Marathon' },
          'marathon': { miles: 26.2, label: 'Marathon' },
          'other': { miles: 0, label: 'Custom' }
        };

        const newRaceEntry = {
          id: `race-${Date.now()}`,
          name: result.raceInfo?.name || newRace.name,
          date: newRace.date,
          distance: distanceMap[newRace.distance]?.miles || 0,
          distanceLabel: distanceMap[newRace.distance]?.label || newRace.distance,
          location: result.raceInfo?.location || 'TBD',
          status: 'upcoming',
          goalTime: result.raceInfo?.goalTime || null,
          actualTime: null,
          description: result.raceInfo?.description || '',
          courseInfo: result.raceInfo?.courseInfo || '',
          elevation: result.raceInfo?.elevation || '',
          website: result.raceInfo?.website || '',
          image: result.raceInfo?.image || null,
          trainingPlan: result.trainingPlan || []
        };

        setRaces(prev => [...prev, newRaceEntry]);
        setSelectedRaceId(newRaceEntry.id);
        setShowAddRaceModal(false);
        setNewRace({ name: '', date: '', distance: '' });

        showToast('Race added!', `Your ${newRaceEntry.distanceLabel} training plan is ready.`);
        setActiveTab('training');
      }
    } catch (error) {
      console.error('Error adding race:', error);
      showToast('Error', 'Could not create training plan. Please try again.');
    } finally {
      setIsAddingRace(false);
    }
  };

  // Toggle active training plan
  const toggleActivePlan = (raceId, e) => {
    e.stopPropagation();
    if (selectedRaceId === raceId) {
      setSelectedRaceId(null); // Turn off
    } else {
      setSelectedRaceId(raceId); // Turn on
    }
  };

  // Open race detail view
  const openRaceDetail = async (race) => {
    setRaceDetailId(race.id);

    // Load tips if not already loaded
    if (!raceTips[race.id]) {
      setIsLoadingTips(true);
      try {
        const response = await fetch('/api/race-tips', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            raceName: race.name,
            location: race.location,
            distance: race.distanceLabel,
            courseInfo: race.courseInfo
          })
        });
        const result = await response.json();
        if (result.success) {
          setRaceTips(prev => ({ ...prev, [race.id]: result.tips }));
        }
      } catch (error) {
        console.error('Error loading race tips:', error);
      } finally {
        setIsLoadingTips(false);
      }
    }
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
  const detailRace = races.find(r => r.id === raceDetailId);

  return (
    <>
      {/* Topographic Background */}
      <div className="topo-bg"></div>

      {/* Hamburger Menu Button - Outside container for proper z-index */}
      <button
        className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Navigation Overlay */}
      <div className={`mobile-nav-overlay ${mobileMenuOpen ? 'open' : ''}`}>
        <nav className="mobile-nav">
          {['dashboard', 'races', 'training', 'logrun', 'history'].map((tab, index) => (
            <button
              key={tab}
              className={`mobile-nav-link ${activeTab === tab ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {tab === 'logrun' ? 'LOG RUN' : tab === 'races' ? 'MY RACES' : tab === 'training' ? 'TRAINING' : tab.toUpperCase()}
            </button>
          ))}
        </nav>
      </div>

      <div className="container">
        {/* Header */}
        <header className="animate-in">
          <div className="header-inner">
            <div className="logo">
              <div className="logo-text">RUN<span className="logo-dash"></span>COACH</div>
            </div>
            {/* Desktop Navigation */}
            <nav className="desktop-nav">
              {['dashboard', 'races', 'training', 'logrun', 'history'].map(tab => (
                <button
                  key={tab}
                  className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === 'logrun' ? 'LOG RUN' : tab === 'races' ? 'MY RACES' : tab === 'training' ? 'TRAINING' : tab.toUpperCase()}
                </button>
              ))}
            </nav>
            {/* Hamburger placeholder for layout */}
            <div className="hamburger-placeholder"></div>
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
                      <div className="flip-clock">
                        {String(countdown.days).padStart(2, '0').split('').map((digit, i) => {
                          const prevDigit = String(prevCountdown.days).padStart(2, '0')[i];
                          return (
                            <div
                              key={`days-${i}`}
                              className={`flip-card ${isInitialLoad ? 'initial' : ''} ${flipping.days[i] ? 'flipping' : ''}`}
                              style={{ animationDelay: isInitialLoad ? `${i * 0.12}s` : '0s' }}
                            >
                              <div className="flip-card-inner">
                                <div className="card-top">
                                  <span>{digit}</span>
                                </div>
                                <div className="card-bottom">
                                  <span>{digit}</span>
                                </div>
                                <div className="card-flip-top">
                                  <span>{prevDigit}</span>
                                </div>
                                <div className="card-flip-bottom">
                                  <span>{digit}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="countdown-label">DAYS</div>
                    </div>
                    <div className="countdown-block">
                      <div className="flip-clock">
                        {String(countdown.hours).padStart(2, '0').split('').map((digit, i) => {
                          const prevDigit = String(prevCountdown.hours).padStart(2, '0')[i];
                          return (
                            <div
                              key={`hours-${i}`}
                              className={`flip-card ${isInitialLoad ? 'initial' : ''} ${flipping.hours[i] ? 'flipping' : ''}`}
                              style={{ animationDelay: isInitialLoad ? `${0.24 + i * 0.12}s` : '0s' }}
                            >
                              <div className="flip-card-inner">
                                <div className="card-top">
                                  <span>{digit}</span>
                                </div>
                                <div className="card-bottom">
                                  <span>{digit}</span>
                                </div>
                                <div className="card-flip-top">
                                  <span>{prevDigit}</span>
                                </div>
                                <div className="card-flip-bottom">
                                  <span>{digit}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      <div className="countdown-label">HOURS</div>
                    </div>
                    <div className="countdown-block">
                      <div className="flip-clock">
                        {String(countdown.minutes).padStart(2, '0').split('').map((digit, i) => {
                          const prevDigit = String(prevCountdown.minutes).padStart(2, '0')[i];
                          return (
                            <div
                              key={`mins-${i}`}
                              className={`flip-card ${isInitialLoad ? 'initial' : ''} ${flipping.minutes[i] ? 'flipping' : ''}`}
                              style={{ animationDelay: isInitialLoad ? `${0.48 + i * 0.12}s` : '0s' }}
                            >
                              <div className="flip-card-inner">
                                <div className="card-top">
                                  <span>{digit}</span>
                                </div>
                                <div className="card-bottom">
                                  <span>{digit}</span>
                                </div>
                                <div className="card-flip-top">
                                  <span>{prevDigit}</span>
                                </div>
                                <div className="card-flip-bottom">
                                  <span>{digit}</span>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
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

            {/* Insights */}
            <section className="insights-section animate-in delay-5">
              <div className="section-header">
                <h2 className="section-title">Training Insights</h2>
              </div>
              <div className="insights-grid">
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
            </section>
          </div>
        )}

        {/* Log Run Tab */}
        {activeTab === 'logrun' && (
          <div className="tab-content active">
            <section className="race-hero animate-in">
              <div className="race-info">
                <div className="race-label">CAPTURE YOUR WORKOUT</div>
                <h1 className="race-title">Log Run</h1>
                <p className="race-meta">Upload your Apple Watch screenshots to automatically extract run data</p>
              </div>
            </section>

            <div className="logrun-container animate-in delay-1">
                <div className="logrun-grid">
                  {/* Upload Zone */}
                  <div className="upload-zone">
                    <h3 className="zone-title">Upload Your Files</h3>
                    <p className="zone-subtitle">Drag and drop or click to select</p>
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
                              <span className="success-badge">✓</span>
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
                      <div className="processing-state">
                        <div className="processing-spinner"></div>
                        <p>Extracting run data...</p>
                      </div>
                    )}

                    {extractedData && !isExtracting && (
                      <div className="extracted-data visible">
                        <h3 className="zone-title">Extracted Data</h3>
                        <p className="zone-subtitle">Review your workout details</p>
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
            </div>
          </div>
        )}

        {/* My Races Tab */}
        {activeTab === 'races' && (
          <div className="tab-content active">
            <section className="race-hero animate-in">
              <div className="race-info">
                <div className="race-label">YOUR RUNNING JOURNEY</div>
                <h1 className="race-title">My Races</h1>
                <p className="race-meta">{races.filter(r => r.status === 'completed').length} completed · {races.filter(r => r.status === 'upcoming').length} upcoming</p>
              </div>
            </section>

            <div className="races-container animate-in delay-1">
              {/* Upcoming Races */}
              {races.filter(r => r.status === 'upcoming').length > 0 && (
                <div className="races-section">
                  <h2 className="races-section-title">🎯 Upcoming Races</h2>
                  <div className="races-grid">
                    {races.filter(r => r.status === 'upcoming').map(race => {
                      const daysUntil = Math.ceil((new Date(race.date) - new Date()) / (1000 * 60 * 60 * 24));
                      return (
                        <div
                          key={race.id}
                          className={`race-card has-image ${selectedRaceId === race.id ? 'selected' : ''}`}
                          onClick={() => openRaceDetail(race)}
                        >
                          {race.image && (
                            <div className="race-card-image">
                              <img src={race.image} alt={race.name} />
                              <div className="race-card-image-overlay"></div>
                            </div>
                          )}
                          <div className="race-card-content">
                            <div className="race-card-header">
                              <span className="race-card-distance">{race.distanceLabel}</span>
                              <span className="race-card-countdown">{daysUntil} days</span>
                            </div>
                            <h3 className="race-card-name">{race.name}</h3>
                            <div className="race-card-details">
                              <span className="race-card-date">📅 {new Date(race.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                              <span className="race-card-location">📍 {race.location}</span>
                              {selectedRaceId === race.id && (
                                <span className="race-card-active-badge">✅ Active</span>
                              )}
                            </div>
                            {race.goalTime && (
                              <div className="race-card-goal">
                                <span className="goal-label">Goal Time</span>
                                <span className="goal-time">{race.goalTime}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Completed Races */}
              {races.filter(r => r.status === 'completed').length > 0 && (
                <div className="races-section">
                  <h2 className="races-section-title">🏅 Completed Races</h2>
                  <div className="races-grid">
                    {races.filter(r => r.status === 'completed').map(race => (
                      <div key={race.id} className={`race-card completed ${race.image ? 'has-image' : ''}`}>
                        {race.image && (
                          <div className="race-card-image">
                            <img src={race.image} alt={race.name} />
                            <div className="race-card-image-overlay"></div>
                          </div>
                        )}
                        <div className="race-card-content">
                          <div className="race-card-header">
                            <span className="race-card-distance">{race.distanceLabel}</span>
                            <span className="race-card-finish">✓ Finished</span>
                          </div>
                          <h3 className="race-card-name">{race.name}</h3>
                          <div className="race-card-details">
                            <span className="race-card-date">📅 {new Date(race.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                            <span className="race-card-location">📍 {race.location}</span>
                          </div>
                          {race.actualTime && (
                            <div className="race-card-result">
                              <span className="result-label">Finish Time</span>
                              <span className="result-time">{race.actualTime}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Add Race Button */}
              <button className="add-race-btn" onClick={() => setShowAddRaceModal(true)}>
                <span className="add-race-icon">+</span>
                <span className="add-race-text">Add New Race</span>
              </button>
            </div>
          </div>
        )}

        {/* Add Race Modal */}
        {showAddRaceModal && (
          <div className="modal-overlay" onClick={() => setShowAddRaceModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setShowAddRaceModal(false)}>×</button>
              <h2 className="modal-title">Add New Race</h2>
              <p className="modal-subtitle">Enter the basics and we'll find the rest</p>

              <div className="modal-form">
                <div className="form-group">
                  <label className="form-label">Race Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g., Boston Marathon, NYC Half"
                    value={newRace.name}
                    onChange={e => setNewRace({...newRace, name: e.target.value})}
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Race Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={newRace.date}
                      onChange={e => setNewRace({...newRace, date: e.target.value})}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Distance</label>
                    <select
                      className="form-input"
                      value={newRace.distance}
                      onChange={e => setNewRace({...newRace, distance: e.target.value})}
                    >
                      <option value="">Select distance</option>
                      <option value="5k">5K (3.1 mi)</option>
                      <option value="10k">10K (6.2 mi)</option>
                      <option value="half">Half Marathon (13.1 mi)</option>
                      <option value="marathon">Marathon (26.2 mi)</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <button
                  className={`modal-submit ${isAddingRace ? 'loading' : ''}`}
                  onClick={handleAddRace}
                  disabled={!newRace.name || !newRace.date || !newRace.distance || isAddingRace}
                >
                  <span className="spinner"></span>
                  <span className="btn-text">{isAddingRace ? 'Creating Plan...' : 'Add Race & Generate Plan'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Race Detail Sheet */}
        {raceDetailId && detailRace && (
          <div className="race-detail-overlay" onClick={() => setRaceDetailId(null)}>
            <div className="race-detail-sheet" onClick={(e) => e.stopPropagation()}>
              <div className="sheet-handle" onClick={() => setRaceDetailId(null)}></div>
              <button className="sheet-close" onClick={() => setRaceDetailId(null)}>×</button>

              {detailRace.image && (
                <div className="sheet-hero">
                  <img src={detailRace.image} alt={detailRace.name} />
                  <div className="sheet-hero-overlay"></div>
                  <div className="sheet-hero-content">
                    <span className="sheet-distance">{detailRace.distanceLabel}</span>
                    <h2 className="sheet-title">{detailRace.name}</h2>
                  </div>
                </div>
              )}

              <div className="sheet-content">
                {/* Status Toggle - at top of sheet */}
                <div className="sheet-status-toggle">
                  <span className="status-label">STATUS</span>
                  <button
                    className={`toggle-switch large ${selectedRaceId === detailRace.id ? 'on' : ''}`}
                    onClick={(e) => toggleActivePlan(detailRace.id, e)}
                  >
                    <span className="toggle-text on-text">ACTIVE</span>
                    <span className="toggle-text off-text">INACTIVE</span>
                    <span className="toggle-knob"><span></span></span>
                  </button>
                </div>

                <div className="sheet-info-grid">
                  <div className="sheet-info-item">
                    <span className="info-icon">📅</span>
                    <div>
                      <span className="info-label">Date</span>
                      <span className="info-value">{new Date(detailRace.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>
                  <div className="sheet-info-item">
                    <span className="info-icon">📍</span>
                    <div>
                      <span className="info-label">Location</span>
                      <span className="info-value">{detailRace.location}</span>
                    </div>
                  </div>
                  {detailRace.elevation && (
                    <div className="sheet-info-item">
                      <span className="info-icon">⛰️</span>
                      <div>
                        <span className="info-label">Elevation</span>
                        <span className="info-value">{detailRace.elevation}</span>
                      </div>
                    </div>
                  )}
                  {detailRace.goalTime && (
                    <div className="sheet-info-item">
                      <span className="info-icon">🎯</span>
                      <div>
                        <span className="info-label">Goal Time</span>
                        <span className="info-value">{detailRace.goalTime}</span>
                      </div>
                    </div>
                  )}
                </div>

                {detailRace.description && (
                  <div className="sheet-section">
                    <h3 className="sheet-section-title">About the Race</h3>
                    <p className="sheet-description">{detailRace.description}</p>
                  </div>
                )}

                {detailRace.courseInfo && (
                  <div className="sheet-section">
                    <h3 className="sheet-section-title">Course Info</h3>
                    <p className="sheet-description">{detailRace.courseInfo}</p>
                  </div>
                )}

                <div className="sheet-section">
                  <h3 className="sheet-section-title">💡 Tips from Past Runners</h3>
                  {isLoadingTips ? (
                    <div className="tips-loading">
                      <div className="tips-spinner"></div>
                      <span>Loading insider tips...</span>
                    </div>
                  ) : raceTips[detailRace.id] ? (
                    <div className="tips-list">
                      {raceTips[detailRace.id].map((tip, i) => (
                        <div key={i} className="tip-item">
                          <span className="tip-number">{i + 1}</span>
                          <p className="tip-text">{tip}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="sheet-description">Tips could not be loaded.</p>
                  )}
                </div>

                {detailRace.website && (
                  <a href={detailRace.website} target="_blank" rel="noopener noreferrer" className="sheet-link">
                    Visit Official Website →
                  </a>
                )}

              </div>
            </div>
          </div>
        )}

        {/* Training Plan Tab */}
        {activeTab === 'training' && (
          <div className="tab-content active">
            <section className="race-hero animate-in">
              <div className="race-info">
                <div className="race-label">12-WEEK TRAINING PLAN</div>
                <h1 className="race-title">{selectedRace?.name || 'Half Marathon Build'}</h1>
                <p className="race-meta">Progressive mileage with peak at Week 9</p>
              </div>
            </section>

            {/* Calendar View - Organized by Month */}
            <div className="cal-months animate-in delay-1">
              {(() => {
                // Build all calendar days
                const raceDay = new Date(selectedRace?.date || '2026-03-15');
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                const allDays = [];

                trainingPlan.forEach((week) => {
                  const weeksBeforeRace = trainingPlan.length - week.week;
                  const weekStartDate = new Date(raceDay);
                  weekStartDate.setDate(raceDay.getDate() - (weeksBeforeRace * 7) - raceDay.getDay());

                  const runDays = [2, 4, 6]; // Tue, Thu, Sat
                  const strengthDays = [1, 3]; // Mon, Wed
                  const restDays = [0, 5]; // Sun, Fri

                  for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
                    const cellDate = new Date(weekStartDate);
                    cellDate.setDate(weekStartDate.getDate() + dayOffset);

                    const cellDateClean = new Date(cellDate);
                    cellDateClean.setHours(0, 0, 0, 0);

                    const runIndex = runDays.indexOf(dayOffset);
                    const hasRun = runIndex !== -1 && week.runs[runIndex];
                    const runDistance = hasRun ? week.runs[runIndex] : null;
                    const isStrengthDay = strengthDays.includes(dayOffset);
                    const isRestDay = restDays.includes(dayOffset);

                    // Determine run type
                    let runType = null;
                    if (runDistance) {
                      const miles = parseFloat(runDistance);
                      if (miles <= 4) runType = 'short';
                      else if (miles <= 7) runType = 'medium';
                      else runType = 'long';
                    }

                    const dateStr = cellDate.toISOString().split('T')[0];
                    const actualRun = runData.find(r => r.date === dateStr);
                    const isPast = cellDateClean < today;

                    allDays.push({
                      date: cellDate,
                      dayOfWeek: dayOffset,
                      week,
                      hasRun,
                      runDistance,
                      runType,
                      actualRun,
                      isStrengthDay,
                      isRestDay,
                      isPast,
                      isRaceDay: cellDate.toDateString() === raceDay.toDateString(),
                      isToday: cellDate.toDateString() === today.toDateString()
                    });
                  }
                });

                // Group by month
                const monthGroups = {};
                allDays.forEach(day => {
                  const monthKey = `${day.date.getFullYear()}-${day.date.getMonth()}`;
                  const monthName = day.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
                  if (!monthGroups[monthKey]) {
                    monthGroups[monthKey] = { name: monthName, days: [] };
                  }
                  monthGroups[monthKey].days.push(day);
                });

                // Check if month is complete
                Object.values(monthGroups).forEach(month => {
                  month.isComplete = month.days.every(day => day.isPast);
                });

                return Object.entries(monthGroups).map(([monthKey, month]) => (
                  <div key={monthKey} className="cal-month-section">
                    <div className="cal-month-header">
                      <h3>{month.name} {month.isComplete && <span className="cal-month-complete">🎉 Complete</span>}</h3>
                    </div>

                    <div className="cal-day-labels">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                        <span key={d} className="cal-day-label">{d}</span>
                      ))}
                    </div>

                    <div className="cal-grid">
                      {/* Empty cells for alignment */}
                      {month.days[0] && Array(month.days[0].dayOfWeek).fill(null).map((_, i) => (
                        <div key={`empty-${i}`} className="cal-day cal-day-empty"></div>
                      ))}

                      {month.days.map((day, i) => (
                        <div
                          key={i}
                          className={`cal-day ${day.isPast ? 'cal-day-past' : ''} ${day.isToday ? 'cal-day-today' : ''} ${day.isRaceDay ? 'cal-day-race' : ''} ${day.hasRun ? `cal-day-run cal-day-${day.runType}` : ''} ${day.isStrengthDay ? 'cal-day-strength' : ''} ${day.isRestDay ? 'cal-day-rest' : ''}`}
                        >
                          {/* Top: date + label */}
                          <div className="cal-day-top">
                            <span className="cal-day-num">{day.date.getDate()}</span>
                            <span className="cal-day-type">
                              {day.isRaceDay ? 'Race' : day.hasRun ? (day.runType === 'short' ? 'Easy' : day.runType === 'medium' ? 'Tempo' : 'Long') : day.isStrengthDay ? 'Strength' : 'Rest'}
                            </span>
                          </div>

                          {/* Center: emoji */}
                          <div className="cal-day-center">
                            <span className="cal-day-emoji">
                              {day.isRaceDay ? '🏁' : day.hasRun ? '🏃' : day.isStrengthDay ? '🏋️' : '😴'}
                            </span>
                          </div>

                          {/* Bottom: distance + duration */}
                          <div className="cal-day-bottom">
                            {day.isRaceDay ? (
                              <span className="cal-day-distance">{selectedRace?.distanceLabel}</span>
                            ) : day.hasRun ? (
                              <>
                                <span className="cal-day-distance">{day.actualRun ? `${day.actualRun.distance} mi` : day.runDistance}</span>
                                {day.actualRun && <span className="cal-day-duration">{day.actualRun.duration}</span>}
                              </>
                            ) : null}
                          </div>

                          {day.isToday && <div className="cal-today-badge">TODAY</div>}
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>

            {/* Legend */}
            <div className="cal-legend animate-in delay-2">
              <div className="cal-legend-item"><span className="cal-legend-dot cal-legend-short"></span><span>Easy (≤4 mi)</span></div>
              <div className="cal-legend-item"><span className="cal-legend-dot cal-legend-medium"></span><span>Tempo (5-7 mi)</span></div>
              <div className="cal-legend-item"><span className="cal-legend-dot cal-legend-long"></span><span>Long (8+ mi)</span></div>
              <div className="cal-legend-item"><span className="cal-legend-dot cal-legend-strength"></span><span>Strength</span></div>
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

      {/* Toast Notification */}
      <div className={`toast ${toast.visible ? 'visible' : ''}`}>
        <div className="toast-icon">🎉</div>
        <div className="toast-content">
          <div className="toast-title">{toast.message}</div>
          <div className="toast-insight">{toast.insight}</div>
        </div>
        <button className="toast-close" onClick={() => setToast({ visible: false, message: '', insight: '' })}>×</button>
      </div>

          </>
  );
}
