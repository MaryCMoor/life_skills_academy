// ==================== GAME STATE (FIXED v2.0.0) ====================

const GameState = {
    version: '2.0.0',
    
    player: {
        name: 'Player',
        gender: 'male',
        age: 14,
        grade: 9,
        birthday: { month: 1, day: 1 },
        hasPhone: false,
        phoneNumber: null
    },
    
    time: {
        minute: 0,
        hour: 7,
        day: 1,
        date: 1,
        month: 1,
        year: 2024,
        speed: 1,
        paused: false,
        busyUntil: null
    },
    
    money: {
        cash: 50,
        bank: 0,
        creditCard: false,
        creditBalance: 0,
        creditLimit: 0
    },
    
    school: {
        gpa: 3.0,
        grades: {
            Math: 85,
            English: 85,
            Science: 85,
            History: 85,
            PE: 85
        },
        homework: [],
        attendance: {},
        currentClass: null,
        tardies: 0,
        absences: 0,
        extracurriculars: []
    },
    
    work: {
        hasResume: false,
        currentJob: null,
        jobHistory: [],
        warnings: 0,
        onShift: false,
        shiftStartTime: null
    },
    
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
    
    daily: {
        chores: [],
        completedToday: []
    },
    
    adult: {
        apartment: null,
        bills: [],
        groceries: 100,
        utilities: 0,
        rent: 0
    },
    
    phone: {
        hasPhone: false,
        model: null,
        plan: null,
        monthlyBill: 0,
        lastBillDate: null,
        apps: {
            banking: false,
            jobSearch: false,
            schoolPortal: false,
            social: false
        }
    },
    
    entertainment: {
        friendships: {},
        socialEnergy: 100,
        lastHangout: null
    },
    
    currentActivity: null,
    
    stats: {
        totalMoneyEarned: 0,
        totalMoneySpent: 0,
        choresCompleted: 0,
        homeworkCompleted: 0,
        daysPlayed: 0,
        hoursWorked: 0,
        gamesPlayed: 0
    },
    
    achievements: [],
    
    // Initialize game state
    init() {
        console.log('🎮 GameState.init() called');
        
        // If player is under 18, set groceries to 100 (parents provide)
        if (this.player.age < 18) {
            this.adult.groceries = 100;
        }
        
        // Initialize daily chores
        this.generateDailyChores();
        
        console.log('✅ GameState initialized successfully');
    },
    
    // Generate daily chores
    generateDailyChores() {
        this.daily.chores = [
            { id: 'bed', name: 'Make Bed', time: 10, reward: 5, skill: 'cleaning' },
            { id: 'dishes', name: 'Do Dishes', time: 20, reward: 8, skill: 'cleaning' },
            { id: 'vacuum', name: 'Vacuum Room', time: 15, reward: 7, skill: 'cleaning' },
            { id: 'trash', name: 'Take Out Trash', time: 5, reward: 5, skill: 'cleaning' },
            { id: 'laundry', name: 'Do Laundry', time: 90, reward: 12, skill: 'laundry' }
        ];
        this.daily.completedToday = [];
    },
    
    // Activity management
    isBusy() {
        if (!this.time.busyUntil) return false;
        
        const currentMinutes = this.time.hour * 60 + this.time.minute;
        const busyMinutes = this.time.busyUntil.hour * 60 + this.time.busyUntil.minute;
        
        return currentMinutes < busyMinutes;
    },
    
    setBusy(hours, activityName) {
        const totalMinutes = this.time.hour * 60 + this.time.minute + (hours * 60);
        this.time.busyUntil = {
            hour: Math.floor(totalMinutes / 60) % 24,
            minute: totalMinutes % 60
        };
        this.currentActivity = activityName;
        console.log(`⏳ Busy until ${this.time.busyUntil.hour}:${this.time.busyUntil.minute} - ${activityName}`);
    },
    
    clearBusy() {
        this.time.busyUntil = null;
        this.currentActivity = null;
    },
    
    // Money management
    addMoney(amount, source = 'unknown') {
        this.money.cash += amount;
        this.stats.totalMoneyEarned += amount;
        console.log(`💰 +$${amount} (${source})`);
    },
    
    spendMoney(amount, reason = 'unknown') {
        if (this.money.cash >= amount) {
            this.money.cash -= amount;
            this.stats.totalMoneySpent += amount;
            console.log(`💸 -$${amount} (${reason})`);
            return true;
        }
        return false;
    },
    
    // Skills
    addSkill(skillName, amount) {
        if (this.skills[skillName] !== undefined) {
            this.skills[skillName] = Math.min(100, this.skills[skillName] + amount);
            console.log(`📈 ${skillName}: +${amount} (now ${this.skills[skillName]})`);
        }
    },
    
    // Chores
    completeChore(choreId) {
        if (!this.daily.completedToday.includes(choreId)) {
            this.daily.completedToday.push(choreId);
            this.stats.choresCompleted++;
            return true;
        }
        return false;
    },
    
    // School
    completeHomework(subject) {
        if (this.school.grades[subject]) {
            this.school.grades[subject] = Math.min(100, this.school.grades[subject] + 5);
            this.calculateGPA();
            this.stats.homeworkCompleted++;
        }
    },
    
    calculateGPA() {
        const grades = Object.values(this.school.grades);
        const total = grades.reduce((sum, grade) => sum + this.gradeToGPA(grade), 0);
        this.school.gpa = (total / grades.length).toFixed(2);
    },
    
    gradeToGPA(percent) {
        if (percent >= 90) return 4.0;
        if (percent >= 80) return 3.0;
        if (percent >= 70) return 2.0;
        if (percent >= 60) return 1.0;
        return 0.0;
    },
    
    // Time helpers
    isWeekday() {
        return this.time.day >= 1 && this.time.day <= 5;
    },
    
    isSchoolTime() {
        const hour = this.time.hour;
        return this.isWeekday() && hour >= 8 && hour < 14;
    },
    
    getCurrentPeriod() {
        if (!this.isSchoolTime()) return null;
        
        const hour = this.time.hour;
        const minute = this.time.minute;
        const currentTime = hour * 60 + minute;
        
        const periods = [
            { start: 8*60, end: 8*60+50, name: 'Math' },
            { start: 9*60, end: 9*60+50, name: 'English' },
            { start: 10*60, end: 10*60+50, name: 'Science' },
            { start: 11*60, end: 11*60+30, name: 'Lunch' },
            { start: 11*60+30, end: 12*60+20, name: 'History' },
            { start: 12*60+30, end: 13*60+20, name: 'PE' }
        ];
        
        for (let period of periods) {
            if (currentTime >= period.start && currentTime < period.end) {
                return period;
            }
        }
        
        return null;
    },
    
    advanceDay() {
        this.time.day = (this.time.day % 7) + 1;
        this.time.date++;
        
        // Handle month/year changes
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        if (this.time.date > daysInMonth[this.time.month - 1]) {
            this.time.date = 1;
            this.time.month++;
            if (this.time.month > 12) {
                this.time.month = 1;
                this.time.year++;
            }
        }
        
        this.stats.daysPlayed++;
    },
    
    // Achievements
    addAchievement(title, description, icon) {
        const exists = this.achievements.find(a => a.title === title);
        if (!exists) {
            this.achievements.push({ title, description, icon, date: new Date().toISOString() });
            console.log(`🏆 Achievement unlocked: ${title}`);
            if (typeof UI !== 'undefined') {
                UI.showNotification(`🏆 Achievement: ${title}`, 'success', 5000);
            }
        }
    }
};

// Debug commands
window.debugAddMoney = (amount) => {
    GameState.addMoney(amount, 'debug');
    if (typeof UI !== 'undefined') UI.updateStats();
};

window.debugSetAge = (age) => {
    GameState.player.age = age;
    GameState.player.grade = age - 5;
    console.log(`👤 Age set to ${age}`);
};

window.debugSkipTime = (hours) => {
    GameState.time.hour = (GameState.time.hour + hours) % 24;
    console.log(`⏰ Time advanced ${hours} hours`);
    if (typeof UI !== 'undefined') UI.updateStats();
};

console.log('✅ state.js loaded - GameState ready');
