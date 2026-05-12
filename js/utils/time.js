// ==================== TIME SYSTEM ====================

const TimeManager = {
    interval: null,
    
    start() {
        this.stop(); // Clear any existing interval
        
        this.interval = setInterval(() => {
            if (!GameState.time.paused) {
                this.tick();
            }
        }, 1000 / GameState.time.speed);
    },
    
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },
    
    tick() {
        // Advance time by 1 minute
        GameState.time.minute++;
        
        if (GameState.time.minute >= 60) {
            GameState.time.minute = 0;
            GameState.time.hour++;
        }
        
        if (GameState.time.hour >= 24) {
            GameState.time.hour = 0;
            GameState.advanceDay();
            this.generateDailyTasks();
        }
        
        // Check for time-based events
        this.checkEvents();
        
        // Update UI
        this.updateDisplay();
    },
    
    checkEvents() {
        const time = GameState.time;
        const minutes = time.hour * 60 + time.minute;
        
        // School start warning
        if (minutes === 7 * 60 + 50 && GameState.isWeekday() && GameState.player.age < 18) {
            UI.showNotification('⚠️ School starts in 10 minutes!', 'warning');
        }
        
        // Late for school
        if (minutes === 8 * 60 + 5 && GameState.isWeekday() && GameState.player.age < 18) {
            const period = GameState.getCurrentPeriod();
            if (period && !GameState.school.attendance[period.name]) {
                GameState.school.tardies++;
                UI.showNotification('📚 You\'re TARDY for ' + period.name + '!', 'error');
            }
        }
        
        // Work shift reminder
        if (GameState.work.currentJob && minutes === 15 * 60 + 25) {
            UI.showNotification('💼 Work shift starts in 5 minutes!', 'warning');
        }
        
        // Late for work
        if (GameState.work.currentJob && minutes === 15 * 60 + 35) {
            GameState.work.warnings++;
            UI.showNotification('⚠️ You\'re LATE for work! Warning #' + GameState.work.warnings, 'error');
            
            if (GameState.work.warnings >= 3) {
                UI.showNotification('🚫 You\'ve been FIRED for being late too many times!', 'error');
                GameState.work.currentJob = null;
                GameState.work.warnings = 0;
            }
        }
        
        // Bill due date warnings
        GameState.adult.bills.forEach(bill => {
            if (!bill.paid && time.date === bill.dueDate - 3) {
                UI.showNotification(`💰 ${bill.name} bill due in 3 days!`, 'warning');
            }
            
            if (!bill.paid && time.date === bill.dueDate) {
                UI.showNotification(`⚠️ ${bill.name} bill is DUE TODAY!`, 'error');
            }
            
            // Overdue
            if (!bill.paid && time.date > bill.dueDate) {
                bill.amount *= 1.1; // 10% late fee
                UI.showNotification(`🚨 ${bill.name} is OVERDUE! Late fee applied.`, 'error');
            }
        });
    },
    
    generateDailyTasks() {
        // Generate chores based on age
        this.generateChores();
        
        // Generate homework if school day
        if (GameState.isWeekday() && GameState.player.age < 18) {
            this.generateHomework();
        }
        
        // Reset attendance
        GameState.school.attendance = {};
    },
    
    generateChores() {
        const allChores = [
            { id: 'bed', name: 'Make Bed', time: 10, reward: 5, skill: 'cleaning' },
            { id: 'dishes', name: 'Wash Dishes', time: 20, reward: 8, skill: 'cleaning' },
            { id: 'vacuum', name: 'Vacuum', time: 30, reward: 10, skill: 'cleaning' },
            { id: 'trash', name: 'Take Out Trash', time: 10, reward: 5, skill: 'cleaning' },
            { id: 'laundry', name: 'Do Laundry', time: 90, reward: 12, skill: 'laundry' },
            { id: 'mow', name: 'Mow Lawn', time: 60, reward: 20, skill: 'cleaning' }
        ];
        
        // Select 3-4 random chores
        const numChores = 3 + Math.floor(Math.random() * 2);
        GameState.daily.chores = [];
        
        const shuffled = allChores.sort(() => 0.5 - Math.random());
        for (let i = 0; i < numChores; i++) {
            GameState.daily.chores.push({ ...shuffled[i], done: false });
        }
    },
    
    generateHomework() {
        const subjects = ['Math', 'English', 'Science', 'History'];
        GameState.school.homework = subjects.map(subject => ({
            subject: subject,
            description: this.getHomeworkDescription(subject),
            time: 30 + Math.floor(Math.random() * 30),
            done: false
        }));
    },
    
    getHomeworkDescription(subject) {
        const descriptions = {
            Math: ['Algebra worksheet', 'Geometry problems', 'Word problems', 'Practice equations'],
            English: ['Essay writing', 'Read chapter', 'Grammar exercises', 'Book report'],
            Science: ['Lab report', 'Study for quiz', 'Research project', 'Worksheet'],
            History: ['Read chapter', 'Timeline activity', 'Essay questions', 'Study notes']
        };
        
        const options = descriptions[subject] || ['Complete assignment'];
        return options[Math.floor(Math.random() * options.length)];
    },
    
    updateDisplay() {
        const time = GameState.time;
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 
                       'July', 'August', 'September', 'October', 'November', 'December'];
        
        const dayName = days[time.day - 1];
        const monthName = months[time.month];
        
        const hour = time.hour === 0 ? 12 : time.hour > 12 ? time.hour - 12 : time.hour;
        const minute = time.minute.toString().padStart(2, '0');
        const ampm = time.hour >= 12 ? 'PM' : 'AM';
        
        const display = `${dayName}, ${monthName} ${time.date} - ${hour}:${minute} ${ampm}`;
        
        const element = document.getElementById('timeDisplay');
        if (element) {
            element.textContent = display;
        }
    },
    
    setSpeed(speed) {
        GameState.time.speed = speed;
        this.start(); // Restart with new speed
        
        // Update button states
        document.querySelectorAll('.time-btn:not(.pause)').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const speedBtn = document.getElementById(`speed${speed}`);
        if (speedBtn) {
            speedBtn.classList.add('active');
        }
    },
    
    togglePause() {
        GameState.time.paused = !GameState.time.paused;
        
        const btn = document.getElementById('pauseBtn');
        if (btn) {
            if (GameState.time.paused) {
                btn.textContent = '▶';
                btn.style.background = '#27ae60';
                btn.style.borderColor = '#27ae60';
            } else {
                btn.textContent = '⏸';
                btn.style.background = '#e74c3c';
                btn.style.borderColor = '#e74c3c';
            }
        }
    }
};
