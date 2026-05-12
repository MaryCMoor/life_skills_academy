// ==================== GAME STATE ====================

const GameState = {
    version: '2.0.0',
    
    player: {
        name: '',
        gender: '',
        age: 14,
        grade: 9,
        birthday: '',
        hasPhone: false,
        phoneNumber: ''
    },
    
    time: {
        minute: 0,
        hour: 7,
        day: 1, // 1=Monday, 7=Sunday
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
        groceries: 0,
        utilities: 0,
        rent: 800
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
    
    // ==================== INITIALIZATION ====================
    
    init() {
        console.log('🎮 GameState.init() called');
        this.generateDailyChores();
        
        // Set initial groceries for underage players
        if (this.player.age < 18) {
            this.adult.groceries = 100;
        }
        
        console.log('✅ GameState initialized successfully');
    },
    
    // ==================== BUSY SYSTEM ====================
    
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
            minute: Math.floor(totalMinutes % 60)
        };
        this.currentActivity = activityName;
        console.log(`🔒 Player busy with: ${activityName} until ${this.time.busyUntil.hour}:${this.time.busyUntil.minute.toString().padStart(2, '0')}`);
    },
    
    clearBusy() {
        this.time.busyUntil = null;
        this.currentActivity = null;
        console.log('✅ Player is now free');
    },
    
    // ==================== MONEY ====================
    
    addMoney(amount, source) {
        this.money.cash += amount;
        this.stats.totalMoneyEarned += amount;
        console.log(`💰 +$${amount} from ${source}`);
    },
    
    spendMoney(amount, reason) {
        if (this.money.cash >= amount) {
            this.money.cash -= amount;
            this.stats.totalMoneySpent += amount;
            console.log(`💸 -$${amount} for ${reason}`);
            return true;
        }
        return false;
    },
    
    // ==================== SKILLS ====================
    
    addSkill(skillName, amount) {
        if (this.skills[skillName] !== undefined) {
            this.skills[skillName] = Math.min(100, this.skills[skillName] + amount);
            console.log(`📈 ${skillName} +${amount} (now ${this.skills[skillName]})`);
        }
    },
    
    // ==================== CHORES ====================
    
    generateDailyChores() {
        const allChores = [
            { id: 'bed', name: 'Make Bed', time: 10, reward: 5, skill: 'cleaning' },
            { id: 'dishes', name: 'Wash Dishes', time: 20, reward: 8, skill: 'cleaning' },
            { id: 'vacuum', name: 'Vacuum Living Room', time: 30, reward: 10, skill: 'cleaning' },
            { id: 'trash', name: 'Take Out Trash', time: 10, reward: 5, skill: 'cleaning' }
        ];
        
        // Only assign chores if underage
        if (this.player.age < 18) {
            // Select 3 random chores
            const shuffled = allChores.sort(() => 0.5 - Math.random());
            this.daily.chores = shuffled.slice(0, 3).map(chore => ({
                ...chore,
                completed: false
            }));
        } else {
            this.daily.chores = [];
        }
        
        this.daily.completedToday = [];
        console.log(`✅ Generated ${this.daily.chores.length} chores for today`);
    },
    
    completeChore(choreId) {
        const chore = this.daily.chores.find(c => c.id === choreId);
        if (chore && !chore.completed) {
            chore.completed = true;
            this.daily.completedToday.push(choreId);
            this.stats.choresCompleted++;
            console.log(`✅ Completed chore: ${chore.name}`);
            return true;
        }
        return false;
    },
    
    // ==================== SCHOOL ====================
    
    completeHomework(subject) {
        const homework = this.school.homework.find(hw => hw.subject === subject);
        if (homework && !homework.completed) {
            homework.completed = true;
            this.school.grades[subject] = Math.min(100, this.school.grades[subject] + 5);
            this.stats.homeworkCompleted++;
            this.calculateGPA();
            console.log(`📚 Completed ${subject} homework`);
            return true;
        }
        return false;
    },
    
    calculateGPA() {
        const grades = Object.values(this.school.grades);
        const average = grades.reduce((a, b) => a + b, 0) / grades.length;
        
        // Convert to 4.0 scale
        if (average >= 93) this.school.gpa = 4.0;
        else if (average >= 90) this.school.gpa = 3.7;
        else if (average >= 87) this.school.gpa = 3.3;
        else if (average >= 83) this.school.gpa = 3.0;
        else if (average >= 80) this.school.gpa = 2.7;
        else if (average >= 77) this.school.gpa = 2.3;
        else if (average >= 73) this.school.gpa = 2.0;
        else if (average >= 70) this.school.gpa = 1.7;
        else if (average >= 67) this.school.gpa = 1.3;
        else if (average >= 65) this.school.gpa = 1.0;
        else this.school.gpa = 0.0;
        
        console.log(`📊 GPA updated: ${this.school.gpa.toFixed(2)}`);
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
            { start: 8, end: 8.83, name: 'Math' },
            { start: 9, end: 9.83, name: 'English' },
            { start: 10, end: 10.83, name: 'Science' },
            { start: 11, end: 11.5, name: 'Lunch' },
            { start: 11.5, end: 12.33, name: 'History' },
            { start: 12.5, end: 13.33, name: 'PE' }
        ];
        
        const currentTime = this.time.hour + (this.time.minute / 60);
        
        for (const period of periods) {
            if (currentTime >= period.start && currentTime < period.end) {
                return period;
            }
        }
        
        return null;
    },
    
    // ==================== TIME ====================
    
    advanceDay() {
        this.time.day++;
        if (this.time.day > 7) {
            this.time.day = 1;
        }
        
        this.time.date++;
        const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
        
        // Check for leap year
        if (this.time.month === 2 && this.time.year % 4 === 0) {
            daysInMonth[1] = 29;
        }
        
        if (this.time.date > daysInMonth[this.time.month - 1]) {
            this.time.date = 1;
            this.time.month++;
            
            if (this.time.month > 12) {
                this.time.month = 1;
                this.time.year++;
                
                // Birthday check
                const birthday = new Date(this.player.birthday);
                if (birthday.getMonth() + 1 === this.time.month && birthday.getDate() === this.time.date) {
                    this.player.age++;
                    console.log(`🎂 Happy Birthday! You are now ${this.player.age} years old!`);
                }
            }
        }
        
        this.stats.daysPlayed++;
        this.generateDailyChores();
        
        console.log(`📅 Advanced to day ${this.time.day}, ${this.time.month}/${this.time.date}/${this.time.year}`);
    },
    
    // ==================== ACHIEVEMENTS ====================
    
    addAchievement(name, description, icon) {
        if (!this.achievements.find(a => a.name === name)) {
            this.achievements.push({ name, description, icon, date: new Date() });
            console.log(`🏆 Achievement unlocked: ${icon} ${name}`);
            
            if (typeof UI !== 'undefined' && UI.showNotification) {
                UI.showNotification(`🏆 Achievement: ${icon} ${name}`, 'success');
            }
        }
    }
};

console.log('✅ state.js loaded - GameState ready');
