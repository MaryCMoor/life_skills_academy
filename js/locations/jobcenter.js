function workShift() {
    if (GameState.isBusy()) {
        UI.showNotification('You are already busy!', 'warning');
        return;
    }
    
    const job = GameState.work.currentJob;
    if (!job) return;
    
    const shiftHours = 4; // 4 hour shift
    const earnings = job.wage * shiftHours;
    
    GameState.setBusy('working', shiftHours * 3);
    
    UI.showNotification(`💼 Working ${shiftHours} hour shift...`, 'info');
    
    setTimeout(() => {
        GameState.addMoney(earnings, job.title);
        GameState.stats.hoursWorked += shiftHours;
        GameState.addSkill('communication', 3);
        GameState.addSkill('timeManagement', 2);
        
        // Work adds stress, especially if you're a student
        let stressGain = 15;
        if (GameState.player.age < 18 && GameState.isWeekday()) {
            stressGain += 10; // Extra stress from balancing school and work
            UI.showNotification('😓 Balancing school and work is stressful!', 'warning', 3000);
        }
        GameState.needs.stress = Math.min(100, GameState.needs.stress + stressGain);
        
        // Work depletes energy
        GameState.needs.energy = Math.max(0, GameState.needs.energy - 20);
        GameState.needs.hunger = Math.max(0, GameState.needs.hunger - 15);
        
        GameState.clearBusy();
        
        UI.showNotification(`✅ Shift complete! Earned $${earnings.toFixed(2)}`, 'success');
        
        loadJobCenter();
        UI.updateStats();
    }, shiftHours * 3000);
}
