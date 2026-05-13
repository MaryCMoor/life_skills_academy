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
        
        // Clear busy status - FIXED LINE 100
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
