# CLOCKTIMER — ULTIMATE PRODUCTIVITY UPGRADE

A complete, high-performance student productivity ecosystem engineered for deep work, syllabus tracking, timetable planning, and exam excellence.

Deployed at: **`https://vithunraj2007.github.io/clocktimer/`**  
Repository: **`https://github.com/vithunraj2007/vithunraj2007.github.io`**

---

## 🌟 Core Modules & Architecture

### 1. Core Timer & Live Clock
- **Real-Time Live Clock**: Digital hours:minutes:seconds with 12-hour (AM/PM) and 24-hour military toggles, pulsating colon animation, and live calendar date display.
- **Top-Center Purpose Bar**: Editable study purpose field (*"What are you studying right now?"*) preserved and prominent.
- **Top-Left Corner Hide/Show Toggle**: Instant eye icon toggle (`#btn-toggle-purpose`) to hide or display the purpose bar for an ultra-clean, minimal aesthetic.
- **Circular Animated Timer**: Smooth SVG circular progress ring with radial glow and real-time second countdown.
- **Flexible Modes**: 25m Pomodoro, 50m Deep Work, 90m Flow, 15m Sprint, and Stopwatch count-up mode.
- **Quick Controls**: +5m, +10m extensions, pause, resume, reset, and verified session completion.

### 2. Stage 1: Smart Study Planner
- **Daily & Weekly Timetable**: View and manage weekly scheduled study blocks by day and time with subject color badges.
- **Exam Countdown**: Live countdown to upcoming tests (days remaining) with urgency alerts (Critical `<3 days`, Warning `<7 days`).
- **Assignment Deadlines**: Track assignments with priorities (Urgent, High, Medium, Low) and progress statuses (Pending, In Progress, Completed).
- **iCalendar (.ics) Export**: One-click download of `.ics` calendar files to sync exam schedules with Google Calendar or Apple Calendar.

### 3. Stage 1: Subject & Syllabus Management
- **Subject CRUD**: Add and customize subjects with course codes, target hours, and custom colors.
- **Chapter & Topic Breakdown**: Check off chapters as *Not Started*, *In Progress*, or *Completed*.
- **Live Syllabus Calculation**: Auto-calculated syllabus completion percentage per subject and global dashboard meter.
- **Study Time Tracking**: Automatically accumulates study time per subject from verified completed focus sessions.

### 4. Stage 1: Deep Focus Mode
- Fullscreen distraction-free workspace (`F` shortcut or maximize button).
- Minimizes all UI chrome, sidebars, and navigation.
- Prominent glowing timer, study purpose header, and live clock.
- Quick distraction logger and break reminders.

### 5. Stage 2: Study Sound Lab Upgrade
- **100% Offline Procedural Audio**: Built using pure Web Audio API synthesis—requires **zero audio downloads or external mp3s**!
  - **Brown Noise**: Deep, calming low-frequency rumble ($1/f^2$).
  - **White Noise**: Crisp, broad-spectrum static masking.
  - **Pink Noise**: Balanced $1/f$ 7-pole filtered noise for reading and memory retention.
  - **Black Noise**: Near-silence sub-audible infrasonic sensory calm ($<55\text{ Hz}$).
  - **Rain & Thunderstorm**: Modulated droplet acoustics with distant rolling thunder.
  - **Ocean Waves**: Filtered pink noise modulated with an $0.085\text{ Hz}$ wave swell cycle.
  - **Forest Breeze**: Gentle wind whispering with resonant canopy breeze.
  - **Library & Café Ambience**: Warm, muffled acoustic room tones.
  - **Binaural Beats**: Dual oscillator synthesis for Alpha Waves ($10\text{ Hz}$) and Gamma Focus ($40\text{ Hz}$).
- **Custom Audio Mixer**: Independent volume sliders per track and master fader.
- **Presets & Sleep Timer**: Built-in soundscapes (*Deep Focus*, *Rainy Library*, *Night Sanctuary*) and configurable sleep timer ($15\text{m}$, $30\text{m}$, $45\text{m}$, $60\text{m}$) with smooth fade-out.

### 6. Stage 2: Distraction Tracker & Break Assistant
- **Distraction Logging**: One-click timestamped interruption logger with categorized triggers (*Social Media*, *Phone Call*, *Daydreaming*, *Snack*, *Noise*).
- **Daily Counters & Trends**: Tracks total interruptions and identifies your most common distraction triggers.
- **Focus Efficiency Score**: Dynamic percentage formula:
  $$\text{Focus Score} = \max\left(0, \min\left(100, \text{round}\left(100 \times \frac{\text{Study Time}}{\text{Study Time} + \text{Distractions} \times 300\text{s}}\right)\right)\right)$$
- **Guided 4-4-4-4 Box Breathing**: Animated expanding and contracting circle for stress reduction and calm focus during breaks.
- **20-20-20 Eye-Rest Rule**: Built-in reminders to look 20 feet away for 20 seconds.

### 7. Stage 3: Gamification & Achievements
- **Verified XP Engine**: Earn $+10\text{ XP}$ per minute studied. Anti-cheat prevents rewards for sessions under 60 seconds or duplicate IDs.
- **Streak Multipliers**: Daily streak tracking with flame badge and bonus XP rewards.
- **Leveling System**: Progression from Level 1 (*Novice Seeker*) to Level 50+ (*Legendary Mind*).
- **12+ Unlockable Badges**: *First Step*, *Pomodoro Pioneer*, *Deep Diver*, *Streak Titan*, *Zen Master*, *Sound Alchemist*, *Syllabus Crusher*, etc.
- **Celebration Effects**: Animated confetti burst on milestone completions and level-ups.

### 8. Stage 3: Advanced Analytics
- **Daily 7-Day Chart**: HTML5 Canvas bar chart tracking daily study minutes.
- **Subject Distribution**: Visual percentage breakdown of time spent across disciplines.
- **52-Week GitHub-Style Heatmap**: Annual consistency grid with multi-level intensity cells and hover tooltips.
- **Prime Focus Zone**: Analyzes productivity across Morning (5am-12pm), Afternoon (12pm-5pm), Evening (5pm-10pm), and Night (10pm-5am).
- **Data Exporting**: One-click CSV session logs and printable PDF reports.

### 9. Stage 4: AI Study Assistant (Google Gemini)
- Real Google Gemini API integration (Gemini 1.5 Flash).
- Secure client-side key storage in localStorage (never exposed or leaked).
- Clear, helpful setup prompt with link to Google AI Studio if no key is configured (no fake answers).
- Task modes:
  1. *Explain Topic Simply*
  2. *Generate 5 Revision Questions & Answers*
  3. *Create High-Yield Study Notes*
  4. *Revision Timetable Generator*
  5. *Topic Recommendations*

### 10. Stage 4: Smart Subject Recommendations
- Heuristic algorithm analyzing upcoming exam proximity, pending assignment deadlines, unfinished syllabus percentage, and days unstudied to recommend your highest-priority subject with a 1-click timer launch.

### 11. Personalization, Data Safety & Offline Sync
- **Themes**: Dark Slate, Modern Light, Cyberpunk Neon, Emerald Forest, Midnight AMOLED.
- **Accents**: Electric Indigo, Emerald Green, Mystic Violet, Rose Red, Warm Amber, Vibrant Cyan.
- **100% Offline-First**: Zero required logins or account creations.
- **Data Safety**: JSON backup export, JSON restore with schema validation, and factory reset.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start / Pause Timer |
| `R` | Reset Timer |
| `F` | Enter / Exit Deep Focus Mode |
| `M` | Mute / Unmute Audio |
| `D` | Log a Distraction |
| `Esc` | Exit Deep Focus or close modals |

---

## 🚀 Deployment Instructions

To publish changes to your GitHub Pages repository:

```bash
git add .
git commit -m "Upgrade ClockTimer to v2.0 ultimate student productivity ecosystem"
git push origin main
```
Your application will be live at `https://vithunraj2007.github.io/clocktimer/`.
