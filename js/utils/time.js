// ==================== TIME MANAGER ====================
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
        
        if (minutes === 7 * 60 + 50 && GameState.isWeekday() && GameState.player.age < 18) {
            UI.showNotification('⚠️ School starts in 10 minutes!', 'warning');
        }
        
        if (GameState.isBusy()) {
            const busyMinutes = GameState.status.busyUntil.hour * 60 + GameState.status.busyUntil.minute;
            if (minutes >= busyMinutes) {
                const activity = GameState.status.busyActivity;
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
        
        const cashEl = document.getElementById('playerCash');
        if (cashEl) {
            cashEl.textContent = Math.floor(GameState.money.cash);
        }
        
        const gpaEl = document.getElementById('playerGpa');
        if (gpaEl) {
            gpaEl.textContent = GameState.school.gpa.toFixed(1);
        }
    },
    
    pause() {
        GameState.time.paused = true;
    },
    
    resume() {
        GameState.time.paused = false;
    }
};

console.log('✅ time.js loaded');
