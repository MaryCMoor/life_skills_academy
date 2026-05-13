// ==================== TIME MANAGER ====================
// Controls game time, day/night cycle, events

const TimeManager = {
    speeds: {
        paused: 0,
        normal: 1,
        fast: 5,
        veryFast: 30
    },
    
    currentSpeed: 1,
    intervalId: null,
    
    init() {
        this.currentSpeed = this.speeds.normal;
        this.start();
        console.log('⏰ Time Manager initialized');
    },
    
    start() {
        if (this.intervalId) return;
        
        this.intervalId = setInterval(() => {
            if (!GameState.time.paused && this.currentSpeed > 0) {
                this.tick();
            }
        }, 1000 / this.currentSpeed);
    },
    
    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    },
    
    tick() {
        GameState.time.minute += 1;
        
        if (GameState.time.minute >= 60) {
            GameState.time.minute = 0;
            GameState.time.hour += 1;
            
            this.hourlyDecay();
        }
        
        if (GameState.time.hour >= 24) {
            GameState.time.hour = 0;
            GameState.advanceDay();
        }
        
        this.checkEvents();
        this.updateUI();
    },
    
    advanceTime(minutes) {
        if (typeof minutes !== 'number' || minutes < 0) return false;
        
        GameState.time.minute += minutes;
        
        while (GameState.time.minute >= 60) {
            GameState.time.minute -= 60;
            GameState.time.hour += 1;
            this.hourlyDecay();
        }
        
        while (GameState.time.hour >= 24) {
            GameState.time.hour -= 24;
            GameState.advanceDay();
        }
        
        this.updateUI();
        console.log(`⏰ Advanced time by ${minutes} minutes`);
        return true;
    },
    
    hourlyDecay() {
        GameState.needs.hunger = Math.max(0, GameState.needs.hunger - 2);
        GameState.needs.energy = Math.max(0, GameState.needs.energy - 1);
        GameState.needs.hygiene = Math.max(0, GameState.needs.hygiene - 0.5);
        GameState.needs.happiness = Math.max(0, GameState.needs.happiness - 0.5);
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
        
        // Clear busy status - FIXED
        if (GameState.isBusy()) {
            const busyMinutes = GameState.status.busyUntil.hour * 60 + GameState.status.busyUntil.minute;
            if (minutes >= busyMinutes) {
                const activity = GameState.status.busyActivity; // FIXED: was GameState.currentActivity
                GameState.clearBusy();
                if (activity) {
                    UI.showNotification(`✅ Finished: ${activity}`, 'success');
                }
            }
        }
    },
    
    updateUI() {
        const time = GameState.time;
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const timeStr = `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`;
        const dateStr = `${days[time.day]} ${months[time.month - 1]} ${time.date}, ${time.year}`;
        
        const timeEl = document.getElementById('gameTime');
        const dateEl = document.getElementById('gameDate');
        
        if (timeEl) timeEl.textContent = timeStr;
        if (dateEl) dateEl.textContent = dateStr;
        
        // Update needs bars
        Object.keys(GameState.needs).forEach(need => {
            const el = document.getElementById(`${need}Bar`);
            if (el) {
                const value = Math.max(0, Math.min(100, GameState.needs[need]));
                el.style.width = value + '%';
                
                if (value < 30) el.style.background = '#e74c3c';
                else if (value < 70) el.style.background = '#f39c12';
                else el.style.background = '#27ae60';
            }
        });
        
        // Update money display
        const cashEl = document.getElementById('playerCash');
        if (cashEl) {
            cashEl.textContent = Math.floor(GameState.money.cash);
        }
        
        // Update GPA
        const gpaEl = document.getElementById('playerGpa');
        if (gpaEl) {
            gpaEl.textContent = GameState.school.gpa.toFixed(1);
        }
    },
    
    setSpeed(speed) {
        if (this.speeds[speed] !== undefined) {
            this.currentSpeed = this.speeds[speed];
            this.stop();
            this.start();
            console.log(`⏰ Speed set to: ${speed}`);
        }
    },
    
    pause() {
        GameState.time.paused = true;
        console.log('⏸️ Time paused');
    },
    
    resume() {
        GameState.time.paused = false;
        console.log('▶️ Time resumed');
    },
    
    formatTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    },
    
    getTimeOfDay() {
        const hour = GameState.time.hour;
        if (hour >= 5 && hour < 12) return 'morning';
        if (hour >= 12 && hour < 17) return 'afternoon';
        if (hour >= 17 && hour < 21) return 'evening';
        return 'night';
    }
};

console.log('✅ time.js loaded');
