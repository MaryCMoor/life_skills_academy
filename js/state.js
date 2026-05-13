// ==================== GAME STATE ====================

const GameState = {
    version: '2.0.0',
    
    // Constants
    ADULT_AGE: 18,
    MAX_SKILL: 100,
    MAX_GRADE: 100,
    MIN_GRADE: 0,
    
    player: {
        name: '',
        gender: '',
        age: 14,
        grade: 9,
        birthday: { month: 1, day: 1 },
        hasPhone: false,
        phoneNumber: ''
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
        cash: 100,
        bank: 0,
        creditCard: false,
        creditBalance: 0,
        creditLimit: 0
    },
    
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
        creditManagement: 0
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
    
    inventory: [],
    
    tutorials: {
        shown: {
            welcome: false,
            school: false,
            work: false,
            bank: false
        }
    },
    
    currentActivity: null,
    
    stats: {
        totalMoneyEarned: 0,
        totalMoneySpent: 0,
        choresCompleted: 0,
        homeworkCompleted: 0,
        daysPlayed: 0,
        hoursWorked: 0
    },
    
    achievements: [],
    
    // ==================== VALIDATION ====================
    
    validateNumber(value, min = -Infinity, max = Infinity) {
        if (typeof value !== 'number' || !isFinite(value)) {
            return false;
        }
        return value >= min && value <= max;
    },
    
    validateString(value, maxLength = 100) {
        if (typeof value !== 'string') {
            return false;
        }
        return value.length <= maxLength;
    },
    
    // ==================== BUSY SYSTEM ====================
    
    isBusy() {
        if (!this.time.busyUntil) return false;
        
        const currentMinutes = this.time.hour * 60 + this.time.minute;
        const busyMinutes = this.time.busyUntil.hour * 60 + this.time.busyUntil.minute;
        
        return currentMinutes < busyMinutes;
    },
    
    setBusy(hours, activityName) {
        if (!this.validateNumber(hours, 0, 24)) {
            console.error('Invalid busy hours:', hours);
            return false;
        }
        
        const totalMinutes = this.time.hour * 60 + this.time.minute + (hours * 60);
        this.time.busyUntil = {
            hour: Math.floor(totalMinutes / 60) % 24,
            minute: Math.floor(totalMinutes % 60)
        };
        this.currentActivity = activityName;
        console.log(`🔒 Busy: ${activityName} until ${this.time.busyUntil.hour}:${String(this.time.busyUntil.minute).padStart(2, '0')}`);
        return true;
    },
    
    clearBusy() {
        this.time.busyUntil = null;
        this.currentActivity = null;
    },
    
    // ==================== MONEY ====================
    
    addMoney(amount, source) {
        if (!this.validateNumber(amount, 0)) {
            console.error('Invalid money amount:', amount);
            return false;
        }
        
        this.money.cash += amount;
        this.stats.totalMoneyEarned += amount;
        console.log(`💰 +$${amount.toFixed(2)} from ${source}`);
        return true;
    },
    
    spendMoney(amount, reason) {
        if (!this.validateNumber(amount, 0)) {
            console.error('Invalid spend amount:', amount);
            return false;
        }
        
        if (this.money.cash >= amount) {
            this.money.cash -= amount;
            this.stats.totalMoneySpent += amount;
            console.log(`💸 -$${amount.toFixed(2)} for ${reason}`);
            return true;
        }
        
        return false;
    },
    
    // ==================== SKILLS ====================
    
    addSkill(skillName, amount) {
        if (!this.skills.hasOwnProperty(skillName)) {
            console.warn('Unknown skill:', skillName);
            return false;
        }
        
        if (!this.validateNumber(amount, 0)) {
            console.error('Invalid skill amount:', amount);
            return false;
        }
        
        this.skills[skillName] = Math.min(this.MAX_SKILL, this.skills[skillName] + amount);
        console.log(`📈 ${skillName} +${amount} (now ${this.skills[skillName]})`);
        return true;
    },
    
    // ==================== CHORES ====================
    
    generateDailyChores() {
        const allChores = [
            { id: 'bed', name: 'Make Bed', time: 10, reward: 5, skill: 'cleaning' },
            { id: 'dishes', name: 'Wash Dishes', time: 20, reward: 8, skill: 'cleaning' },
            { id: 'vacuum', name: 'Vacuum Living Room', time: 30, reward: 10, skill: 'cleaning' },
            { id: 'trash', name: 'Take Out Trash', time: 10, reward: 5, skill: 'cleaning' },
            { id: 'laundry', name: 'Do Laundry', time: 90, reward: 12, skill: 'laundry' }
        ];
        
        if (this.player.age < this.ADULT_AGE) {
            const shuffled = [...allChores].sort(() => 0.5 - Math.random());
            this.daily.chores = shuffled.slice(0, 3).map(chore => ({
                ...chore,
                done: false
            }));
        } else {
            this.daily.chores = [];
        }
        
        this.daily.completedToday = [];
    },
    
    completeChore(choreId) {
        const chore = this.daily.chores.find(c => c.id === choreId);
        if (chore && !chore.done) {
            chore.done = true;
            this.daily.completedToday.push(choreId);
            this.stats.choresCompleted++;
            return true;
        }
        return false;
    },
    
    // ==================== SCHOOL ====================
    
    completeHomework(subject) {
        const homework = this.school.homework.find(hw => hw.subject === subject && !hw.done);
        if (homework) {
            homework.done = true;
            
            if (this.school.grades[subject] !== undefined) {
                this.school.grades[subject] = Math.min(this.MAX_GRADE, this.school.grades[subject] + 5);
            }
            
            this.stats.homeworkCompleted++;
            this.calculateGPA();
            return true;
        }
        return false;
    },
    
    calculateGPA() {
        const grades = Object.values(this.school.grades);
        if (grades.length === 0) return;
        
        const average = grades.reduce((a, b) => a + b, 0) / grades.length;
        
        const GPA_SCALE = [
            { min: 93, gpa: 4.0 },
            { min: 90, gpa: 3.7 },
            { min: 87, gpa: 3.3 },
            { min: 83, gpa: 3.0 },
            { min: 80, gpa: 2.7 },
            { min: 77, gpa: 2.3 },
            { min: 73, gpa: 2.0 },
            { min: 70, gpa: 1.7 },
            { min: 67, gpa: 1.3 },
            { min: 65, gpa: 1.0 },
            { min: 0, gpa: 0.0 }
        ];
        
        for (const scale of GPA_SCALE) {
            if (average >= scale.min) {
                this.school.gpa = scale.gpa.toFixed(1);
                break;
            }
        }
    },
    
    isWeekday() {
        return this.time.day >= 1 && this.time.day <= 5;
    },
    
    isSchoolTime() {
        return this.isWeekday() && this.time.hour >= 8 && this.time.hour < 14;
    },
    
    getCurrentPeriod() {
        if (!this.isSchoolTime()) return null;
        
        const periods = [
            { start: 8.0, end: 8.83, name: 'Math' },
            { start: 9.0, end: 9.83, name: 'English' },
            { start: 10.0, end: 10.83, name: 'Science' },
            { start: 11.0, end: 11.5, name: 'Lunch' },
            { start: 11.5, end: 12.33, name: 'History' },
            { start: 12.5, end: 13.33, name: 'PE' }
        ];
        
        const currentTime = this.time.hour + (this.time.minute / 60);
        
        return periods.find(p => currentTime >= p.start && currentTime < p.end) || null;
    },
    
    // ==================== TIME ====================
    
    advanceDay() {
        this.time.day++;
        if (this.time.day > 7) {
            this.time.day = 1;
        }
        
        this.time.date++;
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        if (this.time.month === 2 && this.time.year % 4 === 0 && (this.time.year % 100 !== 0 || this.time.year % 400 === 0)) {
            daysInMonth[1] = 29;
        }
        
        if (this.time.date > daysInMonth[this.time.month - 1]) {
            this.time.date = 1;
            this.time.month++;
            
            if (this.time.month > 12) {
                this.time.month = 1;
                this.time.year++;
            }
        }
        
        // Birthday check
        if (this.player.birthday && 
            this.time.month === this.player.birthday.month && 
            this.time.date === this.player.birthday.day) {
            this.player.age++;
            console.log(`🎂 Happy Birthday! Now ${this.player.age} years old`);
        }
        
        this.stats.daysPlayed++;
        this.generateDailyChores();
    },
    
    // ==================== ACHIEVEMENTS ====================
    
    addAchievement(name, description, icon) {
        if (!this.validateString(name, 50) || !this.validateString(description, 200)) {
            console.error('Invalid achievement data');
            return false;
        }
        
        if (!this.achievements.find(a => a.name === name)) {
            this.achievements.push({ 
                name, 
                description, 
                icon, 
                date: new Date().toISOString() 
            });
            
            console.log(`🏆 Achievement: ${icon} ${name}`);
            
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification(`🏆 ${name}`, 'success');
            }
            
            return true;
        }
        
        return false;
    }
};

console.log('✅ state.js loaded');
