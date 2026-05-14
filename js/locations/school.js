// ==================== SCHOOL LOCATION ====================

function loadSchool() {
    document.getElementById('locationTitle').textContent = '🏫 School';
    
    const content = `
        <div class="tabs">
            <div class="tab active" onclick="showSchoolTab(event, 'classes')">Classes</div>
            <div class="tab" onclick="showSchoolTab(event, 'homework')">Homework</div>
            <div class="tab" onclick="showSchoolTab(event, 'extracurricular')">Extracurricular</div>
            <div class="tab" onclick="showSchoolTab(event, 'grades')">Grades</div>
        </div>
        
        <div id="school-classes" class="tab-content active">
            ${renderClasses()}
        </div>
        
        <div id="school-homework" class="tab-content">
            ${renderHomework()}
        </div>
        
        <div id="school-extracurricular" class="tab-content">
            ${renderExtracurricular()}
        </div>
        
        <div id="school-grades" class="tab-content">
            ${renderGrades()}
        </div>
    `;
    
    document.getElementById('locationContent').innerHTML = content;
}

function showSchoolTab(event, tab) {
    // Prevent default behavior
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Remove active class from all tabs and content
    document.querySelectorAll('#locationContent .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#locationContent .tab-content').forEach(t => t.classList.remove('active'));
    
    // Add active class to clicked tab
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Show selected content
    const contentEl = document.getElementById(`school-${tab}`);
    if (contentEl) {
        contentEl.classList.add('active');
    }
}

function renderClasses() {
    let html = '<h3>📚 Attend Classes</h3>';
    
    if (!GameState.isWeekday()) {
        html += `
            <div class="alert alert-info">
                🎉 It's the weekend! No school today. Enjoy your free time!
            </div>
        `;
        return html;
    }
    
    const currentPeriod = GameState.getCurrentPeriod();
    
    if (!currentPeriod) {
        html += `
            <div class="alert alert-info">
                School hours are 8:00 AM - 3:00 PM on weekdays.
            </div>
        `;
        return html;
    }
    
    if (currentPeriod.name === 'Lunch') {
        html += `
            <div class="alert alert-warning">
                🍔 It's lunch time! (12:00 PM - 12:30 PM)
            </div>
        `;
        return html;
    }
    
    const attended = GameState.school.attendance[currentPeriod.name];
    
    if (attended) {
        html += `
            <div class="alert alert-success">
                ✅ You already attended all your classes today! School is out at 3:00 PM.
            </div>
            
            <div class="info-box">
                <h4>Today's Performance:</h4>
                <ul>
                    <li>✅ All classes attended</li>
                    <li>📈 Grades improved</li>
                    <li>⚡ Energy: ${Math.round(GameState.needs.energy)}</li>
                    <li>😰 Stress: ${Math.round(GameState.needs.stress)}</li>
                </ul>
            </div>
        `;
        return html;
    }
    
    html += `
        <div class="alert alert-info">
            <strong>Current Period:</strong> ${currentPeriod.name}
        </div>
        
        <div class="info-box">
            <h4>📖 School Schedule:</h4>
            <ul>
                <li>8:00 - 8:50 AM: Math</li>
                <li>9:00 - 9:50 AM: English</li>
                <li>10:00 - 10:50 AM: Science</li>
                <li>11:00 - 11:30 AM: History</li>
                <li>12:00 - 12:30 PM: Lunch 🍔</li>
                <li>12:30 - 1:20 PM: History (continued)</li>
                <li>1:30 - 2:20 PM: PE</li>
            </ul>
        </div>
        
        <div style="margin: 30px 0; text-align: center;">
            <button class="btn btn-primary btn-large" onclick="attendClass()">
                📚 Attend ${currentPeriod.name} Class
            </button>
        </div>
        
        <div class="info-box">
            <h4>💡 Auto-Advance Feature:</h4>
            <p>Click "Attend Class" to automatically complete your entire school day!</p>
            <ul>
                <li>✅ All periods marked attended</li>
                <li>⏰ Time advances to 3:00 PM (end of school)</li>
                <li>📈 All grades improve slightly</li>
                <li>Effects: Energy -25, Hunger -30, Stress +10</li>
                <li>⚠️ Extracurriculars add +5 stress each</li>
            </ul>
        </div>
    `;
    
    if (GameState.school.extracurriculars.length > 0) {
        html += `
            <div class="alert alert-warning">
                ⚠️ You have ${GameState.school.extracurriculars.length} extracurricular activity/activities. 
                This will add ${GameState.school.extracurriculars.length * 5} stress after school!
            </div>
        `;
    }
    
    return html;
}

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
    
    UI.showNotification('📚 Attending school...', 'info');
    
    const periods = ['Math', 'English', 'Science', 'History', 'PE'];
    periods.forEach(period => {
        GameState.school.attendance[period] = true;
        if (GameState.school.grades[period]) {
            GameState.school.grades[period] = Math.min(100, GameState.school.grades[period] + 1);
        }
    });
    
    const currentTime = GameState.time.hour * 60 + GameState.time.minute;
    const schoolEndTime = 15 * 60;
    const minutesAtSchool = schoolEndTime - currentTime;
    
    TimeManager.advanceTime(minutesAtSchool);
    
    GameState.needs.energy = Math.max(0, GameState.needs.energy - 25);
    GameState.needs.hunger = Math.max(0, GameState.needs.hunger - 30);
    GameState.needs.stress = Math.min(100, GameState.needs.stress + 10);
    
    const extraStress = GameState.school.extracurriculars.length * 5;
    if (extraStress > 0) {
        GameState.needs.stress = Math.min(100, GameState.needs.stress + extraStress);
        UI.showNotification(`⚠️ ${GameState.school.extracurriculars.length} extracurriculars increased stress by ${extraStress}!`, 'warning', 3000);
    }
    
    GameState.calculateGPA();
    
    let message = '🎉 Great job at school today! School is out.';
    if (GameState.needs.stress > 70) {
        message += '<br>😰 You\'re feeling very stressed!';
    } else if (GameState.needs.stress > 40) {
        message += '<br>😓 You\'re feeling a bit stressed.';
    }
    
    UI.showNotification(message, 'success', 5000);
    
    loadSchool();
    UI.updateStats();
}

function renderHomework() {
    let html = '<h3>📝 Homework</h3>';
    html += '<p>Complete homework to improve your grades!</p>';
    
    const subjects = Object.keys(GameState.school.grades);
    
    html += '<div class="content-grid">';
    
    subjects.forEach(subject => {
        const currentGrade = GameState.school.grades[subject];
        const gradeColor = currentGrade >= 90 ? '#27ae60' : currentGrade >= 80 ? '#f39c12' : currentGrade >= 70 ? '#e67e22' : '#e74c3c';
        
        html += `
            <div class="card">
                <div class="card-title">${subject}</div>
                <div class="card-content">
                    <div class="info-row">
                        <span class="info-label">Current Grade:</span>
                        <span class="info-value" style="color: ${gradeColor}; font-weight: bold;">${currentGrade}%</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Time Required:</span>
                        <span class="info-value">30 minutes</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Grade Boost:</span>
                        <span class="info-value">+2%</span>
                    </div>
                    
                    <button class="btn btn-primary mt-10" onclick="doHomework('${subject}')">
                        Do Homework
                    </button>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    html += `
        <div class="info-box mt-20">
            <h4>💡 Homework Tips:</h4>
            <ul>
                <li>Homework improves your grades over time</li>
                <li>Takes 30 minutes and requires energy</li>
                <li>Do homework regularly to maintain good grades</li>
                <li>Higher grades lead to better opportunities</li>
            </ul>
        </div>
    `;
    
    return html;
}

function doHomework(subject) {
    if (GameState.isBusy()) {
        UI.showNotification('You are already busy with something!', 'warning');
        return;
    }
    
    if (GameState.needs.energy < 20) {
        UI.showNotification('You\'re too tired to do homework!', 'error');
        return;
    }
    
    GameState.setBusy(`${subject} homework`, 30);
    UI.showNotification(`📝 Doing ${subject} homework...`, 'info');
    
    setTimeout(() => {
        GameState.completeHomework(subject);
        GameState.needs.energy = Math.max(0, GameState.needs.energy - 10);
        GameState.addSkill('timeManagement', 2);
        GameState.clearBusy();
        
        UI.showNotification(`✅ ${subject} homework complete! Grade improved to ${GameState.school.grades[subject]}%`, 'success');
        
        loadSchool();
        UI.updateStats();
    }, 5000);
}

function renderExtracurricular() {
    let html = '<h3>🎭 Extracurricular Activities</h3>';
    html += '<p>Join clubs and activities to build skills and make friends!</p>';
    
    const activities = [
        { id: 'sports', name: 'Sports Team', icon: '⚽', skill: 'health', benefit: 'Fitness +5', stress: 5 },
        { id: 'band', name: 'School Band', icon: '🎵', skill: 'happiness', benefit: 'Happiness +3', stress: 5 },
        { id: 'debate', name: 'Debate Club', icon: '🗣️', skill: 'communication', benefit: 'Communication +4', stress: 5 },
        { id: 'art', name: 'Art Club', icon: '🎨', skill: 'happiness', benefit: 'Creativity +3', stress: 5 },
        { id: 'science', name: 'Science Club', icon: '🔬', skill: 'organization', benefit: 'Organization +4', stress: 5 }
    ];
    
    html += '<div class="content-grid">';
    
    activities.forEach(activity => {
        const enrolled = GameState.school.extracurriculars.includes(activity.id);
        
        html += `
            <div class="card">
                <div class="card-title">${activity.icon} ${activity.name}</div>
                <div class="card-content">
                    <div class="info-row">
                        <span class="info-label">Benefit:</span>
                        <span class="info-value">${activity.benefit}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Daily Stress:</span>
                        <span class="info-value" style="color: #e74c3c;">+${activity.stress}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Status:</span>
                        <span class="info-value">${enrolled ? '✅ Enrolled' : 'Not enrolled'}</span>
                    </div>
                    
                    ${enrolled ?
                        `<button class="btn btn-danger mt-10" onclick="leaveActivity('${activity.id}')">
                            Leave Activity
                        </button>` :
                        `<button class="btn btn-success mt-10" onclick="joinActivity('${activity.id}')">
                            Join Activity
                        </button>`
                    }
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    html += `
        <div class="alert alert-warning mt-20">
            ⚠️ <strong>Balance Warning:</strong> Each extracurricular adds +5 stress daily after school. 
            Too many activities can lead to burnout!
        </div>
        
        <div class="info-box">
            <h4>💡 Activity Tips:</h4>
            <ul>
                <li>Activities provide daily skill improvements</li>
                <li>Each activity adds stress to your school day</li>
                <li>Balance activities with rest and sleep</li>
                <li>If stressed, consider reducing activities</li>
                <li>Looks great on college applications!</li>
            </ul>
        </div>
    `;
    
    return html;
}

function joinActivity(activityId) {
    if (GameState.school.extracurriculars.includes(activityId)) {
        UI.showNotification('You\'re already in this activity!', 'info');
        return;
    }
    
    GameState.school.extracurriculars.push(activityId);
    UI.showNotification('✅ Joined activity! Remember: +5 stress daily', 'success');
    loadSchool();
}

function leaveActivity(activityId) {
    const index = GameState.school.extracurriculars.indexOf(activityId);
    if (index > -1) {
        GameState.school.extracurriculars.splice(index, 1);
        UI.showNotification('Left activity', 'info');
        loadSchool();
    }
}

function renderGrades() {
    let html = '<h3>📊 Grade Report</h3>';
    
    html += `
        <div class="stats-overview">
            <div class="stat-card">
                <div class="stat-value" style="font-size: 48px; color: #3498db;">${GameState.school.gpa.toFixed(1)}</div>
                <div class="stat-label">Current GPA</div>
            </div>
            <div class="stat-card">
                <div class="stat-value" style="font-size: 48px; color: #27ae60;">${GameState.player.grade}</div>
                <div class="stat-label">Grade Level</div>
            </div>
        </div>
    `;
    
    html += '<h4 style="margin-top: 30px;">Subject Grades:</h4>';
    html += '<div class="content-grid">';
    
    Object.keys(GameState.school.grades).forEach(subject => {
        const grade = GameState.school.grades[subject];
        const letterGrade = grade >= 90 ? 'A' : grade >= 80 ? 'B' : grade >= 70 ? 'C' : grade >= 60 ? 'D' : 'F';
        const gradeColor = grade >= 90 ? '#27ae60' : grade >= 80 ? '#f39c12' : grade >= 70 ? '#e67e22' : '#e74c3c';
        
        html += `
            <div class="card">
                <div class="card-title">${subject}</div>
                <div class="card-content">
                    <div style="text-align: center; margin: 20px 0;">
                        <div style="font-size: 48px; color: ${gradeColor}; font-weight: bold;">${letterGrade}</div>
                        <div style="font-size: 24px; color: #7f8c8d;">${grade}%</div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    const avgGrade = Object.values(GameState.school.grades).reduce((a, b) => a + b, 0) / Object.keys(GameState.school.grades).length;
    
    html += `
        <div class="info-box mt-20">
            <h4>📈 Academic Performance:</h4>
            <ul>
                <li>Average Grade: ${avgGrade.toFixed(1)}%</li>
                <li>GPA: ${GameState.school.gpa.toFixed(1)} / 4.0</li>
                <li>Homework Completed: ${GameState.stats.homeworkCompleted}</li>
                <li>Current Stress Level: ${Math.round(GameState.needs.stress)}</li>
            </ul>
            ${GameState.needs.stress > 70 ? 
                '<p style="color: #e74c3c; font-weight: bold;">⚠️ High stress is affecting your grades! Consider reducing commitments and getting more sleep.</p>' : 
                ''
            }
        </div>
    `;
    
    return html;
}

console.log('✅ school.js loaded');
