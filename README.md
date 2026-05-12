# 🎮 Life Skills Academy

**Life Skills Academy** is an interactive 3D educational life simulation game designed for teenagers (ages 14-18) to learn essential life skills through gameplay. Navigate through daily life, manage responsibilities, develop skills, and prepare for adulthood in a safe, engaging environment.

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Status](https://img.shields.io/badge/status-active-success)

🌐 **Live Demo:** [https://marycmoor.github.io/life_skills_academy/](https://marycmoor.github.io/life_skills_academy/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Getting Started](#-getting-started)
- [How to Play](#-how-to-play)
- [Game Systems](#-game-systems)
- [Minigames](#-minigames)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### 🎯 Core Gameplay
- **Character Creation:** Customize your character (name, gender, age, birthday)
- **3D City Navigation:** Explore 10+ interactive locations in a rotating 3D environment
- **Time Management:** Real-time day/night cycle with scheduled activities
- **Skill Development:** Track progress in 9+ life skills (cooking, cleaning, budgeting, etc.)
- **Aging System:** Start as a 14-year-old and grow into adulthood

### 🏠 Life Simulation
- **Daily Chores:** Complete household tasks to earn money and build skills
- **School System:** Attend classes, complete homework, maintain GPA
- **Job Center:** Find employment, work shifts, earn wages
- **Banking:** Manage cash, open accounts, build credit
- **Cooking:** Learn recipes from sandwiches to pasta
- **Laundry:** Master the full washing cycle

### 🎮 Interactive Minigames
- **Make Bed:** Drag-and-drop bedding items in correct order
- **Wash Dishes:** Click to scrub dishes clean
- **Vacuum Floor:** WASD/Arrow keys to drive vacuum and collect dirt
- **Mow Lawn:** Grid-based tractor mowing game
- **Laundry Sorting:** Drag clothes to correct color baskets
- **Cooking Tutorials:** Step-by-step recipe instructions with safety tips
- **Check Writing:** Learn proper check writing with validation

### 📊 Progress Tracking
- **Stats Dashboard:** Monitor money, GPA, time, and day
- **Achievement System:** Unlock achievements for milestones
- **Save/Load System:** Auto-save every 2 minutes + manual save
- **Skill Meters:** Visual progress bars for all skills

---

## 🛠 Technology Stack

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox/grid
- **Vanilla JavaScript (ES6+)** - No frameworks, pure JS
- **Three.js (r128)** - 3D city visualization

### Architecture
- **Client-Side Only** - No backend required
- **localStorage** - Save game persistence
- **Modular Design** - Separated concerns (state, UI, locations, minigames)

### Development Tools
- **Git/GitHub** - Version control
- **GitHub Pages** - Free hosting
- **Python HTTP Server** - Local testing

---

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- For local development: Python 3.x or any HTTP server

### Installation

#### Option 1: Play Online (Recommended)
Visit: [https://marycmoor.github.io/life_skills_academy/](https://marycmoor.github.io/life_skills_academy/)

#### Option 2: Run Locally
```bash
# Clone the repository
git clone https://github.com/MaryCMoor/life_skills_academy.git

# Navigate to directory
cd life_skills_academy

# Start local server (Python)
python -m http.server 8000

# Or use Node.js http-server
npx http-server -p 8000

# Open browser
# Visit: http://localhost:8000
