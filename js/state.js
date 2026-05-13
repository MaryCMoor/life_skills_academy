    // ==================== TIME HELPER METHODS ====================
    isWeekday() {
        // day: 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 0=Sun
        return this.time.day >= 1 && this.time.day <= 5;
    },
    
    isSchoolTime() {
        if (!this.isWeekday()) return false;
        if (this.player.age >= this.ADULT_AGE) return false;
        
        const minutes = this.time.hour * 60 + this.time.minute;
        return minutes >= 8 * 60 && minutes < 15 * 60; // 8:00 AM - 3:00 PM
    },
    
    getCurrentPeriod() {
        if (!this.isSchoolTime()) return null;
        
        const minutes = this.time.hour * 60 + this.time.minute;
        
        const periods = [
            { start: 8*60, end: 8*60+50, name: 'Math' },
            { start: 9*60, end: 9*60+50, name: 'English' },
            { start: 10*60, end: 10*60+50, name: 'Science' },
            { start: 11*60, end: 11*60+30, name: 'Lunch' },
            { start: 11*60+30, end: 12*60+20, name: 'History' },
            { start: 12*60+30, end: 13*60+20, name: 'PE' }
        ];
        
        return periods.find(p => minutes >= p.start && minutes < p.end) || null;
    },
    
    advanceDay() {
        this.time.date++;
        this.time.day++;
        
        if (this.time.day > 6) {
            this.time.day = 0; // Reset to Sunday
        }
        
        // Check if month has ended
        const daysInMonth = this.getDaysInMonth(this.time.year, this.time.month);
        if (this.time.date > daysInMonth) {
            this.time.date = 1;
            this.time.month++;
            
            // Advance stock market monthly
            if (typeof StockMarket !== 'undefined' && StockMarket.advanceMarket) {
                StockMarket.advanceMarket();
            }
        }
        
        // Check if year has ended
        if (this.time.month > 12) {
            this.time.month = 1;
            this.time.year++;
            
            // Reset annual tax filing
            this.taxes.filedThisYear = false;
        }
        
        // Check birthday
        if (this.time.month === this.player.birthday.month && this.time.date === this.player.birthday.day) {
            this.player.age++;
            if (typeof UI !== 'undefined') {
                UI.showNotification(`🎂 Happy Birthday! You are now ${this.player.age} years old!`, 'success', 5000);
            }
            
            // Grade advancement
            if (this.player.age >= 14 && this.player.age <= 18 && this.time.month >= 6) {
                this.player.grade++;
                if (typeof UI !== 'undefined') {
                    UI.showNotification(`📚 Advanced to Grade ${this.player.grade}!`, 'success');
                }
            }
        }
        
        // Reset daily chores
        this.resetChores();
        
        // Decrease grocery supply for adults
        if (this.player.age >= this.ADULT_AGE && this.adult && this.adult.apartment) {
            this.adult.groceries = Math.max(0, this.adult.groceries - 15);
        }
        
        console.log(`📅 New day: ${this.time.year}-${this.time.month}-${this.time.date}`);
    },
    
    getDaysInMonth(year, month) {
        return new Date(year, month, 0).getDate();
    },
    
    generateDailyChores() {
        this.daily.chores.forEach(chore => chore.done = false);
    },
    
    // ==================== SCHOOL METHODS ====================
    calculateGPA() {
        if (!this.school.grades) {
            this.school.grades = {
                Math: 85,
                English: 85,
                Science: 85,
                History: 85,
                PE: 85
            };
        }
        
        const grades = Object.values(this.school.grades);
        if (grades.length === 0) {
            this.school.gpa = 0;
            return;
        }
        
        const average = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
        
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
        
        this.school.gpa = parseFloat(this.school.gpa.toFixed(1));
    },
    
    completeHomework(subject) {
        if (this.school.grades && this.school.grades[subject] !== undefined) {
            this.school.grades[subject] = Math.min(100, this.school.grades[subject] + 2);
            this.calculateGPA();
        }
        this.stats.homeworkCompleted++;
    },
    
    // ==================== ADULT PROPERTIES ====================
    adult: {
        apartment: null,
        rent: 0,
        groceries: 100,
        bills: []
    }
};
