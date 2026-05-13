// ==================== TIME SYSTEM ====================

const TimeManager = {
    interval: null,
    baseInterval: 1000, // 1 second
    
    start() {
        this.stop(); // Clear any existing interval
        
        if (GameState.time.speed <= 0) {
            console.warn('Invalid speed, setting to 1');
            GameState.time.speed = 1;
        }
        
        const intervalTime = this.baseInterval / GameState.time.speed;
        
        this.interval = setInterval(() => {
            if (!GameState.time.paused) {
                this.tick();
            }
        }, intervalTime);
        
        console.log(`⏰ Time started at ${GameState.time.speed}x speed`);
    },
    
    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    },
    
    tick() {
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
        
        // Check for timed events
        this.checkEvents();
        
        // Update display
        this.updateDisplay();
    },
    
    checkEvents() {
        const time = GameState.time;
        const minutes = time.hour * 60 + time.minute;
        
        // School warnings
        if (minutes === 7 * 60 + 50 && GameState.isWeekday() && GameState.player.age < GameState.ADULT_AGE) {
            UI.showNotification('⚠️ School starts in 10 minutes!', 'warning');
        }
        
        // School tardy
        if (minutes === 8 * 60 + 5 && GameState.isWeekday() && GameState.player.age < GameState.ADULT_AGE) {
            const period = GameState.getCurrentPeriod();
            if (period && period.name !== 'Lunch' && !GameState.school.attendance[period.name]) {
                GameState.school.tardies++;
                UI.showNotification(`📚 TARDY for ${period.name}!`, 'error');
            }
        }
        
        // Work warnings
        if (GameState.work.currentJob && minutes === 15 * 60 + 25) {
            UI.showNotification('💼 Work shift starts in 5 minutes!', 'warning');
        }
        
        if (GameState.work.currentJob && minutes === 15 * 60 + 35 && !GameState.work.onShift) {
            GameState.work.warnings++;
            UI.showNotification(`⚠️ LATE for work! Warning ${GameState.work.warnings}/3`, 'error');
            
            if (GameState.work.warnings >= 3) {
                UI.showNotification('🚫 FIRED for excessive tardiness!', 'error');
                GameState.work.currentJob = null;
                GameState.work.warnings = 0;
            }
        }
        
        // Bill reminders (for adults)
        if (GameState.player.age >= GameState.ADULT_AGE && time.hour === 9 && time.minute === 0) {
            GameState.adult.bills.forEach(bill => {
                if (!bill.paid) {
                    const daysUntilDue = bill.dueDate - time.date;
                    
                    if (daysUntilDue === 3) {
                        UI.showNotification(`💰 ${bill.name} due in 3 days!`, 'warning');
                    } else if (daysUntilDue === 0) {
                        UI.showNotification(`⚠️ ${bill.name} DUE TODAY!`, 'error');
                    } else if (daysUntilDue < 0) {
                        bill.amount *= 1.05; // 5% late fee
                        UI.showNotification(`🚨 ${bill.name} OVERDUE! Late fee added.`, 'error');
                    }
                }
            });
        }
        
        // Grocery warning
        if (GameState.player.age >= GameState.ADULT_AGE && time.hour === 18 && time.minute === 0) {
            if (GameState.adult.groceries < 20) {
                UI.showNotification('🛒 Running low on groceries!', 'warning');
            }
        }
        
        // Clear busy status
        if (GameState.isBusy()) {
            const busyMinutes = GameState.time.busyUntil.hour * 60 + GameState.time.busyUntil.minute;
            if (minutes >= busyMinutes) {
                const activity = GameState.currentActivity;
                GameState.clearBusy();
                if (activity) {
                    UI.showNotification(`✅ Finished: ${activity}`, 'success');
                }
            }
        }
    },
    
    generateDailyTasks() {
        console.log('📋 Generating daily tasks...');
        
        // Generate chores
        GameState.generateDailyChores();
        
        // Generate homework
        if (GameState.isWeekday() && GameState.player.age < GameState.ADULT_AGE) {
            this.generateHomework();
        }
        
        // Reset school attendance
        GameState.school.attendance = {};
        
        // Monthly bills for adults
        if (GameState.player.age >= GameState.ADULT_AGE && GameState.time.date === 1) {
            this.generateMonthlyBills();
        }
    },
    
    generateHomework() {
        const subjects = Object.keys(GameState.school.grades);
        
        GameState.school.homework = subjects.map(subject => ({
            subject: subject,
            description: this.getHomeworkDescription(subject),
            time: 30 + Math.floor(Math.random() * 30),
            done: false
        }));
        
        console.log(`📚 Generated homework for ${subjects.length} subjects`);
    },
    
    getHomeworkDescription(subject) {
        const descriptions = {
            Math: ['Algebra worksheet', 'Geometry problems', 'Word problems', 'Practice equations', 'Chapter review'],
            English: ['Essay writing', 'Read chapter 5', 'Grammar exercises', 'Book report', 'Vocabulary study'],
            Science: ['Lab report', 'Study for quiz', 'Research project', 'Worksheet', 'Chapter questions'],
            History: ['Read chapter', 'Timeline activity', 'Essay questions', 'Study notes', 'Map work'],
            PE: ['Fitness log', 'Health worksheet', 'Sports rules study', 'Wellness plan', 'Activity report']
        };
        
        const options = descriptions[subject] || ['Complete assignment'];
        return options[Math.floor(Math.random() * options.length)];
    },
    
    generateMonthlyBills() {
        GameState.adult.bills = [];
        
        // Rent bill
        if (GameState.adult.apartment) {
            GameState.adult.bills.push({
                name: 'Rent',
                amount: GameState.adult.apartment.rent,
                dueDate: 5,
                paid: false
            });
        }
        
        // Utilities (if adult)
        if (GameState.adult.apartment) {
            GameState.adult.bills.push({
                name: 'Electricity',
                amount: 50 + Math.floor(Math.random() * 30),
                dueDate: 15,
                paid: false
            });
            
            GameState.adult.bills.push({
                name: 'Water',
                amount: 30 + Math.floor(Math.random() * 20),
                dueDate: 15,
                paid: false
            });
        }
        
        // Phone bill
        if (GameState.player.hasPhone) {
            GameState.adult.bills.push({
                name: 'Phone',
                amount: 40,
                dueDate: 10,
                paid: false
            });
        }
        
        // Credit card bill
        if (GameState.money.creditBalance > 0) {
            const minPayment = Math.max(25, GameState.money.creditBalance * 0.02);
            GameState.adult.bills.push({
                name: 'Credit Card (min payment)',
                amount: minPayment,
                dueDate: 20,
                paid: false
            });
        }
        
        console.log(`💰 Generated ${GameState.adult.bills.length} bills for this month`);
    },
    
    updateDisplay() {
        const time = GameState.time;
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const dayName = days[time.day - 1] || days[0];
        const monthName = months[time.month] || 'Jan';
        
        let hour = time.hour === 0 ? 12 : time.hour > 12 ? time.hour - 12 : time.hour;
        const minute = String(time.minute).padStart(2, '0');
        const ampm = time.hour >= 12 ? 'PM' : 'AM';
        
        const display = `${dayName}, ${monthName} ${time.date} - ${hour}:${minute} ${ampm}`;
        
        const element = document.getElementById('timeDisplay');
        if (element) {
            element.textContent = display;
        }
    },
    
    setSpeed(speed) {
        if (![1, 3, 10].includes(speed)) {
            console.error('Invalid speed:', speed);
            return;
        }
        
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
        
        console.log(`⏩ Speed set to ${speed}x`);
    },
    
    togglePause() {
        GameState.time.paused = !GameState.time.paused;
        
        const btn = document.getElementById('pauseBtn');
        if (btn) {
            if (GameState.time.paused) {
                btn.textContent = '▶';
                btn.classList.remove('pause');
                btn.classList.add('active');
                btn.style.background = '#27ae60';
                btn.style.borderColor = '#27ae60';
            } else {
                btn.textContent = '⏸';
                btn.classList.remove('active');
                btn.classList.add('pause');
                btn.style.background = '#e74c3c';
                btn.style.borderColor = '#e74c3c';
            }
        }
        
        console.log(GameState.time.paused ? '⏸ Paused' : '▶️ Resumed');
    }
};

console.log('✅ time.js loaded');
