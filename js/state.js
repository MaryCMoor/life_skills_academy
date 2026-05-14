// ==================== GAME STATE ====================

const GameState = {
    ADULT_AGE: 18,
    MAX_SKILL: 100,
    
    player: {
        name: 'Player',
        age: 13,
        grade: 7,
        birthday: { month: 1, day: 1 }
    },
    
    money: {
        cash: 50,
        bank: 0,
        debt: 0,
        creditCard: null,
        creditLimit: 0,
        creditBalance: 0
    },
    
    time: {
        year: 2020,
        month: 1,
        date: 1,
        day: 3,
        hour: 7,
        minute: 0,
        speed: 1,
        paused: false
    },
    
    school: {
        enrolled: true,
        gpa: 3.0,
        grades: {
            Math: 85,
            English: 85,
            Science: 85,
            History: 85,
            PE: 85
        },
        homework: [],
        extracurriculars: [],
        attendance: {},
        tardies: 0,
        absences: 0
    },
    
    work: {
        currentJob: null,
        jobHistory: [],
        applications: [],
        warnings: 0,
        onShift: false
    },
    
    daily: {
        chores: [
            { id: 'bed', name: 'Make Bed', done: false, reward: 5, skill: 'organization' },
            { id: 'dishes', name: 'Wash Dishes', done: false, reward: 8, skill: 'cleaning' },
            { id: 'vacuum', name: 'Vacuum', done: false, reward: 10, skill: 'cleaning' },
            { id: 'trash', name: 'Take Out Trash', done: false, reward: 5, skill: 'responsibility' },
            { id: 'laundry', name: 'Do Laundry', done: false, reward: 12, skill: 'laundry' }
        ]
    },
    
    taxes: {
        filedThisYear: false,
        filingDeadline: null,
        yearlyIncome: 0,
        w2Forms: [],
        taxHistory: [],
        refundsOwed: 0,
        owedTaxes: 0,
        lastFiledYear: null
    },
    
    investments: {
        portfolio: [],
        cashForInvesting: 0,
        totalInvested: 0,
        totalReturns: 0,
        transactions: []
    },
    
    needs: {
        hunger: 100,
        energy: 100,
        hygiene: 100,
        happiness: 100,
        health: 100,
        stress: 0,
        calories: 0,
        protein: 0,
        carbs: 0,
        fats: 0,
        vitamins: 0
    },
    
    skills: {
        cooking: 0,
        cleaning: 0,
        budgeting: 0,
        timeManagement: 0,
        communication: 0,
        organization: 0,
        responsibility: 0,
        laundry: 0,
        checkWriting: 0
    },
    
    housing: {
        type: 'parents',
        rentDue: 0,
        utilities: 0
    },
    
    adult: {
        apartment: null,
        rent: 0,
        groceries: 100,
        bills: []
    },
    
    fridge: [],
    
    inventory: [],
    achievements: [],
    tutorials: {},
    
    stats: {
        moneyEarned: 0,
        moneySpent: 0,
        hoursWorked: 0,
        homeworkCompleted: 0,
        choresCompleted: 0,
        mealsCooked: 0,
        daysPlayed: 0
    },
    
    status: {
        currentLocation: 'home',
        busy: false,
        busyUntil: null,
        busyActivity: null
    },
    
    stressWarningShown: false,
    
    // ==================== MONEY METHODS ====================
    addMoney(amount, source = 'unknown') {
        if (typeof amount !== 'number' || amount < 0) return false;
        this.money.cash += amount;
        this.stats.moneyEarned += amount;
        console.log(`+$${amount} from ${source}`);
        return true;
    },
    
    spendMoney(amount, purpose = 'unknown') {
        if (typeof amount !== 'number' || amount < 0) return false;
        if (this.money.cash < amount) {
            console.warn(`Insufficient funds: Need $${amount}, have $${this.money.cash}`);
            if (typeof UI !== 'undefined') {
                UI.showNotification(`❌ Need $${amount.toFixed(2)}`, 'error');
            }
            return false;
        }
        this.money.cash -= amount;
        this.stats.moneySpent += amount;
        console.log(`-$${amount} for ${purpose}`);
        return true;
    },
    
    // ==================== NEEDS METHODS ====================
    updateNeeds(changes) {
        Object.keys(changes).forEach(need => {
            if (this.needs.hasOwnProperty(need)) {
                this.needs[need] = Math.max(0, Math.min(100, this.needs[need] + changes[need]));
            }
        });
        console.log('Needs updated:', changes);
        return true;
    },
    
    // ==================== SKILL METHODS ====================
    addSkill(skillName, amount) {
        if (!this.skills.hasOwnProperty(skillName)) {
            console.error('Invalid skill:', skillName);
            return false;
        }
        this.skills[skillName] = Math.min(this.MAX_SKILL, this.skills[skillName] + amount);
        console.log(`+${amount} ${skillName} skill (now ${this.skills[skillName]})`);
        return true;
    },
    
    // ==================== CHORE METHODS ====================
    completeChore(choreId) {
        const chore = this.daily.chores.find(c => c.id === choreId);
        if (!chore) return false;
        chore.done = true;
        console.log(`✓ Completed chore: ${chore.name}`);
        return true;
    },
    
    resetChores() {
        this.daily.chores.forEach(chore => chore.done = false);
        console.log('Chores reset for new day');
    },
    
    generateDailyChores() {
        this.daily.chores.forEach(c => c.done = false);
    },
    
    // ==================== FRIDGE METHODS ====================
    addMealToFridge(mealName, nutrition) {
        const meal = {
            id: Date.now(),
            name: mealName,
            cookedDate: {
                year: this.time.year,
                month: this.time.month,
                date: this.time.date
            },
            expiryDate: this.calculateExpiryDate(3),
            nutrition: nutrition || {
                calories: 500,
                protein: 20,
                carbs: 60,
                fats: 15,
                vitamins: 30,
                hunger: 40
            }
        };
        
        this.fridge.push(meal);
        console.log(`🍽️ Added ${mealName} to fridge (expires in 3 days)`);
        return meal;
    },
    
    calculateExpiryDate(daysFromNow) {
        const currentDays = this.time.year * 365 + this.time.month * 30 + this.time.date;
        const expiryDays = currentDays + daysFromNow;
        
        return {
            year: Math.floor(expiryDays / 365),
            month: Math.floor((expiryDays % 365) / 30) + 1,
            date: (expiryDays % 30) || 1
        };
    },
    
    getDaysUntilExpiry(expiryDate) {
        const currentDays = this.time.year * 365 + this.time.month * 30 + this.time.date;
        const expiryDays = expiryDate.year * 365 + expiryDate.month * 30 + expiryDate.date;
        return expiryDays - currentDays;
    },
    
    checkFridgeExpiration() {
        const before = this.fridge.length;
        this.fridge = this.fridge.filter(meal => {
            const daysLeft = this.getDaysUntilExpiry(meal.expiryDate);
            if (daysLeft < 0) {
                console.log(`🗑️ ${meal.name} expired and was thrown out`);
                return false;
            }
            return true;
        });
        
        const expired = before - this.fridge.length;
        if (expired > 0 && typeof UI !== 'undefined') {
            UI.showNotification(`🗑️ ${expired} meal(s) expired in the fridge!`, 'warning');
        }
    },
    
    eatMeal(mealId) {
        const mealIndex = this.fridge.findIndex(m => m.id === mealId);
        if (mealIndex === -1) {
            console.error('Meal not found in fridge');
            return false;
        }
        
        const meal = this.fridge[mealIndex];
        const daysLeft = this.getDaysUntilExpiry(meal.expiryDate);
        
        if (daysLeft < 0) {
            if (typeof UI !== 'undefined') {
                UI.showNotification('❌ This meal has expired!', 'error');
            }
            this.fridge.splice(mealIndex, 1);
            return false;
        }
        
        // Apply nutrition
        this.needs.hunger = Math.min(100, this.needs.hunger + meal.nutrition.hunger);
        this.needs.calories += meal.nutrition.calories;
        this.needs.protein += meal.nutrition.protein;
        this.needs.carbs += meal.nutrition.carbs;
        this.needs.fats += meal.nutrition.fats;
        this.needs.vitamins += meal.nutrition.vitamins;
        this.needs.happiness = Math.min(100, this.needs.happiness + 10);
        this.needs.energy = Math.min(100, this.needs.energy + 5);
        
        // Remove from fridge
        this.fridge.splice(mealIndex, 1);
        
        if (typeof UI !== 'undefined') {
            UI.showNotification(`🍽️ Ate ${meal.name}! +${meal.nutrition.hunger} Hunger`, 'success');
        }
        
        console.log(`Ate ${meal.name}`);
        return true;
    },
    
    // ==================== STRESS METHODS ====================
    checkStressLevel() {
        if (this.needs.stress > 80 && !this.stressWarningShown) {
            if (typeof UI !== 'undefined') {
                UI.showNotification('🚨 BURNOUT WARNING! You\'re extremely stressed! Rest is needed!', 'error', 7000);
            }
            this.stressWarningShown = true;
        } else if (this.needs.stress < 60) {
            this.stressWarningShown = false;
        }
        
        if (this.needs.stress > 70) {
            if (Math.random() < 0.3) {
                Object.keys(this.school.grades).forEach(subject => {
                    this.school.grades[subject] = Math.max(0, this.school.grades[subject] - 0.5);
                });
            }
        }
    },
    
    // ==================== BUSY STATUS ====================
    setBusy(activity, durationMinutes) {
        this.status.busy = true;
        this.status.busyActivity = activity;
        this.status.busyUntil = {
            hour: this.time.hour + Math.floor(durationMinutes / 60),
            minute: this.time.minute + (durationMinutes % 60)
        };
        console.log(`Now busy: ${activity}`);
        return true;
    },
    
    clearBusy() {
        this.status.busy = false;
        this.status.busyActivity = null;
        this.status.busyUntil = null;
        console.log('No longer busy');
    },
    
    isBusy() {
        if (!this.status.busy) return false;
        if (!this.status.busyUntil) {
            this.clearBusy();
            return false;
        }
        const currentMinutes = this.time.hour * 60 + this.time.minute;
        const busyMinutes = this.status.busyUntil.hour * 60 + this.status.busyUntil.minute;
        if (currentMinutes >= busyMinutes) {
            this.clearBusy();
            return false;
        }
        return true;
    },
    
    // ==================== TIME HELPERS ====================
    isWeekday() {
        return this.time.day >= 1 && this.time.day <= 5;
    },
    
    isSchoolTime() {
        if (!this.isWeekday() || this.player.age >= this.ADULT_AGE) return false;
        const minutes = this.time.hour * 60 + this.time.minute;
        return minutes >= 8 * 60 && minutes < 15 * 60;
    },
    
    getCurrentPeriod() {
        if (!this.isSchoolTime()) return null;
        const minutes = this.time.hour * 60 + this.time.minute;
        const periods = [
            { start: 480, end: 530, name: 'Math' },
            { start: 540, end: 590, name: 'English' },
            { start: 600, end: 650, name: 'Science' },
            { start: 660, end: 690, name: 'Lunch' },
            { start: 690, end: 740, name: 'History' },
            { start: 750, end: 800, name: 'PE' }
        ];
        return periods.find(p => minutes >= p.start && minutes < p.end) || null;
    },
    
    advanceDay() {
        this.time.date++;
        this.time.day++;
        if (this.time.day > 6) this.time.day = 0;
        
        const daysInMonth = new Date(this.time.year, this.time.month, 0).getDate();
        if (this.time.date > daysInMonth) {
            this.time.date = 1;
            this.time.month++;
            if (typeof StockMarket !== 'undefined' && StockMarket.advanceMarket) {
                StockMarket.advanceMarket();
            }
        }
        
        if (this.time.month > 12) {
            this.time.month = 1;
            this.time.year++;
            this.taxes.filedThisYear = false;
        }
        
        if (this.time.month === this.player.birthday.month && this.time.date === this.player.birthday.day) {
            this.player.age++;
            if (typeof UI !== 'undefined') {
                UI.showNotification(`🎂 Happy Birthday! Age ${this.player.age}`, 'success', 5000);
            }
            if (this.player.age >= 14 && this.player.age <= 18 && this.time.month >= 6) {
                this.player.grade++;
            }
        }
        
        this.resetChores();
        if (this.adult?.apartment) {
            this.adult.groceries = Math.max(0, this.adult.groceries - 15);
        }
        
        this.needs.calories = 0;
        this.needs.protein = 0;
        this.needs.carbs = 0;
        this.needs.fats = 0;
        this.needs.vitamins = 0;
        
        this.checkFridgeExpiration();
        
        this.stats.daysPlayed++;
        
        console.log(`📅 New day: ${this.time.year}-${this.time.month}-${this.time.date}`);
    },
    
    // ==================== SCHOOL METHODS ====================
    calculateGPA() {
        const grades = Object.values(this.school.grades);
        const avg = grades.reduce((s, g) => s + g, 0) / grades.length;
        
        if (avg >= 93) this.school.gpa = 4.0;
        else if (avg >= 90) this.school.gpa = 3.7;
        else if (avg >= 87) this.school.gpa = 3.3;
        else if (avg >= 83) this.school.gpa = 3.0;
        else if (avg >= 80) this.school.gpa = 2.7;
        else if (avg >= 77) this.school.gpa = 2.3;
        else if (avg >= 73) this.school.gpa = 2.0;
        else if (avg >= 70) this.school.gpa = 1.7;
        else this.school.gpa = 1.0;
        
        this.school.gpa = parseFloat(this.school.gpa.toFixed(1));
        return this.school.gpa;
    },
    
    completeHomework(subject) {
        if (this.school.grades?.[subject]) {
            this.school.grades[subject] = Math.min(100, this.school.grades[subject] + 2);
            this.calculateGPA();
        }
        this.stats.homeworkCompleted++;
    },
    
    // ==================== ACHIEVEMENT METHODS ====================
    addAchievement(name, description, icon) {
        const exists = this.achievements.some(a => a.name === name);
        if (exists) return false;
        
        this.achievements.push({
            name: name,
            description: description,
            icon: icon,
            dateEarned: new Date().toISOString()
        });
        
        console.log(`🏆 Achievement: ${name}`);
        if (typeof UI !== 'undefined') {
            UI.showNotification(`🏆 ${name}`, 'success');
        }
        return true;
    },
    
    // ==================== SAVE/LOAD ====================
    getSaveData() {
        return JSON.parse(JSON.stringify(this));
    },
    
    loadSaveData(data) {
        try {
            Object.assign(this, data);
            console.log('✓ Game state loaded');
            return true;
        } catch (error) {
            console.error('Failed to load save data:', error);
            return false;
        }
    },
    
    reset() {
        console.log('Resetting game state...');
        location.reload();
    }
};

console.log('✅ state.js loaded');
