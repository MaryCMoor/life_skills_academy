// ==================== GAME STATE MANAGEMENT ====================

const GameState = {
    // Player Information
    player: {
        name: 'Alex',
        gender: 'male',
        age: 14,
        grade: 9,
        birthday: { month: 6, day: 15 },
        hasPhone: false,
        phoneNumber: null
    },
    
    // Time System
    time: {
        minute: 0,
        hour: 7,
        day: 1, // 1=Monday, 7=Sunday
        date: 1,
        month: 9, // September
        year: 1,
        speed: 1,
        paused: false,
        busyUntil: null // When player is busy (working, in class, etc)
    },
    
    // Financial
    money: {
        cash: 50,
        bank: 0,
        creditCard: null,
        creditBalance: 0,
        creditLimit: 500
    },
    
    // School
    school: {
        gpa: 0.0,
        grades: {
            Math: 70,
            English: 70,
            Science: 70,
            History: 70,
            PE: 70
        },
        homework: [],
        extracurriculars: [],
        tardies: 0,
        absences: 0,
        attendance: {},
        currentClass: null // Track current class session
    },
    
    // Work
    work: {
        hasResume: false,
        currentJob: null,
        jobHistory: [],
        warnings: 0,
        onShift: false,
        shiftStartTime: null
    },
    
    // Life Skills (0-100 scale)
    skills: {
        cooking: 0,
        cleaning: 0,
        laundry: 0,
        budgeting: 0,
        timeManagement: 0,
        checkWriting: 0,
        creditManagement: 0,
        bowling: 0,
        skating: 0
    },
    
    // Daily Tasks
    daily: {
        chores: [],
        completedToday: []
    },
    
    // Adult Life (18+)
    adult: {
        apartment: null,
        bills: [],
        groceries: 100,
        utilities: null,
        rent: 0
    },
    
    // Phone System
    phone: {
        hasPhone: false,
        model: null,
        plan: null, // 'basic' or 'premium'
        monthlyBill: 0,
        lastBillDate: null,
        apps: {
            banking: false,
            jobSearch: false,
            schoolPortal: false,
            social: true
        }
    },
    
    // Entertainment
    entertainment: {
        friendships: 0,
        socialEnergy: 100,
        lastHangout: null
    },
    
    // Tutorial Progress
    tutorials: {
        completed: [],
        current: null,
        shown: {}
    },
    
    // Inventory
    inventory: [],
    
    // Achievements
    achievements: [],
    
    // Statistics
    stats: {
        totalMoneyEarned: 0,
        totalMoneySpent: 0,
        choresCompleted: 0,
        homeworkCompleted: 0,
        daysPlayed: 0,
        hoursWorked: 0,
        gamesPlayed: 0
    },
    
    // Activity System
    currentActivity: null,
    
    // Save/Load Methods
    save() {
        try {
            const saveData = {
                version: '2.0.0',
                timestamp: new Date().toISOString(),
                state: this
            };
            
            localStorage.setItem('lifeSkillsAcademy', JSON.stringify(saveData));
            console.log('✓ Game saved successfully');
            
            if (window.UI) {
                UI.showNotification('Game saved!', 'success', 2000);
            }
            
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            if (window.UI) {
                UI.showNotification('Failed to save game!', 'error');
            }
            return false;
        }
    },
    
    load() {
        try {
            const saved = localStorage.getItem('lifeSkillsAcademy');
            
            if (!saved) {
                console.log('No save data found');
                return false;
            }
            
            const saveData = JSON.parse(saved);
            
            // Merge save data with current state
            Object.assign(this.player, saveData.state.player);
            Object.assign(this.time, saveData.state.time);
            Object.assign(this.money, saveData.state.money);
            Object.assign(this.school, saveData.state.school);
            Object.assign(this.work, saveData.state.work);
            Object.assign(this.skills, saveData.state.skills);
            Object.assign(this.daily, saveData.state.daily);
            Object.assign(this.adult, saveData.state.adult);
            Object.assign(this.phone, saveData.state.phone || {});
            Object.assign(this.entertainment, saveData.state.entertainment || {});
            Object.assign(this.tutorials, saveData.state.tutorials);
            this.inventory = saveData.state.inventory || [];
            this.achievements = saveData.state.achievements || [];
            Object.assign(this.stats, saveData.state.stats);
            
            console.log('✓ Game loaded from:', saveData.timestamp);
            return true;
            
        } catch (e) {
            console.error('Load failed:', e);
            return false;
        }
    },
    
    reset() {
        if (confirm('Are you sure? This will delete ALL your progress!')) {
            localStorage.removeItem('lifeSkillsAcademy');
            location.reload();
        }
    },
    
    // Helper Methods
    addMoney(amount, source = 'general') {
        this.money.cash += amount;
        this.stats.totalMoneyEarned += amount;
        console.log(`+$${amount} from ${source}`);
    },
    
    spendMoney(amount, reason = 'purchase') {
        if (this.money.cash >= amount) {
            this.money.cash -= amount;
            this.stats.totalMoneySpent += amount;
            console.log(`-$${amount} for ${reason}`);
            return true;
        }
        return false;
    },
    
    addSkill(skillName, amount) {
        if (this.skills[skillName] !== undefined) {
            this.skills[skillName] = Math.min(100, this.skills[skillName] + amount);
            console.log(`${skillName} skill: +${amount} (now ${this.skills[skillName]})`);
        }
    },
    
    completeChore(choreId) {
        if (!this.daily.completedToday.includes(choreId)) {
            this.daily.completedToday.push(choreId);
            this.stats.choresCompleted++;
            return true;
        }
        return false;
    },
    
    completeHomework(subject) {
        this.stats.homeworkCompleted++;
        if (this.school.grades[subject]) {
            this.school.grades[subject] = Math.min(100, this.school.grades[subject] + 2);
            this.calculateGPA();
        }
    },
    
    calculateGPA() {
        const grades = Object.values(this.school.grades);
        const average = grades.reduce((a, b) => a + b, 0) / grades.length;
        this.school.gpa = (average / 25).toFixed(2);
    },
    
    isBusy() {
        if (!this.time.busyUntil) return false;
        
        const currentMinutes = this.time.hour * 60 + this.time.minute;
        const busyMinutes = this.time.busyUntil.hour * 60 + this.time.busyUntil.minute;
        
        return currentMinutes < busyMinutes;
    },
    
    setBusy(hours, activityName) {
        const endHour = this.time.hour + hours;
        const endMinute = this.time.minute;
        
        this.time.busyUntil = {
            hour: endHour >= 24 ? endHour - 24 : endHour,
            minute: endMinute,
            day: endHour >= 24 ? this.time.day + 1 : this.time.day
        };
        
        this.currentActivity = activityName;
        UI.showNotification(`⏳ ${activityName} for ${hours} hour(s)...`, 'info', 3000);
    },
    
    clearBusy() {
        this.time.busyUntil = null;
        if (this.currentActivity) {
            UI.showNotification(`✅ Finished: ${this.currentActivity}`, 'success');
            this.currentActivity = null;
        }
    },
    
    advanceDay() {
        this.time.day++;
        if (this.time.day > 7) this.time.day = 1;
        this.time.date++;
        
        // Reset daily tasks
        this.daily.completedToday = [];
        
        // Reset social energy
        this.entertainment.socialEnergy = 100;
        
        // Check for birthday
        if (this.time.month === this.player.birthday.month && 
            this.time.date === this.player.birthday.day) {
            this.player.age++;
            console.log(`🎂 Happy Birthday! You're now ${this.player.age}!`);
            
            if (this.player.age === 18) {
                this.adult.groceries = 0;
                console.log('🎉 You\'re an adult now!');
            }
        }
        
        // Monthly rollover
        if (this.time.date > 30) {
            this.time.date = 1;
            this.time.month++;
            
            // Phone bill
            if (this.phone.hasPhone && this.phone.monthlyBill > 0) {
                this.adult.bills.push({
                    name: 'Cell Phone',
                    amount: this.phone.monthlyBill,
                    dueDate: this.time.date + 15,
                    paid: false
                });
            }
            
            // Credit card interest
            if (this.money.creditCard && this.money.creditBalance > 0) {
                this.money.creditBalance *= 1.02;
            }
            
            // Generate bills if have apartment
            if (this.adult.apartment) {
                this.generateMonthlyBills();
            }
            
            // Year rollover
            if (this.time.month > 12) {
                this.time.month = 1;
                this.time.year++;
                
                if (this.time.month === 9 && this.player.age < 18) {
                    this.player.grade++;
                    console.log(`📚 New school year! Now in grade ${this.player.grade}`);
                }
            }
        }
        
        this.stats.daysPlayed++;
    },
    
    generateMonthlyBills() {
        this.adult.bills = [];
        
        if (this.adult.apartment) {
            this.adult.bills.push({
                name: 'Rent',
                amount: this.adult.apartment.rent,
                dueDate: this.time.date + 5,
                paid: false
            });
            
            this.adult.bills.push({
                name: 'Electricity',
                amount: 50 + Math.floor(Math.random() * 30),
                dueDate: this.time.date + 10,
                paid: false
            });
            
            this.adult.bills.push({
                name: 'Water',
                amount: 30 + Math.floor(Math.random() * 20),
                dueDate: this.time.date + 10,
                paid: false
            });
        }
    },
    
    isWeekday() {
        return this.time.day >= 1 && this.time.day <= 5;
    },
    
    isSchoolTime() {
        if (!this.isWeekday()) return false;
        const minutes = this.time.hour * 60 + this.time.minute;
        return minutes >= 8 * 60 && minutes < 13 * 60 + 20;
    },
    
    getCurrentPeriod() {
        if (!this.isSchoolTime()) return null;
        
        const minutes = this.time.hour * 60 + this.time.minute;
        const schedule = [
            { name: 'Math', start: 8 * 60, end: 8 * 60 + 50 },
            { name: 'English', start: 9 * 60, end: 9 * 60 + 50 },
            { name: 'Science', start: 10 * 60, end: 10 * 60 + 50 },
            { name: 'Lunch', start: 11 * 60, end: 11 * 60 + 30 },
            { name: 'History', start: 11 * 60 + 30, end: 12 * 60 + 20 },
            { name: 'PE', start: 12 * 60 + 30, end: 13 * 60 + 20 }
        ];
        
        return schedule.find(p => minutes >= p.start && minutes < p.end) || null;
    },
    
    addAchievement(name, description, icon) {
        if (!this.achievements.find(a => a.name === name)) {
            this.achievements.push({
                name: name,
                description: description,
                icon: icon,
                date: new Date().toISOString()
            });
            console.log(`🏆 Achievement unlocked: ${name}`);
            if (window.UI) {
                UI.showAchievement({ name, description, icon });
            }
        }
    }
};

// Auto-save every 2 minutes
setInterval(() => {
    if (!GameState.time.paused) {
        GameState.save();
    }
}, 120000);

// Save before page unload
window.addEventListener('beforeunload', () => {
    GameState.save();
});
