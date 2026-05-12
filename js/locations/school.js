// ==================== SCHOOL LOCATION ====================

function loadSchool() {
    document.getElementById('locationTitle').textContent = '🏫 School';
    
    const content = `
        <div class="tabs">
            <div class="tab active" onclick="showSchoolTab('classes')">Classes</div>
            <div class="tab" onclick="showSchoolTab('homework')">Homework</div>
            <div class="tab" onclick="showSchoolTab('grades')">Grades</div>
            <div class="tab" onclick="showSchoolTab('extracurricular')">Extracurricular</div>
        </div>
        
        <div id="school-classes" class="tab-content active">
            ${renderClasses()}
        </div>
        
        <div id="school-homework" class="tab-content">
            ${renderHomework()}
        </div>
        
        <div id="school-grades" class="tab-content">
            ${renderGrades()}
        </div>
        
        <div id="school-extracurricular" class="tab-content">
            ${renderExtracurricular()}
        </div>
    `;
    
    document.getElementById('locationContent').innerHTML = content;
}

function showSchoolTab(tab) {
    document.querySelectorAll('#locationContent .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#locationContent .tab-content').forEach(t => t.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`school-${tab}`).classList.add('active');
}

function renderClasses() {
    const isSchoolDay = GameState.isWeekday();
    const isSchoolTime = GameState.isSchoolTime();
    const currentPeriod = GameState.getCurrentPeriod();
    
    const schedule = [
        { time: '8:00 - 8:50', subject: 'Math', teacher: 'Mr. Johnson' },
        { time: '9:00 - 9:50', subject: 'English', teacher: 'Mrs. Davis' },
        { time: '10:00 - 10:50', subject: 'Science', teacher: 'Dr. Smith' },
        { time: '11:00 - 11:30', subject: 'Lunch', teacher: 'Cafeteria' },
        { time: '11:30 - 12:20', subject: 'History', teacher: 'Mr. Brown' },
        { time: '12:30 - 1:20', subject: 'PE', teacher: 'Coach Williams' }
    ];
    
    let html = '<h3>📅 Class Schedule (Monday - Friday)</h3>';
    
    if (!isSchoolDay) {
        html += '<div class="alert alert-info">🎉 No school today! Enjoy your weekend!</div>';
    } else if (!isSchoolTime) {
        html += '<div class="alert alert-warning">⏰ School is not in session right now.</div>';
    } else {
        html += '<div class="alert alert-success">✅ School is in session!</div>';
    }
    
    html += '<table class="schedule-table"><thead><tr><th>Time</th><th>Subject</th><th>Teacher</th><th>Status</th></tr></thead><tbody>';
    
    schedule.forEach(period => {
        const isPast = isSchoolTime && currentPeriod && schedule.indexOf(period) < schedule.findIndex(p => p.subject === currentPeriod.name);
        const isCurrent = currentPeriod && period.subject === currentPeriod.name;
        const attended = GameState.school.attendance[period.subject];
        
        let rowClass = '';
        let status = '-';
        
        if (isCurrent) {
            rowClass = 'current';
            status = attended ? '✅ Present' : '📍 In Progress';
        } else if (isPast) {
            rowClass = 'past';
            status = attended ? '✅ Attended' : '❌ Missed';
        }
        
        html += `
            <tr class="${rowClass}">
                <td>${period.time}</td>
                <td><strong>${period.subject}</strong></td>
                <td>${period.teacher}</td>
                <td>${status}</td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    
    // Attendance button
    if (isSchoolTime && currentPeriod && !GameState.school.attendance[currentPeriod.name]) {
        html += `
            <div class="mt-20 text-center">
                <button class="btn btn-primary btn-large" onclick="attendClass()">
                    📝 Attend ${currentPeriod.name} Class
                </button>
            </div>
        `;
    }
    
    // Attendance record
    html += `
        <div class="mt-20">
            <div class="stats-display">
                <div class="stat-box">
                    <div class="icon">📚</div>
                    <div class="label">Grade</div>
                    <div class="value">${GameState.player.grade}</div>
                </div>
                <div class="stat-box">
                    <div class="icon">⏰</div>
                    <div class="label">Tardies</div>
                    <div class="value">${GameState.school.tardies}</div>
                </div>
                <div class="stat-box">
                    <div class="icon">❌</div>
                    <div class="label">Absences</div>
                    <div class="value">${GameState.school.absences}</div>
                </div>
            </div>
        </div>
    `;
    
    return html;
}

function attendClass() {
    const currentPeriod = GameState.getCurrentPeriod();
    if (!currentPeriod || currentPeriod.name === 'Lunch') {
        UI.showNotification('⚠️ No class in session right now!', 'warning');
        return;
    }
    
    GameState.school.attendance[currentPeriod.name] = true;
    UI.showNotification(`✅ Attended ${currentPeriod.name} class!`, 'success');
    
    // Small grade boost
    if (GameState.school.grades[currentPeriod.name]) {
        GameState.school.grades[currentPeriod.name] = Math.min(100, GameState.school.grades[currentPeriod.name] + 1);
        GameState.calculateGPA();
    }
    
    loadSchool();
}

function renderHomework() {
    const homework = GameState.school.homework;
    
    let html = '<h3>📝 Homework Assignments</h3>';
    
    if (homework.length === 0 || homework.every(h => h.done)) {
        html += '<div class="alert alert-success">✅ All homework completed!</div>';
        return html;
    }
    
    html += '<div class="checklist">';
    
    homework.forEach((hw, index) => {
        html += `
            <div class="checklist-item ${hw.done ? 'completed' : ''}">
                <div class="checklist-icon">${hw.done ? '✅' : '📄'}</div>
                <div class="checklist-text">
                    <strong>${hw.subject} - ${hw.description}</strong>
                    <div class="desc">Estimated time: ${hw.time} minutes</div>
                    ${!hw.done ? '<div class="desc">Complete to improve your grade!</div>' : ''}
                </div>
                ${!hw.done ? `<button class="btn btn-success" onclick="doHomework(${index})">Complete</button>` : ''}
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function doHomework(index) {
    const hw = GameState.school.homework[index];
    if (!hw || hw.done) return;
    
    // Mark as done
    hw.done = true;
    GameState.completeHomework(hw.subject);
    
    UI.showNotification(`✅ ${hw.subject} homework completed! Grade improved!`, 'success');
    
    // Achievement check
    if (GameState.stats.homeworkCompleted === 20) {
        GameState.addAchievement('Dedicated Student', 'Complete 20 homework assignments', '📚');
    }
    
    loadSchool();
    UI.updateStats();
}

function renderGrades() {
    const grades = GameState.school.grades;
    const gpa = GameState.school.gpa;
    
    let html = '<h3>📊 Grade Report</h3>';
    
    html += `
        <div class="card">
            <div class="card-title">Current GPA: ${gpa}</div>
            <div class="card-content">
                ${UI.createProgressBar(parseFloat(gpa), 4.0, 'GPA Progress')}
            </div>
        </div>
    `;
    
    html += '<table class="data-table"><thead><tr><th>Subject</th><th>Grade</th><th>Letter</th><th>Progress</th></tr></thead><tbody>';
    
    Object.keys(grades).forEach(subject => {
        const grade = grades[subject];
        const letter = getLetterGrade(grade);
        
        html += `
            <tr>
                <td><strong>${subject}</strong></td>
                <td>${grade}%</td>
                <td>${letter}</td>
                <td>
                    <div class="progress-bar" style="height: 16px;">
                        <div class="progress-fill" style="width: ${grade}%"></div>
                    </div>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody></table>';
    
    html += `
        <div class="info-box mt-20">
            <h4>💡 Tips to Improve Grades:</h4>
            <ul>
                <li>Attend all classes on time</li>
                <li>Complete homework assignments daily</li>
                <li>Join study groups (extracurriculars)</li>
                <li>Ask teachers for help</li>
            </ul>
        </div>
    `;
    
    return html;
}

function getLetterGrade(percent) {
    if (percent >= 90) return 'A';
    if (percent >= 80) return 'B';
    if (percent >= 70) return 'C';
    if (percent >= 60) return 'D';
    return 'F';
}

function renderExtracurricular() {
    const activities = [
        { id: 'chess', name: '♟️ Chess Club', time: 'Wed 3-5pm', benefit: '+5 Math skill' },
        { id: 'debate', name: '🗣️ Debate Team', time: 'Thu 3-5pm', benefit: '+5 English skill' },
        { id: 'science', name: '🔬 Science Club', time: 'Tue 3-5pm', benefit: '+5 Science skill' },
        { id: 'sports', name: '⚽ Sports Team', time: 'Mon/Fri 3-5pm', benefit: '+5 PE grade' },
        { id: 'band', name: '🎵 Band', time: 'Daily 2-3pm', benefit: '+Time Management' }
    ];
    
    let html = '<h3>🎯 Extracurricular Activities</h3>';
    html += '<p>Join clubs and activities to improve your skills and boost your college applications!</p>';
    
    html += '<div class="content-grid">';
    
    activities.forEach(activity => {
        const joined = GameState.school.extracurriculars.includes(activity.id);
        
        html += `
            <div class="card">
                <div class="card-title">${activity.name}</div>
                <div class="card-content">
                    <p><strong>Schedule:</strong> ${activity.time}</p>
                    <p><strong>Benefit:</strong> ${activity.benefit}</p>
                    ${joined ? 
                        '<button class="btn btn-danger" onclick="leaveActivity(\'' + activity.id + '\')">Leave</button>' :
                        '<button class="btn btn-success" onclick="joinActivity(\'' + activity.id + '\')">Join</button>'
                    }
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    return html;
}

function joinActivity(activityId) {
    if (!GameState.school.extracurriculars.includes(activityId)) {
        GameState.school.extracurriculars.push(activityId);
        UI.showNotification('✅ Joined activity!', 'success');
        GameState.addSkill('timeManagement', 3);
        loadSchool();
    }
}

function leaveActivity(activityId) {
    const index = GameState.school.extracurriculars.indexOf(activityId);
    if (index > -1) {
        GameState.school.extracurriculars.splice(index, 1);
        UI.showNotification('Left activity', 'info');
        loadSchool();
    }
}
