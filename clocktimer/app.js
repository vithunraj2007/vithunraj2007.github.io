/**
 * CLOCKTIMER — ULTIMATE PRODUCTIVITY UPGRADE
 * Core Application Engine v2.0
 * Modules: Planner, Subjects, Timer, Focus Mode, Distraction Tracker,
 * Break Assistant, Gamification, Analytics, AI Assistant, Recommendations, Themes & Data Safety.
 */

(function () {
  'use strict';

  // --- 1. DEFAULT DATA SCHEMA (VERSION 2.0) ---
  const STORAGE_KEY = 'CLOCKTIMER_V2_DATA';
  const GEMINI_KEY_STORAGE = 'CLOCKTIMER_GEMINI_KEY';

  const defaultData = {
    version: '2.0.0',
    profile: {
      name: 'Scholar',
      avatar: 'graduation-cap',
      xp: 0,
      level: 1,
      streak: 0,
      lastStudyDate: null,
      personalRecords: {
        longestSessionSec: 0,
        mostProductiveDayDate: null,
        mostProductiveDayMin: 0,
        totalStudySec: 0
      }
    },
    settings: {
      theme: 'dark', // dark, light, cyberpunk, forest, midnight
      accent: 'indigo', // indigo, emerald, violet, rose, amber, cyan
      clockFormat: '12h', // 12h, 24h
      showSeconds: true,
      showMillis: false,
      timerSound: 'bell',
      autoBreak: true,
      breakIntervalMin: 25,
      breakDurationMin: 5,
      reducedMotion: false,
      highContrast: false,
      purposeVisible: true,
      widgets: {
        clock: true,
        timer: true,
        recommendation: true,
        streak: true,
        quickSound: true,
        upcomingExams: true,
        dailyGoal: true
      }
    },
    subjects: [
      {
        id: 'sub_1',
        name: 'Mathematics & Calculus',
        code: 'MATH101',
        color: '#6366f1',
        targetHours: 40,
        totalStudiedSec: 5400,
        chapters: [
          { id: 'ch_1_1', title: 'Limits & Continuity', status: 'completed' },
          { id: 'ch_1_2', title: 'Derivatives & Applications', status: 'in_progress' },
          { id: 'ch_1_3', title: 'Integration Techniques', status: 'not_started' },
          { id: 'ch_1_4', title: 'Differential Equations', status: 'not_started' }
        ]
      },
      {
        id: 'sub_2',
        name: 'Physics & Thermodynamics',
        code: 'PHYS201',
        color: '#06b6d4',
        targetHours: 35,
        totalStudiedSec: 3600,
        chapters: [
          { id: 'ch_2_1', title: 'Kinematics & Newton Laws', status: 'completed' },
          { id: 'ch_2_2', title: 'Work, Energy & Power', status: 'completed' },
          { id: 'ch_2_3', title: 'Rotational Motion', status: 'in_progress' },
          { id: 'ch_2_4', title: 'Thermodynamics & Heat', status: 'not_started' }
        ]
      },
      {
        id: 'sub_3',
        name: 'Organic Chemistry',
        code: 'CHEM102',
        color: '#10b981',
        targetHours: 30,
        totalStudiedSec: 1800,
        chapters: [
          { id: 'ch_3_1', title: 'Structure and Bonding', status: 'completed' },
          { id: 'ch_3_2', title: 'Alkanes and Cycloalkanes', status: 'in_progress' },
          { id: 'ch_3_3', title: 'Stereochemistry', status: 'not_started' },
          { id: 'ch_3_4', title: 'Alkenes & Reaction Mechanisms', status: 'not_started' }
        ]
      }
    ],
    timetable: [
      { id: 'tt_1', day: 'Monday', time: '09:00 - 10:30', subjectId: 'sub_1', topic: 'Calculus Problem Set' },
      { id: 'tt_2', day: 'Monday', time: '14:00 - 15:30', subjectId: 'sub_2', topic: 'Thermodynamics Review' },
      { id: 'tt_3', day: 'Tuesday', time: '10:00 - 11:30', subjectId: 'sub_3', topic: 'Organic Reaction Mechanisms' },
      { id: 'tt_4', day: 'Wednesday', time: '09:00 - 10:30', subjectId: 'sub_1', topic: 'Differential Equations' },
      { id: 'tt_5', day: 'Thursday', time: '15:00 - 16:30', subjectId: 'sub_2', topic: 'Physics Lab Problems' },
      { id: 'tt_6', day: 'Friday', time: '11:00 - 12:30', subjectId: 'sub_3', topic: 'Chemistry Synthesis Practice' }
    ],
    exams: [
      { id: 'ex_1', title: 'Midterm Calculus Exam', subjectId: 'sub_1', date: getFutureDate(5), targetScore: '90%' },
      { id: 'ex_2', title: 'Physics Final Test', subjectId: 'sub_2', date: getFutureDate(12), targetScore: '85%' },
      { id: 'ex_3', title: 'Chemistry Quiz 2', subjectId: 'sub_3', date: getFutureDate(18), targetScore: '95%' }
    ],
    assignments: [
      { id: 'as_1', title: 'Calculus Problem Set 4', subjectId: 'sub_1', dueDate: getFutureDate(2), priority: 'Urgent', status: 'In Progress' },
      { id: 'as_2', title: 'Thermodynamics Lab Report', subjectId: 'sub_2', dueDate: getFutureDate(6), priority: 'High', status: 'Pending' },
      { id: 'as_3', title: 'Organic Reaction Map', subjectId: 'sub_3', dueDate: getFutureDate(9), priority: 'Medium', status: 'Pending' }
    ],
    sessions: [],
    distractions: [],
    achievements: [
      { id: 'ach_first_session', title: 'First Step', desc: 'Completed your first verified study session', icon: 'award', unlockedAt: null },
      { id: 'ach_pomo_5', title: 'Pomodoro Pioneer', desc: 'Complete 5 Pomodoro sessions', icon: 'clock', unlockedAt: null },
      { id: 'ach_deep_diver', title: 'Deep Diver', desc: 'Complete a continuous session of 60+ minutes', icon: 'shield', unlockedAt: null },
      { id: 'ach_streak_3', title: 'Streak Flame', desc: 'Maintain a 3-day study streak', icon: 'zap', unlockedAt: null },
      { id: 'ach_streak_7', title: 'Streak Titan', desc: 'Maintain a 7-day study streak', icon: 'flame', unlockedAt: null },
      { id: 'ach_zen_master', title: 'Zen Master', desc: 'Study 30+ minutes with zero distractions logged', icon: 'check-circle', unlockedAt: null },
      { id: 'ach_sound_alchemist', title: 'Sound Alchemist', desc: 'Use the Study Sound Lab mixer while studying', icon: 'headphones', unlockedAt: null },
      { id: 'ach_syllabus_50', title: 'Syllabus Crusher', desc: 'Complete 50% of any subject syllabus', icon: 'trending-up', unlockedAt: null },
      { id: 'ach_breathe', title: 'Calm & Collected', desc: 'Complete a guided Box Breathing break session', icon: 'heart', unlockedAt: null },
      { id: 'ach_ai_scholar', title: 'AI Scholar', desc: 'Consult the AI Study Assistant for revision or explanation', icon: 'cpu', unlockedAt: null },
      { id: 'ach_hours_10', title: 'Century Scholar', desc: 'Accumulate 10 total hours of logged study time', icon: 'star', unlockedAt: null },
      { id: 'ach_night_owl', title: 'Night Owl', desc: 'Complete a study session after 10:00 PM', icon: 'moon', unlockedAt: null }
    ],
    weeklyChallenges: [
      { id: 'wc_1', title: 'Study 10 Hours This Week', targetSec: 36000, currentSec: 10800, rewardXp: 500 },
      { id: 'wc_2', title: 'Complete 5 Deep Focus Sessions', targetCount: 5, currentCount: 2, rewardXp: 300 },
      { id: 'wc_3', title: 'Zero Distractions in 3 Sessions', targetCount: 3, currentCount: 1, rewardXp: 350 }
    ]
  };

  function getFutureDate(daysAhead) {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return d.toISOString().split('T')[0];
  }

  // --- 2. STATE MANAGER & PERSISTENCE ---
  let appState = null;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Safe migration: merge defaults with saved data
        appState = deepMerge(defaultData, parsed);
      } else {
        // Try migrating from legacy clocktimer keys if present
        const legacyPurpose = localStorage.getItem('clocktimer_purpose');
        const legacyTime = localStorage.getItem('clocktimer_time');
        appState = JSON.parse(JSON.stringify(defaultData));
        if (legacyPurpose) {
          appState.currentPurpose = legacyPurpose;
        }
      }
    } catch (e) {
      console.error('Failed to load CLOCKTIMER state, initializing defaults', e);
      appState = JSON.parse(JSON.stringify(defaultData));
    }
    saveState();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
    } catch (e) {
      console.warn('LocalStorage save error', e);
    }
  }

  function deepMerge(target, source) {
    const output = Object.assign({}, target);
    if (isObject(target) && isObject(source)) {
      Object.keys(source).forEach(key => {
        if (isObject(source[key])) {
          if (!(key in target)) Object.assign(output, { [key]: source[key] });
          else output[key] = deepMerge(target[key], source[key]);
        } else {
          Object.assign(output, { [key]: source[key] });
        }
      });
    }
    return output;
  }

  function isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  // --- 3. LIVE CLOCK ENGINE ---
  let clockInterval = null;

  function initLiveClock() {
    function updateClock() {
      const now = new Date();
      const clockHoursEl = document.getElementById('clock-hours');
      const clockMinutesEl = document.getElementById('clock-minutes');
      const clockSecondsEl = document.getElementById('clock-seconds');
      const clockAmpmEl = document.getElementById('clock-ampm');
      const clockDateEl = document.getElementById('clock-date');
      const focusClockEl = document.getElementById('focus-live-clock');

      if (!clockHoursEl) return;

      const is12h = appState.settings.clockFormat === '12h';
      let hours = now.getHours();
      let ampm = '';

      if (is12h) {
        ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
      }

      const hStr = String(hours).padStart(2, '0');
      const mStr = String(now.getMinutes()).padStart(2, '0');
      const sStr = String(now.getSeconds()).padStart(2, '0');

      clockHoursEl.textContent = hStr;
      clockMinutesEl.textContent = mStr;
      if (clockSecondsEl) {
        clockSecondsEl.textContent = sStr;
        clockSecondsEl.style.display = appState.settings.showSeconds ? 'inline' : 'none';
      }
      if (clockAmpmEl) {
        clockAmpmEl.textContent = is12h ? ampm : '';
      }

      if (clockDateEl) {
        const options = { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' };
        clockDateEl.textContent = now.toLocaleDateString(undefined, options);
      }

      if (focusClockEl) {
        focusClockEl.textContent = `${hStr}:${mStr}:${sStr} ${is12h ? ampm : ''}`.trim();
      }
    }

    if (clockInterval) clearInterval(clockInterval);
    updateClock();
    clockInterval = setInterval(updateClock, 1000);
  }

  // --- 4. CORE STUDY TIMER ENGINE ---
  const timer = {
    mode: 'countdown', // 'countdown' or 'stopwatch'
    state: 'idle', // 'idle', 'running', 'paused', 'break'
    durationSec: 25 * 60, // 25 min default
    elapsedSec: 0,
    intervalId: null,
    sessionStartTime: null,
    sessionDistractionCount: 0,
    activeSubjectId: 'sub_1',
    activeChapterId: null,
    purposeText: 'Calculus Chapter 2: Limits & Continuity',
    isBreak: false,
    breakDurationSec: 5 * 60,

    start() {
      if (this.state === 'running') return;
      if (this.state === 'idle') {
        this.sessionStartTime = new Date();
        this.sessionDistractionCount = 0;
      }
      this.state = this.isBreak ? 'break' : 'running';
      this.intervalId = setInterval(() => this.tick(), 1000);
      updateTimerUI();
      showToast(this.isBreak ? 'Break started!' : 'Study session started! Focus mode engaged.', 'info');
    },

    pause() {
      if (this.state !== 'running' && this.state !== 'break') return;
      clearInterval(this.intervalId);
      this.state = 'paused';
      updateTimerUI();
      showToast('Timer paused', 'warning');
    },

    resume() {
      this.start();
    },

    reset() {
      clearInterval(this.intervalId);
      this.state = 'idle';
      this.elapsedSec = 0;
      this.isBreak = false;
      updateTimerUI();
      showToast('Timer reset', 'info');
    },

    tick() {
      this.elapsedSec++;

      if (this.mode === 'countdown' && !this.isBreak) {
        if (this.elapsedSec >= this.durationSec) {
          this.completeSession();
          return;
        }
      } else if (this.isBreak) {
        if (this.elapsedSec >= this.breakDurationSec) {
          this.completeBreak();
          return;
        }
      }

      updateTimerUI();
    },

    addMinutes(mins) {
      if (this.mode === 'countdown') {
        this.durationSec += mins * 60;
      } else {
        this.elapsedSec = Math.max(0, this.elapsedSec - mins * 60);
      }
      updateTimerUI();
      showToast(`+${mins} minutes added`, 'success');
    },

    completeSession() {
      clearInterval(this.intervalId);
      if (window.studySoundLab) window.studySoundLab.playChime('bell');

      const completedSec = this.elapsedSec;
      const verified = completedSec >= 60; // 1 min anti-cheat

      if (verified) {
        // Record session
        const sessionRecord = {
          id: 'sess_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          startTime: this.sessionStartTime ? this.sessionStartTime.toISOString() : new Date().toISOString(),
          endTime: new Date().toISOString(),
          durationSec: completedSec,
          subjectId: this.activeSubjectId,
          purpose: this.purposeText,
          distractions: this.sessionDistractionCount,
          xpEarned: calculateSessionXP(completedSec, this.sessionDistractionCount)
        };

        // Prevent duplicate records
        const exists = appState.sessions.some(s => s.id === sessionRecord.id);
        if (!exists) {
          appState.sessions.push(sessionRecord);

          // Update subject cumulative time
          const sub = appState.subjects.find(s => s.id === this.activeSubjectId);
          if (sub) {
            sub.totalStudiedSec = (sub.totalStudiedSec || 0) + completedSec;
          }

          // Gamification awards
          awardXP(sessionRecord.xpEarned, 'Completed Study Session');
          updateStreak();
          updatePersonalRecords(completedSec);
          checkAchievements();
          saveState();
          renderAnalytics();
          renderSubjects();
          renderPlanner();
        }

        showCelebrationModal('Session Finished!', `Awesome work! You studied for ${formatDurationHM(completedSec)} and earned +${sessionRecord.xpEarned} XP!`);
      } else {
        showToast('Session was under 1 minute; discarded without XP penalty.', 'warning');
      }

      // Check auto-break
      if (appState.settings.autoBreak) {
        this.startBreak();
      } else {
        this.reset();
      }
    },

    startBreak() {
      this.isBreak = true;
      this.state = 'break';
      this.elapsedSec = 0;
      this.breakDurationSec = (appState.settings.breakDurationMin || 5) * 60;
      this.intervalId = setInterval(() => this.tick(), 1000);
      updateTimerUI();
      showToast('Time for a refreshing break! Stretch or do eye exercises.', 'info');
      // Trigger break modal if preferred
      openBreakAssistantModal();
    },

    completeBreak() {
      clearInterval(this.intervalId);
      if (window.studySoundLab) window.studySoundLab.playChime('break');
      this.isBreak = false;
      this.reset();
      showToast('Break finished! Ready for another focused block?', 'success');
    }
  };

  function updateTimerUI() {
    const displayEl = document.getElementById('timer-display');
    const focusDisplayEl = document.getElementById('focus-timer-display');
    const statusEl = document.getElementById('timer-status-badge');
    const progressRing = document.getElementById('timer-progress-ring');
    const focusProgressRing = document.getElementById('focus-progress-ring');
    const startBtn = document.getElementById('btn-timer-start');
    const focusStartBtn = document.getElementById('btn-focus-start');

    let remainingOrElapsed = 0;
    let fraction = 0;

    if (timer.isBreak) {
      remainingOrElapsed = Math.max(0, timer.breakDurationSec - timer.elapsedSec);
      fraction = timer.breakDurationSec > 0 ? timer.elapsedSec / timer.breakDurationSec : 0;
      if (statusEl) {
        statusEl.textContent = 'RESTING & BREAK';
        statusEl.className = 'status-badge status-break';
      }
    } else if (timer.mode === 'countdown') {
      remainingOrElapsed = Math.max(0, timer.durationSec - timer.elapsedSec);
      fraction = timer.durationSec > 0 ? timer.elapsedSec / timer.durationSec : 0;
      if (statusEl) {
        statusEl.textContent = timer.state === 'running' ? 'DEEP STUDY' : timer.state === 'paused' ? 'PAUSED' : 'READY TO FOCUS';
        statusEl.className = `status-badge ${timer.state === 'running' ? 'status-active' : timer.state === 'paused' ? 'status-paused' : 'status-idle'}`;
      }
    } else {
      // Stopwatch count up
      remainingOrElapsed = timer.elapsedSec;
      fraction = (timer.elapsedSec % 3600) / 3600;
      if (statusEl) {
        statusEl.textContent = timer.state === 'running' ? 'COUNTING UP' : timer.state === 'paused' ? 'PAUSED' : 'STOPWATCH';
        statusEl.className = `status-badge ${timer.state === 'running' ? 'status-active' : 'status-idle'}`;
      }
    }

    const formattedTime = formatTimeSec(remainingOrElapsed);

    if (displayEl) displayEl.textContent = formattedTime;
    if (focusDisplayEl) focusDisplayEl.textContent = formattedTime;

    // Browser tab title update
    document.title = timer.state === 'running' ? `(${formattedTime}) Focus — ClockTimer` : 'ClockTimer — Ultimate Productivity Upgrade';

    // SVG Circular ring progress
    const radius = 135;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - Math.min(1, Math.max(0, fraction)));

    if (progressRing) {
      progressRing.style.strokeDasharray = `${circumference}`;
      progressRing.style.strokeDashoffset = `${offset}`;
    }
    if (focusProgressRing) {
      focusProgressRing.style.strokeDasharray = `${circumference}`;
      focusProgressRing.style.strokeDashoffset = `${offset}`;
    }

    // Toggle button icons
    const isRunning = timer.state === 'running' || timer.state === 'break';
    const btnText = isRunning ? 'Pause' : timer.state === 'paused' ? 'Resume' : 'Start Focus';
    const btnIcon = isRunning ? 'pause' : 'play';

    if (startBtn) {
      startBtn.innerHTML = `<i data-lucide="${btnIcon}"></i> <span>${btnText}</span>`;
      if (window.lucide) lucide.createIcons();
    }
    if (focusStartBtn) {
      focusStartBtn.innerHTML = `<i data-lucide="${btnIcon}"></i> <span>${btnText}</span>`;
      if (window.lucide) lucide.createIcons();
    }
  }

  function formatTimeSec(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  function formatDurationHM(seconds) {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins} min`;
  }

  // --- 5. PURPOSE BAR & HIDE/SHOW CORNER BUTTON ---
  function initPurposeBar() {
    const input = document.getElementById('study-purpose-input');
    const banner = document.getElementById('study-purpose-banner');
    const toggleBtn = document.getElementById('btn-toggle-purpose');
    const focusPurposeText = document.getElementById('focus-purpose-display');
    const focusPurposeBanner = document.getElementById('focus-purpose-banner');
    const focusToggleBtn = document.getElementById('btn-focus-toggle-purpose');

    if (input) {
      input.value = timer.purposeText;
      input.addEventListener('input', (e) => {
        timer.purposeText = e.target.value.trim() || 'General Study Session';
        if (focusPurposeText) focusPurposeText.textContent = timer.purposeText;
        try {
          localStorage.setItem('clocktimer_purpose', timer.purposeText);
        } catch (err) {}
      });
    }

    if (focusPurposeText) {
      focusPurposeText.textContent = timer.purposeText;
    }

    function togglePurposeVisibility() {
      appState.settings.purposeVisible = !appState.settings.purposeVisible;
      applyPurposeVisibility();
      saveState();
      showToast(appState.settings.purposeVisible ? 'Study purpose visible' : 'Study purpose hidden for minimal look', 'info');
    }

    function applyPurposeVisibility() {
      const visible = appState.settings.purposeVisible;
      if (banner) {
        banner.style.display = visible ? 'flex' : 'none';
      }
      if (focusPurposeBanner) {
        focusPurposeBanner.style.display = visible ? 'flex' : 'none';
      }
      if (toggleBtn) {
        toggleBtn.innerHTML = visible ? '<i data-lucide="eye-off"></i>' : '<i data-lucide="eye"></i>';
        toggleBtn.setAttribute('title', visible ? 'Hide Study Purpose (Left Top)' : 'Show Study Purpose');
      }
      if (focusToggleBtn) {
        focusToggleBtn.innerHTML = visible ? '<i data-lucide="eye-off"></i>' : '<i data-lucide="eye"></i>';
      }
      if (window.lucide) lucide.createIcons();
    }

    if (toggleBtn) toggleBtn.addEventListener('click', togglePurposeVisibility);
    if (focusToggleBtn) focusToggleBtn.addEventListener('click', togglePurposeVisibility);

    applyPurposeVisibility();
  }

  // --- 6. STAGE 1: SMART STUDY PLANNER ---
  function renderPlanner() {
    renderTimetable();
    renderExams();
    renderAssignments();
  }

  function renderTimetable() {
    const container = document.getElementById('timetable-list');
    if (!container) return;
    container.innerHTML = '';

    if (appState.timetable.length === 0) {
      container.innerHTML = `<div class="empty-state"><i data-lucide="calendar"></i><p>No timetable slots added yet.</p></div>`;
      if (window.lucide) lucide.createIcons();
      return;
    }

    appState.timetable.forEach((slot) => {
      const sub = appState.subjects.find(s => s.id === slot.subjectId) || { name: 'General', color: '#6366f1' };
      const card = document.createElement('div');
      card.className = 'planner-card';
      card.style.borderLeft = `4px solid ${sub.color}`;
      card.innerHTML = `
        <div class="planner-card-header">
          <span class="planner-day-pill">${slot.day}</span>
          <span class="planner-time-pill"><i data-lucide="clock"></i> ${slot.time}</span>
        </div>
        <div class="planner-card-body">
          <div class="planner-sub-name" style="color: ${sub.color}">${escapeHtml(sub.name)}</div>
          <div class="planner-topic">${escapeHtml(slot.topic)}</div>
        </div>
        <div class="planner-card-actions">
          <button class="btn-icon-sm" onclick="window.clockTimerApp.startTimerForSubject('${sub.id}', '${escapeHtml(slot.topic)}')"><i data-lucide="play"></i> Start</button>
          <button class="btn-icon-sm btn-delete" onclick="window.clockTimerApp.deleteTimetableSlot('${slot.id}')"><i data-lucide="trash-2"></i></button>
        </div>
      `;
      container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }

  function renderExams() {
    const container = document.getElementById('exam-countdown-list');
    if (!container) return;
    container.innerHTML = '';

    if (appState.exams.length === 0) {
      container.innerHTML = `<div class="empty-state"><i data-lucide="award"></i><p>No upcoming exams logged.</p></div>`;
      if (window.lucide) lucide.createIcons();
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    appState.exams.forEach((exam) => {
      const examDate = new Date(exam.date);
      const diffTime = examDate - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const sub = appState.subjects.find(s => s.id === exam.subjectId) || { name: 'General', color: '#6366f1' };

      let urgencyClass = 'badge-normal';
      let urgencyText = `${diffDays} days left`;
      if (diffDays <= 0) {
        urgencyClass = 'badge-critical';
        urgencyText = 'Today / Passed';
      } else if (diffDays <= 3) {
        urgencyClass = 'badge-critical';
      } else if (diffDays <= 7) {
        urgencyClass = 'badge-warning';
      }

      const card = document.createElement('div');
      card.className = 'exam-card';
      card.innerHTML = `
        <div class="exam-card-top">
          <span class="exam-sub-tag" style="background: ${sub.color}22; color: ${sub.color}">${escapeHtml(sub.name)}</span>
          <span class="badge ${urgencyClass}">${urgencyText}</span>
        </div>
        <div class="exam-title">${escapeHtml(exam.title)}</div>
        <div class="exam-meta">
          <span><i data-lucide="calendar"></i> ${exam.date}</span>
          <span><i data-lucide="target"></i> Target: ${exam.targetScore || '85%'}</span>
        </div>
        <div class="exam-actions">
          <button class="btn-secondary-sm" onclick="window.clockTimerApp.startTimerForSubject('${sub.id}', 'Prep for ${escapeHtml(exam.title)}')">Prep Now</button>
          <button class="btn-icon-sm" onclick="window.clockTimerApp.deleteExam('${exam.id}')"><i data-lucide="trash-2"></i></button>
        </div>
      `;
      container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }

  function renderAssignments() {
    const container = document.getElementById('assignment-list');
    if (!container) return;
    container.innerHTML = '';

    if (appState.assignments.length === 0) {
      container.innerHTML = `<div class="empty-state"><i data-lucide="check-square"></i><p>No assignments pending!</p></div>`;
      if (window.lucide) lucide.createIcons();
      return;
    }

    appState.assignments.forEach((as) => {
      const sub = appState.subjects.find(s => s.id === as.subjectId) || { name: 'General', color: '#6366f1' };
      const priorityClass = as.priority === 'Urgent' ? 'badge-critical' : as.priority === 'High' ? 'badge-warning' : 'badge-normal';

      const card = document.createElement('div');
      card.className = 'assignment-card';
      card.innerHTML = `
        <div class="as-col-info">
          <div class="as-title">${escapeHtml(as.title)}</div>
          <div class="as-meta">
            <span style="color: ${sub.color}">${escapeHtml(sub.name)}</span> • Due: ${as.dueDate}
          </div>
        </div>
        <div class="as-col-status">
          <span class="badge ${priorityClass}">${as.priority}</span>
          <select class="input-select-sm" onchange="window.clockTimerApp.updateAssignmentStatus('${as.id}', this.value)">
            <option value="Pending" ${as.status === 'Pending' ? 'selected' : ''}>Pending</option>
            <option value="In Progress" ${as.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
            <option value="Completed" ${as.status === 'Completed' ? 'selected' : ''}>Completed</option>
          </select>
          <button class="btn-icon-sm" onclick="window.clockTimerApp.deleteAssignment('${as.id}')"><i data-lucide="trash-2"></i></button>
        </div>
      `;
      container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }

  // iCalendar (.ics) Exporter
  function exportCalendarICS() {
    let icsContent = "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//ClockTimer//Student Study Planner//EN\r\n";

    appState.exams.forEach(ex => {
      const dt = ex.date.replace(/-/g, '');
      icsContent += "BEGIN:VEVENT\r\n";
      icsContent += `SUMMARY:EXAM: ${ex.title}\r\n`;
      icsContent += `DESCRIPTION:Target Score: ${ex.targetScore}\r\n`;
      icsContent += `DTSTART;VALUE=DATE:${dt}\r\n`;
      icsContent += `DTEND;VALUE=DATE:${dt}\r\n`;
      icsContent += "STATUS:CONFIRMED\r\n";
      icsContent += "END:VEVENT\r\n";
    });

    icsContent += "END:VCALENDAR\r\n";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'clocktimer_study_schedule.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Calendar export downloaded (.ics)', 'success');
  }

  // --- 7. STAGE 1: SUBJECT MANAGEMENT ---
  function renderSubjects() {
    const container = document.getElementById('subjects-grid');
    const selectEl = document.getElementById('timer-subject-select');
    if (!container) return;
    container.innerHTML = '';

    if (selectEl) {
      selectEl.innerHTML = '';
    }

    let totalChaptersCount = 0;
    let completedChaptersCount = 0;

    appState.subjects.forEach(sub => {
      const chapters = sub.chapters || [];
      const comp = chapters.filter(c => c.status === 'completed').length;
      const total = chapters.length;
      totalChaptersCount += total;
      completedChaptersCount += comp;
      const pct = total > 0 ? Math.round((comp / total) * 100) : 0;
      const studyHrs = ((sub.totalStudiedSec || 0) / 3600).toFixed(1);

      if (selectEl) {
        const opt = document.createElement('option');
        opt.value = sub.id;
        opt.textContent = `${sub.name} (${sub.code})`;
        if (sub.id === timer.activeSubjectId) opt.selected = true;
        selectEl.appendChild(opt);
      }

      const card = document.createElement('div');
      card.className = 'subject-card';
      card.style.borderTop = `4px solid ${sub.color}`;
      card.innerHTML = `
        <div class="subject-card-head">
          <div>
            <span class="sub-code-badge">${escapeHtml(sub.code)}</span>
            <h3 class="sub-title">${escapeHtml(sub.name)}</h3>
          </div>
          <button class="btn-icon-sm" onclick="window.clockTimerApp.openAddChapterModal('${sub.id}')" title="Add Chapter"><i data-lucide="plus"></i></button>
        </div>
        <div class="sub-stats-row">
          <div><i data-lucide="clock"></i> Studied: <strong>${studyHrs}h</strong></div>
          <div><i data-lucide="check-circle-2"></i> Syllabus: <strong>${pct}%</strong></div>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${pct}%; background: ${sub.color}"></div>
        </div>
        <div class="chapter-list">
          ${chapters.map(ch => `
            <div class="chapter-item ${ch.status}">
              <label class="chapter-label">
                <input type="checkbox" ${ch.status === 'completed' ? 'checked' : ''} onchange="window.clockTimerApp.toggleChapterStatus('${sub.id}', '${ch.id}', this.checked)">
                <span class="${ch.status === 'completed' ? 'text-strikethrough' : ''}">${escapeHtml(ch.title)}</span>
              </label>
              <button class="btn-icon-xs" onclick="window.clockTimerApp.deleteChapter('${sub.id}', '${ch.id}')"><i data-lucide="x"></i></button>
            </div>
          `).join('')}
        </div>
        <div class="subject-card-footer">
          <button class="btn-secondary-sm" onclick="window.clockTimerApp.startTimerForSubject('${sub.id}', '${escapeHtml(sub.name)}')"><i data-lucide="play"></i> Focus Sub</button>
          <button class="btn-icon-sm" onclick="window.clockTimerApp.deleteSubject('${sub.id}')"><i data-lucide="trash-2"></i></button>
        </div>
      `;
      container.appendChild(card);
    });

    // Update global syllabus meter on dashboard
    const globalSyllabusMeter = document.getElementById('global-syllabus-percent');
    if (globalSyllabusMeter) {
      const overallPct = totalChaptersCount > 0 ? Math.round((completedChaptersCount / totalChaptersCount) * 100) : 0;
      globalSyllabusMeter.textContent = `${overallPct}%`;
      const globalFill = document.getElementById('global-syllabus-bar');
      if (globalFill) globalFill.style.width = `${overallPct}%`;
    }

    if (window.lucide) lucide.createIcons();
  }

  // --- 8. STAGE 1: DEEP FOCUS MODE ---
  function initDeepFocusMode() {
    const focusContainer = document.getElementById('deep-focus-overlay');
    const btnEnterFocus = document.getElementById('btn-enter-focus');
    const btnExitFocus = document.getElementById('btn-exit-focus');

    function enterFocus() {
      if (focusContainer) {
        focusContainer.classList.add('active');
        document.body.classList.add('in-deep-focus');
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch(() => {});
        }
        showToast('Entered Deep Focus Mode. Press Esc or click exit to leave.', 'info');
      }
    }

    function exitFocus() {
      if (focusContainer) {
        focusContainer.classList.remove('active');
        document.body.classList.remove('in-deep-focus');
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen().catch(() => {});
        }
      }
    }

    if (btnEnterFocus) btnEnterFocus.addEventListener('click', enterFocus);
    if (btnExitFocus) btnExitFocus.addEventListener('click', exitFocus);

    // Keyboard shortcut F for Fullscreen Focus
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.key === 'f' || e.key === 'F') {
        if (focusContainer && focusContainer.classList.contains('active')) {
          exitFocus();
        } else {
          enterFocus();
        }
      } else if (e.key === 'Escape') {
        exitFocus();
      }
    });
  }

  // --- 9. STAGE 2: DISTRACTION TRACKER ---
  function logDistraction(reason = 'General Interruption') {
    const entry = {
      id: 'dist_' + Date.now(),
      timestamp: new Date().toISOString(),
      reason: reason,
      sessionPurpose: timer.purposeText,
      subjectId: timer.activeSubjectId
    };

    appState.distractions.push(entry);
    timer.sessionDistractionCount++;
    saveState();
    renderDistractionStats();
    showToast(`Distraction logged: ${reason}. Deep breath, refocus!`, 'warning');
  }

  function renderDistractionStats() {
    const countEl = document.getElementById('daily-distraction-count');
    const focusScoreEl = document.getElementById('focus-efficiency-score');
    const trendEl = document.getElementById('distraction-trend-text');

    const todayStr = new Date().toISOString().split('T')[0];
    const todayDistractions = appState.distractions.filter(d => d.timestamp.startsWith(todayStr));
    const count = todayDistractions.length;

    if (countEl) countEl.textContent = count;

    // Calculate Focus Efficiency %
    const todaySessions = appState.sessions.filter(s => s.startTime.startsWith(todayStr));
    const todayStudySec = todaySessions.reduce((acc, s) => acc + s.durationSec, 0);

    let efficiency = 100;
    if (todayStudySec > 0 || count > 0) {
      const penaltySec = count * 300; // each distraction costs 5 min penalty
      efficiency = Math.max(0, Math.min(100, Math.round((todayStudySec / (todayStudySec + penaltySec)) * 100)));
    }

    if (focusScoreEl) focusScoreEl.textContent = `${efficiency}%`;

    // Calculate most common trigger
    if (trendEl) {
      if (appState.distractions.length === 0) {
        trendEl.textContent = 'Zero distractions recorded today. Excellent focus!';
      } else {
        const counts = {};
        appState.distractions.forEach(d => { counts[d.reason] = (counts[d.reason] || 0) + 1; });
        const topReason = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
        trendEl.textContent = `Top trigger: ${topReason} (${counts[topReason]} times). Consider silencing notifications!`;
      }
    }
  }

  // --- 10. STAGE 2: BREAK ASSISTANT & GUIDED BREATHING ---
  let breathingInterval = null;
  let breathingPhase = 0; // 0=Inhale(4s), 1=Hold(4s), 2=Exhale(4s), 3=Hold(4s)
  let breathingSeconds = 4;

  function initBreathingAssistant() {
    const circle = document.getElementById('breathing-visual-circle');
    const text = document.getElementById('breathing-guide-text');
    const timerText = document.getElementById('breathing-seconds-text');
    const btnToggle = document.getElementById('btn-toggle-breathing');

    const phases = [
      { name: 'Inhale deeply...', scale: 'scale(1.4)', bg: '#38bdf8' },
      { name: 'Hold your breath...', scale: 'scale(1.4)', bg: '#818cf8' },
      { name: 'Exhale slowly...', scale: 'scale(0.85)', bg: '#34d399' },
      { name: 'Hold gently...', scale: 'scale(0.85)', bg: '#a78bfa' }
    ];

    function stepBreathing() {
      breathingSeconds--;
      if (timerText) timerText.textContent = `${breathingSeconds}s`;

      if (breathingSeconds <= 0) {
        breathingPhase = (breathingPhase + 1) % 4;
        breathingSeconds = 4;
        const cur = phases[breathingPhase];
        if (text) text.textContent = cur.name;
        if (circle) {
          circle.style.transform = cur.scale;
          circle.style.borderColor = cur.bg;
          circle.style.boxShadow = `0 0 35px ${cur.bg}66`;
        }
      }
    }

    if (btnToggle) {
      btnToggle.addEventListener('click', () => {
        if (breathingInterval) {
          clearInterval(breathingInterval);
          breathingInterval = null;
          btnToggle.textContent = 'Start Box Breathing (4-4-4-4)';
          if (text) text.textContent = 'Ready to begin relaxation?';
          if (circle) circle.style.transform = 'scale(1)';
        } else {
          breathingPhase = 0;
          breathingSeconds = 4;
          const cur = phases[0];
          if (text) text.textContent = cur.name;
          if (circle) {
            circle.style.transform = cur.scale;
            circle.style.borderColor = cur.bg;
          }
          if (timerText) timerText.textContent = '4s';
          breathingInterval = setInterval(stepBreathing, 1000);
          btnToggle.textContent = 'Stop Breathing Exercise';
          awardXP(15, 'Mindful Breathing Break');
          unlockAchievement('ach_breathe');
        }
      });
    }
  }

  function openBreakAssistantModal() {
    const modal = document.getElementById('modal-break-assistant');
    if (modal) modal.classList.add('active');
  }

  // --- 11. STAGE 2: STUDY SOUND LAB UI INTEGRATION ---
  function initSoundLabUI() {
    const soundLab = window.studySoundLab;
    const tracksContainer = document.getElementById('sound-tracks-container');
    const masterSlider = document.getElementById('master-volume-slider');
    const btnMute = document.getElementById('btn-sound-mute');
    const presetSelect = document.getElementById('sound-preset-select');
    const sleepTimerSelect = document.getElementById('sound-sleep-timer-select');
    const miniSoundBtn = document.getElementById('btn-mini-sound-toggle');

    if (!soundLab || !tracksContainer) return;
    tracksContainer.innerHTML = '';

    soundLab.trackDefs.forEach(track => {
      const card = document.createElement('div');
      card.className = 'sound-track-card';
      card.id = `sound-card-${track.id}`;
      card.innerHTML = `
        <div class="sound-card-header">
          <button class="btn-sound-play" id="btn-sound-${track.id}">
            <i data-lucide="${track.icon || 'volume-2'}"></i>
          </button>
          <div>
            <div class="sound-track-title">${track.name}</div>
            <div class="sound-track-desc">${track.desc}</div>
          </div>
        </div>
        <div class="sound-slider-wrap">
          <input type="range" min="0" max="100" value="50" class="sound-slider" id="slider-sound-${track.id}">
          <span class="sound-vol-val" id="val-sound-${track.id}">50%</span>
        </div>
      `;
      tracksContainer.appendChild(card);

      // Event bindings
      const playBtn = card.querySelector(`#btn-sound-${track.id}`);
      const slider = card.querySelector(`#slider-sound-${track.id}`);
      const valText = card.querySelector(`#val-sound-${track.id}`);

      playBtn.addEventListener('click', () => {
        const vol = slider.value / 100;
        const isPlaying = soundLab.toggleTrack(track.id, vol);
        card.classList.toggle('playing', isPlaying);
        playBtn.classList.toggle('active', isPlaying);
        if (isPlaying) {
          unlockAchievement('ach_sound_alchemist');
        }
      });

      slider.addEventListener('input', (e) => {
        const v = e.target.value;
        valText.textContent = `${v}%`;
        soundLab.setTrackVolume(track.id, v / 100);
      });
    });

    if (masterSlider) {
      masterSlider.value = soundLab.masterVolume * 100;
      masterSlider.addEventListener('input', (e) => {
        soundLab.setMasterVolume(e.target.value / 100);
      });
    }

    if (btnMute) {
      btnMute.addEventListener('click', () => {
        const muted = soundLab.toggleMute();
        btnMute.innerHTML = muted ? '<i data-lucide="volume-x"></i>' : '<i data-lucide="volume-2"></i>';
        if (window.lucide) lucide.createIcons();
      });
    }

    if (presetSelect) {
      presetSelect.innerHTML = '<option value="">-- Choose Sound Preset --</option>';
      Object.keys(soundLab.presets).forEach(k => {
        const opt = document.createElement('option');
        opt.value = k;
        opt.textContent = soundLab.presets[k].name;
        presetSelect.appendChild(opt);
      });

      presetSelect.addEventListener('change', (e) => {
        const val = e.target.value;
        if (!val) return;
        soundLab.applyPreset(val);
        // Sync sliders & playing states
        setTimeout(() => {
          soundLab.trackDefs.forEach(t => {
            const card = document.getElementById(`sound-card-${t.id}`);
            const btn = document.getElementById(`btn-sound-${t.id}`);
            const slider = document.getElementById(`slider-sound-${t.id}`);
            const valEl = document.getElementById(`val-sound-${t.id}`);
            const track = soundLab.tracks[t.id];
            const isPlaying = track && track.isPlaying;
            if (card) card.classList.toggle('playing', !!isPlaying);
            if (btn) btn.classList.toggle('active', !!isPlaying);
            if (slider && track) {
              slider.value = Math.round(track.volume * 100);
              if (valEl) valEl.textContent = `${slider.value}%`;
            }
          });
        }, 600);
        showToast(`Sound preset applied: ${soundLab.presets[val].name}`, 'info');
      });
    }

    if (sleepTimerSelect) {
      sleepTimerSelect.addEventListener('change', (e) => {
        const mins = parseInt(e.target.value, 10);
        if (mins > 0) {
          soundLab.setSleepTimer(mins, (rem) => {
            const m = Math.floor(rem / 60);
            const s = rem % 60;
            const timerLabel = document.getElementById('sound-sleep-label');
            if (timerLabel) timerLabel.textContent = `Fade in ${m}m ${s}s`;
          }, () => {
            showToast('Sleep timer finished. Sound muted.', 'info');
          });
          showToast(`Sleep timer set to ${mins} minutes`, 'success');
        } else {
          soundLab.clearSleepTimer();
        }
      });
    }

    if (window.lucide) lucide.createIcons();
  }

  // --- 12. STAGE 3: GAMIFICATION & ACHIEVEMENTS ---
  function calculateSessionXP(durationSec, distractions) {
    const minutes = Math.floor(durationSec / 60);
    let baseXP = minutes * 10;
    // Streak bonus
    const streakBonus = Math.min(100, appState.profile.streak * 10);
    // Zero distraction bonus
    if (distractions === 0 && minutes >= 25) {
      baseXP += 50;
    }
    return Math.max(10, baseXP + streakBonus);
  }

  function awardXP(amount, reason = '') {
    appState.profile.xp += amount;
    const oldLevel = appState.profile.level;
    const newLevel = calculateLevel(appState.profile.xp);

    if (newLevel > oldLevel) {
      appState.profile.level = newLevel;
      showLevelUpCelebration(newLevel);
    }

    renderProfileStats();
  }

  function calculateLevel(xp) {
    // Level formula: Level = floor(sqrt(XP / 100)) + 1
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  }

  function getLevelTitle(level) {
    if (level < 5) return 'Novice Seeker';
    if (level < 10) return 'Focus Apprentice';
    if (level < 20) return 'Dedicated Scholar';
    if (level < 35) return 'Master of Flow';
    if (level < 50) return 'Grand Polymath';
    return 'Legendary Mind';
  }

  function updateStreak() {
    const today = new Date().toISOString().split('T')[0];
    const last = appState.profile.lastStudyDate;

    if (!last) {
      appState.profile.streak = 1;
      appState.profile.lastStudyDate = today;
    } else if (last === today) {
      // already counted today
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (last === yesterdayStr) {
        appState.profile.streak += 1;
        appState.profile.lastStudyDate = today;
      } else {
        // Streak broken
        appState.profile.streak = 1;
        appState.profile.lastStudyDate = today;
      }
    }
  }

  function updatePersonalRecords(sessionSec) {
    const pr = appState.profile.personalRecords;
    if (sessionSec > (pr.longestSessionSec || 0)) {
      pr.longestSessionSec = sessionSec;
    }
    pr.totalStudySec = (pr.totalStudySec || 0) + sessionSec;
  }

  function checkAchievements() {
    const sCount = appState.sessions.length;
    const totalSec = appState.profile.personalRecords.totalStudySec || 0;
    const maxSingleSec = appState.profile.personalRecords.longestSessionSec || 0;

    if (sCount >= 1) unlockAchievement('ach_first_session');
    if (sCount >= 5) unlockAchievement('ach_pomo_5');
    if (maxSingleSec >= 3600) unlockAchievement('ach_deep_diver');
    if (appState.profile.streak >= 3) unlockAchievement('ach_streak_3');
    if (appState.profile.streak >= 7) unlockAchievement('ach_streak_7');
    if (totalSec >= 36000) unlockAchievement('ach_hours_10');

    // Check night owl
    const now = new Date();
    if (now.getHours() >= 22 || now.getHours() < 4) {
      unlockAchievement('ach_night_owl');
    }

    renderAchievements();
  }

  function unlockAchievement(achId) {
    const ach = appState.achievements.find(a => a.id === achId);
    if (ach && !ach.unlockedAt) {
      ach.unlockedAt = new Date().toISOString();
      awardXP(100, `Unlocked Badge: ${ach.title}`);
      saveState();
      showToast(`🏆 Badge Unlocked: ${ach.title}! (+100 XP)`, 'success');
      showCelebrationModal(`Achievement Unlocked!`, `You earned the "${ach.title}" badge: ${ach.desc}`);
    }
  }

  function renderAchievements() {
    const container = document.getElementById('achievements-grid');
    if (!container) return;
    container.innerHTML = '';

    appState.achievements.forEach(ach => {
      const isUnlocked = !!ach.unlockedAt;
      const card = document.createElement('div');
      card.className = `achievement-card ${isUnlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="ach-icon-wrap">
          <i data-lucide="${ach.icon || 'award'}"></i>
        </div>
        <div class="ach-content">
          <div class="ach-title">${escapeHtml(ach.title)}</div>
          <div class="ach-desc">${escapeHtml(ach.desc)}</div>
          <div class="ach-status-text">${isUnlocked ? `Unlocked on ${ach.unlockedAt.split('T')[0]}` : 'Locked'}</div>
        </div>
      `;
      container.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
  }

  function renderProfileStats() {
    const levelEl = document.getElementById('profile-level');
    const headerLevelEl = document.getElementById('header-level-badge');
    const xpEl = document.getElementById('profile-xp');
    const titleEl = document.getElementById('profile-title');
    const streakEl = document.getElementById('profile-streak');
    const headerStreakEl = document.getElementById('header-streak-badge');
    const totalHoursEl = document.getElementById('stat-total-hours');
    const longestSessionEl = document.getElementById('stat-longest-session');

    const lvl = appState.profile.level;
    const xp = appState.profile.xp;
    const title = getLevelTitle(lvl);
    const streak = appState.profile.streak;
    const totalHrs = ((appState.profile.personalRecords.totalStudySec || 0) / 3600).toFixed(1);
    const longest = formatDurationHM(appState.profile.personalRecords.longestSessionSec || 0);

    if (levelEl) levelEl.textContent = `Lvl ${lvl}`;
    if (headerLevelEl) headerLevelEl.textContent = `Lvl ${lvl}`;
    if (xpEl) xpEl.textContent = `${xp} XP`;
    if (titleEl) titleEl.textContent = title;
    if (streakEl) streakEl.textContent = `${streak} days`;
    if (headerStreakEl) headerStreakEl.innerHTML = `<i data-lucide="flame"></i> ${streak}d`;
    if (totalHoursEl) totalHoursEl.textContent = `${totalHrs} hrs`;
    if (longestSessionEl) longestSessionEl.textContent = longest;

    // Weekly challenges
    const wcContainer = document.getElementById('weekly-challenges-list');
    if (wcContainer) {
      wcContainer.innerHTML = '';
      appState.weeklyChallenges.forEach(wc => {
        let pct = 0;
        let progressLabel = '';
        if (wc.targetSec) {
          pct = Math.min(100, Math.round((wc.currentSec / wc.targetSec) * 100));
          progressLabel = `${(wc.currentSec / 3600).toFixed(1)} / ${(wc.targetSec / 3600).toFixed(1)} hrs`;
        } else {
          pct = Math.min(100, Math.round((wc.currentCount / wc.targetCount) * 100));
          progressLabel = `${wc.currentCount} / ${wc.targetCount}`;
        }

        const item = document.createElement('div');
        item.className = 'challenge-item';
        item.innerHTML = `
          <div class="challenge-header">
            <span>${escapeHtml(wc.title)}</span>
            <span class="badge badge-normal">+${wc.rewardXp} XP</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${pct}%"></div>
          </div>
          <div class="challenge-meta">Progress: ${progressLabel} (${pct}%)</div>
        `;
        wcContainer.appendChild(item);
      });
    }

    if (window.lucide) lucide.createIcons();
  }

  // --- 13. STAGE 3: ADVANCED ANALYTICS & VISUALIZATIONS ---
  function renderAnalytics() {
    renderStudyHeatmap();
    renderSubjectDistribution();
    renderDailyBarChart();
    renderBestStudyPeriods();
  }

  // 52-Week GitHub-style activity heatmap
  function renderStudyHeatmap() {
    const container = document.getElementById('study-heatmap-grid');
    if (!container) return;
    container.innerHTML = '';

    // Generate date map of study minutes
    const dayMap = {};
    appState.sessions.forEach(s => {
      const dateKey = s.startTime.split('T')[0];
      dayMap[dateKey] = (dayMap[dateKey] || 0) + Math.round(s.durationSec / 60);
    });

    // 52 weeks = 364 days backwards from today
    const days = [];
    const today = new Date();
    for (let i = 364; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split('T')[0];
      days.push({
        date: key,
        minutes: dayMap[key] || 0
      });
    }

    days.forEach(day => {
      const cell = document.createElement('div');
      cell.className = 'heatmap-cell';
      let intensity = 'lvl-0';
      if (day.minutes > 120) intensity = 'lvl-4';
      else if (day.minutes > 60) intensity = 'lvl-3';
      else if (day.minutes > 30) intensity = 'lvl-2';
      else if (day.minutes > 0) intensity = 'lvl-1';

      cell.classList.add(intensity);
      cell.setAttribute('title', `${day.date}: ${day.minutes} minutes studied`);
      container.appendChild(cell);
    });
  }

  // Subject study distribution doughnut
  function renderSubjectDistribution() {
    const container = document.getElementById('subject-breakdown-bars');
    if (!container) return;
    container.innerHTML = '';

    let totalSec = appState.subjects.reduce((acc, s) => acc + (s.totalStudiedSec || 0), 0);
    if (totalSec === 0) totalSec = 1;

    appState.subjects.forEach(sub => {
      const sec = sub.totalStudiedSec || 0;
      const pct = Math.round((sec / totalSec) * 100);
      const hrs = (sec / 3600).toFixed(1);

      const row = document.createElement('div');
      row.className = 'subject-breakdown-row';
      row.innerHTML = `
        <div class="row-labels">
          <span style="color: ${sub.color}">● ${escapeHtml(sub.name)}</span>
          <span>${hrs} hrs (${pct}%)</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar-fill" style="width: ${pct}%; background: ${sub.color}"></div>
        </div>
      `;
      container.appendChild(row);
    });
  }

  // HTML5 Canvas Bar Chart for daily hours
  function renderDailyBarChart() {
    const canvas = document.getElementById('daily-chart-canvas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width = canvas.parentElement.clientWidth || 500;
    const height = canvas.height = 200;

    // Last 7 days
    const labels = [];
    const minutes = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString(undefined, { weekday: 'short' });
      labels.push(dayLabel);

      const daySec = appState.sessions
        .filter(s => s.startTime.startsWith(key))
        .reduce((acc, s) => acc + s.durationSec, 0);
      minutes.push(Math.round(daySec / 60));
    }

    ctx.clearRect(0, 0, width, height);

    const maxMins = Math.max(60, ...minutes);
    const barWidth = Math.min(45, (width - 60) / 7 - 12);
    const chartHeight = height - 40;

    // Draw baseline
    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, chartHeight);
    ctx.lineTo(width - 10, chartHeight);
    ctx.stroke();

    // Draw bars
    minutes.forEach((min, idx) => {
      const x = 45 + idx * ((width - 50) / 7);
      const barH = (min / maxMins) * (chartHeight - 30);
      const y = chartHeight - barH;

      // Gradient bar
      const grad = ctx.createLinearGradient(0, y, 0, chartHeight);
      grad.addColorStop(0, '#6366f1');
      grad.addColorStop(1, '#a855f7');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
      ctx.fill();

      // Label
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(labels[idx], x + barWidth / 2, height - 10);

      // Value
      if (min > 0) {
        ctx.fillStyle = '#cbd5e1';
        ctx.fillText(`${min}m`, x + barWidth / 2, y - 5);
      }
    });
  }

  // Best study periods analyzer
  function renderBestStudyPeriods() {
    const morningEl = document.getElementById('period-morning-val');
    const afternoonEl = document.getElementById('period-afternoon-val');
    const eveningEl = document.getElementById('period-evening-val');
    const nightEl = document.getElementById('period-night-val');
    const bestPeriodBadge = document.getElementById('best-period-badge');

    const periods = { morning: 0, afternoon: 0, evening: 0, night: 0 };

    appState.sessions.forEach(s => {
      const h = new Date(s.startTime).getHours();
      if (h >= 5 && h < 12) periods.morning += s.durationSec;
      else if (h >= 12 && h < 17) periods.afternoon += s.durationSec;
      else if (h >= 17 && h < 22) periods.evening += s.durationSec;
      else periods.night += s.durationSec;
    });

    if (morningEl) morningEl.textContent = formatDurationHM(periods.morning);
    if (afternoonEl) afternoonEl.textContent = formatDurationHM(periods.afternoon);
    if (eveningEl) eveningEl.textContent = formatDurationHM(periods.evening);
    if (nightEl) nightEl.textContent = formatDurationHM(periods.night);

    if (bestPeriodBadge) {
      const top = Object.keys(periods).reduce((a, b) => periods[a] > periods[b] ? a : b);
      const names = { morning: 'Morning (5am - 12pm)', afternoon: 'Afternoon (12pm - 5pm)', evening: 'Evening (5pm - 10pm)', night: 'Night (10pm - 5am)' };
      bestPeriodBadge.textContent = periods[top] > 0 ? `Prime Focus Zone: ${names[top]}` : 'Log more sessions to discover your prime focus zone';
    }
  }

  // Export CSV Report
  function exportCSVReport() {
    let csv = "Session ID,Start Time,End Time,Duration (Minutes),Subject,Purpose,Distractions,XP Earned\r\n";
    appState.sessions.forEach(s => {
      const sub = appState.subjects.find(sub => sub.id === s.subjectId) || { name: 'General' };
      const mins = (s.durationSec / 60).toFixed(1);
      csv += `"${s.id}","${s.startTime}","${s.endTime}",${mins},"${sub.name}","${(s.purpose || '').replace(/"/g, '""')}",${s.distractions || 0},${s.xpEarned || 0}\r\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `clocktimer_study_sessions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Sessions exported to CSV!', 'success');
  }

  // Printable PDF Report
  function printPDFReport() {
    window.print();
  }

  // --- 14. STAGE 4: AI STUDY ASSISTANT ---
  function initAIAssistant() {
    const inputPrompt = document.getElementById('ai-user-prompt');
    const selectMode = document.getElementById('ai-task-mode');
    const btnSend = document.getElementById('btn-ai-generate');
    const responseBox = document.getElementById('ai-response-box');
    const setupNotice = document.getElementById('ai-setup-notice');
    const btnSaveKey = document.getElementById('btn-save-gemini-key');
    const apiKeyInput = document.getElementById('gemini-api-key-input');

    // Load saved key if any
    let apiKey = localStorage.getItem(GEMINI_KEY_STORAGE) || '';
    if (apiKeyInput) apiKeyInput.value = apiKey;

    function checkKeyConfigured() {
      apiKey = localStorage.getItem(GEMINI_KEY_STORAGE) || '';
      if (setupNotice) {
        setupNotice.style.display = apiKey ? 'none' : 'block';
      }
      return !!apiKey;
    }

    if (btnSaveKey) {
      btnSaveKey.addEventListener('click', () => {
        const val = apiKeyInput ? apiKeyInput.value.trim() : '';
        if (val) {
          localStorage.setItem(GEMINI_KEY_STORAGE, val);
          checkKeyConfigured();
          showToast('Gemini API Key securely saved locally!', 'success');
        } else {
          localStorage.removeItem(GEMINI_KEY_STORAGE);
          checkKeyConfigured();
          showToast('API Key cleared.', 'info');
        }
      });
    }

    if (btnSend) {
      btnSend.addEventListener('click', async () => {
        if (!checkKeyConfigured()) {
          showToast('Please configure your Google Gemini API key to use real AI.', 'warning');
          return;
        }

        const query = inputPrompt ? inputPrompt.value.trim() : '';
        if (!query) {
          showToast('Please type a topic or question to ask the AI.', 'warning');
          return;
        }

        const mode = selectMode ? selectMode.value : 'explain';
        let systemPrompt = '';

        switch (mode) {
          case 'explain':
            systemPrompt = 'You are an elite academic tutor. Explain this topic in crystal-clear steps with intuitive real-world analogies, concise bullet points, and key formulas: ';
            break;
          case 'quiz':
            systemPrompt = 'You are an exam examiner. Generate 5 challenging multiple-choice or conceptual revision questions for this topic, along with complete answer keys and explanations: ';
            break;
          case 'notes':
            systemPrompt = 'Create high-yield, structured revision study notes with headings, key definitions, mnemonics, and summary takeaways for: ';
            break;
          case 'schedule':
            systemPrompt = 'Create an optimized daily revision schedule leading up to an exam for the following subject and topics: ';
            break;
          case 'recommend':
            systemPrompt = 'Based on the following student learning objectives and syllabus scope, recommend the top 3 high-yield topics to focus on next: ';
            break;
        }

        btnSend.disabled = true;
        btnSend.innerHTML = '<i data-lucide="loader-2" class="spin"></i> Consulting Gemini AI...';
        if (responseBox) responseBox.innerHTML = '<div class="ai-loading">Generating academic insights with Google Gemini...</div>';

        try {
          const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{
                parts: [{ text: `${systemPrompt}\n\n${query}` }]
              }],
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1024
              }
            })
          });

          const data = await res.json();

          if (data.error) {
            throw new Error(data.error.message || 'API request failed');
          }

          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            if (responseBox) {
              responseBox.innerHTML = `
                <div class="ai-output-formatted">
                  <div class="ai-meta-bar">
                    <span><i data-lucide="sparkles"></i> Gemini AI Response</span>
                    <button class="btn-icon-xs" onclick="window.clockTimerApp.copyAIResponse()"><i data-lucide="copy"></i> Copy</button>
                  </div>
                  <div class="ai-markdown-body" id="ai-copyable-text">${formatMarkdownSimple(reply)}</div>
                </div>
              `;
            }
            unlockAchievement('ach_ai_scholar');
          } else {
            throw new Error('No generated text in response');
          }
        } catch (err) {
          console.error(err);
          if (responseBox) {
            responseBox.innerHTML = `<div class="ai-error-box"><i data-lucide="alert-triangle"></i> AI Request Error: ${escapeHtml(err.message)}. Please verify your API key.</div>`;
          }
        } finally {
          btnSend.disabled = false;
          btnSend.innerHTML = '<i data-lucide="sparkles"></i> <span>Ask AI Assistant</span>';
          if (window.lucide) lucide.createIcons();
        }
      });
    }

    checkKeyConfigured();
  }

  function formatMarkdownSimple(text) {
    let html = escapeHtml(text)
      .replace(/^### (.*$)/gim, '<h4>$1</h4>')
      .replace(/^## (.*$)/gim, '<h3>$1</h3>')
      .replace(/^# (.*$)/gim, '<h2>$1</h2>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      .replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/gms, '<ul>$1</ul>')
      .replace(/\n\n/gim, '<p></p>')
      .replace(/\n/gim, '<br>');
    return html;
  }

  // --- 15. STAGE 4: SMART RECOMMENDATIONS ENGINE ---
  function computeSmartRecommendations() {
    const cardEl = document.getElementById('smart-recommendation-card');
    if (!cardEl) return;

    if (appState.subjects.length === 0) {
      cardEl.innerHTML = `<p>Add subjects to receive smart study recommendations.</p>`;
      return;
    }

    // Scoring formula:
    // Score = (Days Until Next Exam * -5) + (Unfinished Syllabus % * 0.8) + (Assignment Urgency * 15)
    let bestSubject = null;
    let highestScore = -9999;
    let reasonText = '';

    const today = new Date();

    appState.subjects.forEach(sub => {
      let score = 50;

      // Unfinished syllabus factor
      const chs = sub.chapters || [];
      const completed = chs.filter(c => c.status === 'completed').length;
      const unfinPct = chs.length > 0 ? (1 - completed / chs.length) * 100 : 50;
      score += unfinPct * 0.7;

      // Exam proximity
      const nextExam = appState.exams
        .filter(e => e.subjectId === sub.id)
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0];

      if (nextExam) {
        const days = Math.ceil((new Date(nextExam.date) - today) / (1000 * 60 * 60 * 24));
        if (days <= 7) score += (8 - days) * 20;
      }

      // Assignment urgency
      const pendingAs = appState.assignments.filter(a => a.subjectId === sub.id && a.status !== 'Completed');
      score += pendingAs.length * 15;

      if (score > highestScore) {
        highestScore = score;
        bestSubject = sub;
        if (nextExam) {
          const days = Math.ceil((new Date(nextExam.date) - today) / (1000 * 60 * 60 * 24));
          reasonText = `Upcoming ${nextExam.title} in ${days} days (${Math.round(unfinPct)}% syllabus pending)`;
        } else if (pendingAs.length > 0) {
          reasonText = `${pendingAs.length} active assignments pending`;
        } else {
          reasonText = `${Math.round(unfinPct)}% syllabus remaining`;
        }
      }
    });

    if (bestSubject) {
      cardEl.innerHTML = `
        <div class="rec-header">
          <span class="badge badge-warning"><i data-lucide="zap"></i> AI Priority Recommendation</span>
          <button class="btn-icon-xs" onclick="this.parentElement.parentElement.style.display='none'" title="Dismiss"><i data-lucide="x"></i></button>
        </div>
        <div class="rec-title" style="color: ${bestSubject.color}">${escapeHtml(bestSubject.name)}</div>
        <div class="rec-reason">${escapeHtml(reasonText)}</div>
        <div class="rec-actions">
          <button class="btn-primary-sm" onclick="window.clockTimerApp.startTimerForSubject('${bestSubject.id}', 'Focus on ${escapeHtml(bestSubject.name)}')">
            <i data-lucide="play"></i> Start 25m Focus Session
          </button>
        </div>
      `;
    }

    if (window.lucide) lucide.createIcons();
  }

  // --- 16. STAGE 4: PERSONALIZATION & THEMES ---
  function initPersonalization() {
    applyTheme(appState.settings.theme);
    applyAccent(appState.settings.accent);

    // Theme selector
    const themeSelect = document.getElementById('setting-theme-select');
    if (themeSelect) {
      themeSelect.value = appState.settings.theme;
      themeSelect.addEventListener('change', (e) => {
        appState.settings.theme = e.target.value;
        applyTheme(e.target.value);
        saveState();
      });
    }

    // Accent selector
    const accentSelect = document.getElementById('setting-accent-select');
    if (accentSelect) {
      accentSelect.value = appState.settings.accent;
      accentSelect.addEventListener('change', (e) => {
        appState.settings.accent = e.target.value;
        applyAccent(e.target.value);
        saveState();
      });
    }

    // Clock format selector
    const clockSelect = document.getElementById('setting-clock-format');
    if (clockSelect) {
      clockSelect.value = appState.settings.clockFormat;
      clockSelect.addEventListener('change', (e) => {
        appState.settings.clockFormat = e.target.value;
        saveState();
      });
    }

    // Seconds toggle
    const secToggle = document.getElementById('setting-show-seconds');
    if (secToggle) {
      secToggle.checked = appState.settings.showSeconds;
      secToggle.addEventListener('change', (e) => {
        appState.settings.showSeconds = e.target.checked;
        saveState();
      });
    }
  }

  function applyTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
  }

  function applyAccent(accentName) {
    document.documentElement.setAttribute('data-accent', accentName);
  }

  // --- 17. STAGE 4: DATA SAFETY, BACKUP & RESTORE ---
  function exportJSONBackup() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute("href", dataStr);
    dlAnchor.setAttribute("download", `clocktimer_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
    showToast('Complete backup exported safely as JSON!', 'success');
  }

  function importJSONBackup(fileInput) {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
      try {
        const parsed = JSON.parse(e.target.result);
        if (!parsed.subjects || !parsed.profile) {
          throw new Error('Invalid ClockTimer backup file structure.');
        }
        appState = deepMerge(defaultData, parsed);
        saveState();
        location.reload();
      } catch (err) {
        alert('Failed to restore backup: ' + err.message);
      }
    };
    reader.readAsText(file);
  }

  function resetAllData() {
    if (confirm('Are you sure you want to reset all ClockTimer data? This cannot be undone.')) {
      if (confirm('Please confirm once more: All subjects, logs, and progress will be reset.')) {
        localStorage.removeItem(STORAGE_KEY);
        location.reload();
      }
    }
  }

  // --- 18. UI HELPERS: TOASTS, CELEBRATION MODAL & NAVIGATION ---
  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    let icon = type === 'success' ? 'check-circle' : type === 'warning' ? 'alert-circle' : 'info';
    toast.innerHTML = `<i data-lucide="${icon}"></i> <span>${escapeHtml(message)}</span>`;
    container.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }

  function showCelebrationModal(title, message) {
    const modal = document.getElementById('modal-celebration');
    if (!modal) return;
    const titleEl = document.getElementById('celebration-title');
    const msgEl = document.getElementById('celebration-message');
    if (titleEl) titleEl.textContent = title;
    if (msgEl) msgEl.textContent = message;
    modal.classList.add('active');

    // Confetti particles generator
    burstConfetti();
  }

  function showLevelUpCelebration(newLevel) {
    showCelebrationModal(`Level Up! Level ${newLevel}`, `Congratulations! You unlocked the title "${getLevelTitle(newLevel)}" and bonus focus powers!`);
  }

  function burstConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas || !canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#6366f1', '#a855f7', '#ec4899', '#10b981', '#f59e0b', '#06b6d4'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 0.7) * 18,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vr: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    let frame = 0;
    function render() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.4; // gravity
        p.rotation += p.vr;
        p.alpha -= 0.012;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });

      frame++;
      if (frame < 90) {
        requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    render();
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --- 19. GLOBAL PUBLIC API FOR INLINE DOM HANDLERS ---
  window.clockTimerApp = {
    timer,
    appState: () => appState,
    logDistraction,
    exportCSVReport,
    printPDFReport,
    exportCalendarICS,
    exportJSONBackup,
    importJSONBackup,
    resetAllData,

    startTimerForSubject(subjectId, customPurpose) {
      timer.activeSubjectId = subjectId;
      if (customPurpose) timer.purposeText = customPurpose;
      const sub = appState.subjects.find(s => s.id === subjectId);
      if (sub && !customPurpose) timer.purposeText = `Studying ${sub.name}`;

      const purposeInput = document.getElementById('study-purpose-input');
      if (purposeInput) purposeInput.value = timer.purposeText;

      const subSelect = document.getElementById('timer-subject-select');
      if (subSelect) subSelect.value = subjectId;

      timer.reset();
      timer.start();

      // Switch view to Timer tab if needed
      switchTab('timer');
    },

    toggleChapterStatus(subjectId, chapterId, isCompleted) {
      const sub = appState.subjects.find(s => s.id === subjectId);
      if (!sub) return;
      const ch = sub.chapters.find(c => c.id === chapterId);
      if (ch) {
        ch.status = isCompleted ? 'completed' : 'not_started';
        saveState();
        renderSubjects();
        if (isCompleted) {
          awardXP(50, 'Completed Syllabus Topic');
          checkAchievements();
          showToast(`Topic marked completed! +50 XP`, 'success');
        }
      }
    },

    deleteChapter(subjectId, chapterId) {
      const sub = appState.subjects.find(s => s.id === subjectId);
      if (sub) {
        sub.chapters = sub.chapters.filter(c => c.id !== chapterId);
        saveState();
        renderSubjects();
      }
    },

    openAddChapterModal(subjectId) {
      const title = prompt('Enter new Chapter or Topic title:');
      if (title && title.trim()) {
        const sub = appState.subjects.find(s => s.id === subjectId);
        if (sub) {
          sub.chapters.push({
            id: 'ch_' + Date.now(),
            title: title.trim(),
            status: 'not_started'
          });
          saveState();
          renderSubjects();
          showToast('Chapter added!', 'success');
        }
      }
    },

    deleteSubject(subjectId) {
      if (confirm('Delete this subject and all its chapters?')) {
        appState.subjects = appState.subjects.filter(s => s.id !== subjectId);
        saveState();
        renderSubjects();
        showToast('Subject removed', 'info');
      }
    },

    deleteTimetableSlot(slotId) {
      appState.timetable = appState.timetable.filter(t => t.id !== slotId);
      saveState();
      renderTimetable();
    },

    deleteExam(examId) {
      appState.exams = appState.exams.filter(e => e.id !== examId);
      saveState();
      renderExams();
    },

    deleteAssignment(asId) {
      appState.assignments = appState.assignments.filter(a => a.id !== asId);
      saveState();
      renderAssignments();
    },

    updateAssignmentStatus(asId, newStatus) {
      const as = appState.assignments.find(a => a.id === asId);
      if (as) {
        as.status = newStatus;
        if (newStatus === 'Completed') {
          awardXP(40, 'Completed Assignment');
        }
        saveState();
        renderAssignments();
      }
    },

    copyAIResponse() {
      const el = document.getElementById('ai-copyable-text');
      if (el) {
        navigator.clipboard.writeText(el.innerText).then(() => {
          showToast('AI response copied to clipboard!', 'success');
        });
      }
    }
  };

  // --- 20. TAB NAVIGATION & INITIALIZATION ---
  function switchTab(tabId) {
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    document.querySelectorAll('.app-tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-${tabId}`);
    });
    // Trigger chart resize if navigating to analytics
    if (tabId === 'analytics') {
      setTimeout(renderAnalytics, 100);
    }
  }

  function bindEvents() {
    // Nav tabs
    document.querySelectorAll('.nav-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Timer control buttons
    const startBtn = document.getElementById('btn-timer-start');
    const pauseBtn = document.getElementById('btn-timer-pause');
    const resetBtn = document.getElementById('btn-timer-reset');
    const completeBtn = document.getElementById('btn-timer-complete');
    const focusStartBtn = document.getElementById('btn-focus-start');
    const focusResetBtn = document.getElementById('btn-focus-reset');
    const focusCompleteBtn = document.getElementById('btn-focus-complete');

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (timer.state === 'running' || timer.state === 'break') {
          timer.pause();
        } else {
          timer.start();
        }
      });
    }

    if (focusStartBtn) {
      focusStartBtn.addEventListener('click', () => {
        if (timer.state === 'running' || timer.state === 'break') {
          timer.pause();
        } else {
          timer.start();
        }
      });
    }

    if (resetBtn) resetBtn.addEventListener('click', () => timer.reset());
    if (focusResetBtn) focusResetBtn.addEventListener('click', () => timer.reset());

    if (completeBtn) completeBtn.addEventListener('click', () => timer.completeSession());
    if (focusCompleteBtn) focusCompleteBtn.addEventListener('click', () => timer.completeSession());

    // Timer mode toggles
    document.querySelectorAll('.timer-mode-pill').forEach(pill => {
      pill.addEventListener('click', (e) => {
        document.querySelectorAll('.timer-mode-pill').forEach(p => p.classList.remove('active'));
        e.currentTarget.classList.add('active');
        const mode = e.currentTarget.dataset.mode;
        const mins = parseInt(e.currentTarget.dataset.mins, 10);
        if (mode === 'stopwatch') {
          timer.mode = 'stopwatch';
        } else {
          timer.mode = 'countdown';
          timer.durationSec = mins * 60;
        }
        timer.reset();
      });
    });

    // Quick add minutes buttons
    document.querySelectorAll('.btn-add-min').forEach(btn => {
      btn.addEventListener('click', () => {
        const m = parseInt(btn.dataset.add, 10);
        timer.addMinutes(m);
      });
    });

    // Subject dropdown on timer
    const subSelect = document.getElementById('timer-subject-select');
    if (subSelect) {
      subSelect.addEventListener('change', (e) => {
        timer.activeSubjectId = e.target.value;
      });
    }

    // Distraction buttons
    const distBtn = document.getElementById('btn-log-distraction');
    const focusDistBtn = document.getElementById('btn-focus-distraction');

    function openDistractionPrompt() {
      const options = ['Social Media', 'Phone Call / Text', 'Daydreaming', 'Snack / Drink', 'Room Noise', 'Other'];
      const choice = prompt(`Select distraction reason:\n1. Social Media\n2. Phone Call / Text\n3. Daydreaming\n4. Snack / Water\n5. Room Noise\n6. Other\n\nEnter number (1-6) or reason:`, '1');
      if (choice) {
        let reason = options[0];
        const num = parseInt(choice, 10);
        if (num >= 1 && num <= options.length) {
          reason = options[num - 1];
        } else if (choice.trim()) {
          reason = choice.trim();
        }
        logDistraction(reason);
      }
    }

    if (distBtn) distBtn.addEventListener('click', openDistractionPrompt);
    if (focusDistBtn) focusDistBtn.addEventListener('click', openDistractionPrompt);

    // Modal close buttons
    document.querySelectorAll('.modal-close-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.currentTarget.closest('.modal-overlay').classList.remove('active');
      });
    });

    // Add subject form
    const formAddSubject = document.getElementById('form-add-subject');
    if (formAddSubject) {
      formAddSubject.addEventListener('submit', (e) => {
        e.preventDefault();
        const nameInput = document.getElementById('input-new-sub-name');
        const codeInput = document.getElementById('input-new-sub-code');
        const colorInput = document.getElementById('input-new-sub-color');

        if (nameInput && nameInput.value.trim()) {
          const newSub = {
            id: 'sub_' + Date.now(),
            name: nameInput.value.trim(),
            code: codeInput ? codeInput.value.trim().toUpperCase() : 'SUB',
            color: colorInput ? colorInput.value : '#6366f1',
            targetHours: 30,
            totalStudiedSec: 0,
            chapters: []
          };
          appState.subjects.push(newSub);
          saveState();
          renderSubjects();
          nameInput.value = '';
          if (codeInput) codeInput.value = '';
          document.getElementById('modal-add-subject').classList.remove('active');
          showToast(`Subject "${newSub.name}" created!`, 'success');
        }
      });
    }

    // Global keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
      if (e.code === 'Space') {
        e.preventDefault();
        if (timer.state === 'running' || timer.state === 'break') timer.pause();
        else timer.start();
      } else if (e.key === 'r' || e.key === 'R') {
        timer.reset();
      } else if (e.key === 'm' || e.key === 'M') {
        if (window.studySoundLab) window.studySoundLab.toggleMute();
      } else if (e.key === 'd' || e.key === 'D') {
        openDistractionPrompt();
      } else if (e.key === '?') {
        const modal = document.getElementById('modal-shortcuts');
        if (modal) modal.classList.add('active');
      }
    });
  }

  // Initial Boot
  window.addEventListener('DOMContentLoaded', () => {
    loadState();
    initLiveClock();
    initPurposeBar();
    initPersonalization();
    initDeepFocusMode();
    initBreathingAssistant();
    initSoundLabUI();
    initAIAssistant();
    bindEvents();

    renderPlanner();
    renderSubjects();
    renderProfileStats();
    renderAchievements();
    renderDistractionStats();
    renderAnalytics();
    computeSmartRecommendations();
    updateTimerUI();

    if (window.lucide) {
      lucide.createIcons();
    }
  });
})();
