function attendClass() {
    const currentPeriod = GameState.getCurrentPeriod();
    
    if (!currentPeriod || currentPeriod.name === 'Lunch') {
        UI.showNotification('⚠️ No class in session right now!', 'warning');
        return;
    }
    
    if (GameState.school.attendance[currentPeriod.name]) {
        UI.showNotification('✅ You already attended school today!', 'info');
        return;
    }
    
    // Auto-advance through entire school day
    UI.showNotification('📚 Attending school...', 'info');
    
    // Mark all periods as attended
    const periods = ['Math', 'English', 'Science', 'History', 'PE'];
    periods.forEach(period => {
        GameState.school.attendance[period] = true;
        // Small grade boost for attending
        if (GameState.school.grades[period]) {
            GameState.school.grades[period] = Math.min(100, GameState.school.grades[period] + 1);
        }
    });
    
    // Calculate hours at school
    const currentTime = GameState.time.hour * 60 + GameState.time.minute;
    const schoolEndTime = 15 * 60; // 3:00 PM
    const minutesAtSchool = schoolEndTime - currentTime;
    
    // Advance time to end of school
    TimeManager.advanceTime(minutesAtSchool);
    
    // School day effects
    GameState.needs.energy -= 25; // School is tiring
    GameState.needs.hunger -= 30; // Get hungry during school
    GameState.needs.stress += 10; // School adds some stress
    
    // Add stress from extracurriculars
    const extraStress = GameState.school.extracurriculars.length * 5;
    if (extraStress > 0) {
        GameState.needs.stress += extraStress;
        UI.showNotification(`⚠️ ${GameState.school.extracurriculars.length} extracurriculars increased stress!`, 'warning', 3000);
    }
    
    // Cap stress at 100
    GameState.needs.stress = Math.min(100, GameState.needs.stress);
    
    // Recalculate GPA
    GameState.calculateGPA();
    
    // Success message with stress warning
    let message = '🎉 Great job at school today! School is out.';
    if (GameState.needs.stress > 70) {
        message += '<br>😰 You\'re feeling very stressed!';
    } else if (GameState.needs.stress > 40) {
        message += '<br>😓 You\'re feeling a bit stressed.';
    }
    
    UI.showNotification(message, 'success', 5000);
    
    // Update displays
    loadSchool();
    UI.updateStats();
}
