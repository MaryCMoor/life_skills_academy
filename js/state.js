// ==================== GAME STATE ====================
// Central state management for the entire game

const GameState = {
    // Constants
    ADULT_AGE: 18,
    MAX_SKILL: 100,
    
    // ==================== PLAYER ====================
    player: {
        name: 'Player',
        age: 13,
        grade: 7,
        birthday: { month: 1, day: 1 }
    },
    
    // ==================== MONEY ====================
    money: {
        cash: 50,
        bank: 0,
        debt: 0
    },
    
    // ==================== TIME ====================
    time: {
        year: 2020,
        month: 1,
        date: 1,
        day: 3, // 0=Sun, 1=Mon, etc.
        hour: 7,
        minute: 0
    },
    
    // ==================== SCHOOL ====================
    school: {
        enrolled: true,
        gpa: 3.0,
        homework: [],
        extracurriculars: [],
        attendance: 100
    },
    
    // ==================== WORK ====================
    work: {
        currentJob: null,
        jobHistory: [],
        applications: []
    },
    
    // ==================== DAILY ACTIVITIES ====================
    daily: {
        chores: [
            { id: 'bed', name: 'Make Bed', done: false, reward: 5, skill: 'organization' },
            { id: 'dishes', name: 'Wash Dishes', done: false, reward: 8, skill: 'cleaning' },
            { id: 'vacuum', name: 'Vacuum', done: false, reward: 10, skill: 'cleaning' },
            { id: 'trash', name: 'Take Out Trash', done: false, reward: 5, skill: 'responsibility' },
            { id: 'laundry', name: 'Do Laundry', done: false, reward: 12, skill: 'laundry' }
        ]
    },
    
    // ==================== TAXES ====================
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
    
    // ==================== STOCKS & INVESTMENTS ====================
    investments: {
        portfolio: [],
        cashForInvesting: 0,
        totalInvested: 0,
        totalReturns: 0,
        transactions: []
    },
    
    // ==================== NEEDS ====================
    needs: {
        hunger: 100,
        energy: 100,
        hygiene: 100,
        happiness: 100
    },
    
    // ==================== SKILLS ====================
    skills: {
        cooking: 0,
        cleaning: 0,
        budgeting: 0,
        timeManagement: 0,
        communication: 0,
        organization: 0,
        responsibility: 0,
        laundry: 0
    },
    
    // ==================== HOUSING ====================
    housing: {
        type: 'parents',
        rentDue: 0,
        utilities: 0
    },
    
    // ==================== INVENTORY ====================
    inventory: {
        items: []
    },
    
    // ==================== ACHIEVEMENTS ====================
    achievements: [],
    
    // ==================== STATS ====================
    stats: {
        moneyEarned: 0,
        moneySpent: 0,
        hoursWorked: 0,
        homeworkCompleted: 0,
        choresCompleted: 0
    },
    
    // ==================== GAME STATUS ====================
    status: {
        currentLocation: 'home',
        busy: false,
        busyUntil: null,
        busyActivity: null
    },
    
    // ==================== VALIDATION METHODS ====================
    validateNumber(value, min = -Infinity, max = Infinity) {
        if (typeof value !== 'number' || isNaN(value)) {
            console.error('Invalid number:', value);
            return false;
        }
        if (value < min || value > max) {
            console.error(`Number ${value} out of range [${min}, ${max}]`);
            return false;
        }
        return true;
    },
    
    validateString(value, maxLength = 1000) {
        if (typeof value !== 'string') {
            console.error('Invalid string:', value);
            return false;
        }
        if (value.length > maxLength) {
            console.error(`String too long: ${value.length} > ${maxLength}`);
            return false;
        }
        return true;
    },
    
    // ==================== MONEY METHODS ====================
    addMoney(amount, source = 'unknown') {
        if (!this.validateNumber(amount, 0)) return false;
        
        this.money.cash += amount;
        this.stats.moneyEarned += amount;
        console.log(`+$${amount} from ${source}. New balance: $${this.money.cash.toFixed(2)}`);
        return true;
    },
    
    spendMoney(amount, purpose = 'unknown') {
        if (!this.validateNumber(amount, 0)) return false;
        
        if (this.money.cash < amount) {
            console.warn(`Insufficient funds: Need $${amount}, have $${this.money.cash}`);
            return false;
        }
        
        this.money.cash -= amount;
        this.stats.moneySpent += amount;
        console.log(`-$${amount} for ${purpose}. New balance: $${this.money.cash.toFixed(2)}`);
        return true;
    },
    
    // ==================== SKILL METHODS ====================
    addSkill(skillName, amount) {
        if (!this.validateNumber(amount, 0)) return false;
        
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
        if (!chore) {
            console.error('Chore not found:', choreId);
            return false;
        }
        
        chore.done = true;
        console.log(`✓ Completed chore: ${chore.name}`);
        return true;
    },
    
    resetChores() {
        this.daily.chores.forEach(chore => chore.done = false);
        console.log('Chores reset for new day');
    },
    
    // ==================== BUSY STATUS ====================
    setBusy(activity, duration) {
        if (!this.validateString(activity)) return false;
        if (!this.validateNumber(duration, 0)) return false;
        
        this.status.busy = true;
        this.status.busyActivity = activity;
        this.status.busyUntil = Date.now() + (duration * 1000);
        console.log(`Now busy: ${activity} for ${duration}s`);
        return true;
    },
    
    clearBusy() {
        this.status.busy = false;
        this.status.busyActivity = null;
        this.status.busyUntil = null;
        console.log('No longer busy');
    },
    
    isBusy() {
        if (this.status.busy && this.status.busyUntil) {
            if (Date.now() >= this.status.busyUntil) {
                this.clearBusy();
                return false;
            }
            return true;
        }
        return false;
    },
    
    // ==================== ACHIEVEMENT METHODS ====================
    addAchievement(name, description, icon) {
        if (!this.validateString(name) || !this.validateString(description)) return false;
        
        const exists = this.achievements.some(a => a.name === name);
        if (exists) return false;
        
        this.achievements.push({
            name: name,
            description: description,
            icon: icon,
            dateEarned: new Date().toISOString()
        });
        
        console.log(`🏆 Achievement unlocked: ${name}`);
        if (typeof UI !== 'undefined' && UI.showNotification) {
            UI.showNotification(`🏆 Achievement: ${name}`, 'success');
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
        const defaults = {
            player: { name: 'Player', age: 13, grade: 7, birthday: { month: 1, day: 1 } },
            money: { cash: 50, bank: 0, debt: 0 },
            time: { year: 2020, month: 1, date: 1, day: 3, hour: 7, minute: 0 },
            school: { enrolled: true, gpa: 3.0, homework: [], extracurriculars: [], attendance: 100 },
            work: { currentJob: null, jobHistory: [], applications: [] },
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
            needs: { hunger: 100, energy: 100, hygiene: 100, happiness: 100 },
            skills: {
                cooking: 0, cleaning: 0, budgeting: 0, timeManagement: 0,
                communication: 0, organization: 0, responsibility: 0, laundry: 0
            },
            housing: { type: 'parents', rentDue: 0, utilities: 0 },
            inventory: { items: [] },
            achievements: [],
            stats: {
                moneyEarned: 0, moneySpent: 0, hoursWorked: 0,
                homeworkCompleted: 0, choresCompleted: 0
            },
            status: { currentLocation: 'home', busy: false, busyUntil: null, busyActivity: null }
        };
        
        Object.assign(this, defaults);
        console.log('✓ Game state reset to defaults');
    }
};

console.log('✅ state.js loaded');
