// ==================== SCHOOL LOCATION (UPDATED) ====================

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
    const isBusy = GameState.isBusy();
    
    const schedule = [
        { time: '8:00 - 8:50', subject: 'Math', teacher: 'Mr. Johnson', duration: 50 },
        { time: '9:00 - 9:50', subject: 'English', teacher: 'Mrs. Davis', duration: 50 },
        { time: '10:00 - 10:50', subject: 'Science', teacher: 'Dr. Smith', duration: 50 },
        { time: '11:00 - 11:30', subject: 'Lunch', teacher: 'Cafeteria', duration: 30 },
        { time: '11:30 - 12:20', subject: 'History', teacher: 'Mr. Brown', duration: 50 },
        { time: '12:30 - 1:20', subject: 'PE', teacher: 'Coach Williams', duration: 50 }
    ];
    
    let html = '<h3>📅 Class Schedule (Monday - Friday)</h3>';
    
    if (!isSchoolDay) {
        html += '<div class="alert alert-info">🎉 No school today! Enjoy your weekend!</div>';
    } else if (!isSchoolTime) {
        html += '<div class="alert alert-warning">⏰ School is not in session right now.</div>';
    } else if (currentPeriod) {
        const inClass = GameState.school.currentClass === currentPeriod.name;
        if (inClass) {
            html += `<div class="alert alert-success">✅ You're in ${currentPeriod.name} class right now!</div>`;
        } else {
            html += `<div class="alert alert-warning">⚠️ ${currentPeriod.name} is happening NOW! Sign in!</div>`;
        }
    }
    
    if (isBusy && GameState.currentActivity.includes('class')) {
        html += `<div class="alert alert-info">📚 Currently: ${GameState.currentActivity}</div>`;
    }
    
    html += '<table class="schedule-table"><thead><tr><th>Time</th><th>Subject</th><th>Teacher</th><th>Status</th></tr></thead><tbody>';
    
    schedule.forEach(period => {
        const attended = GameState.school.attendance[period.subject];
        const isCurrent = currentPeriod && period.subject === currentPeriod.name;
        const inThisClass = GameState.school.currentClass === period.subject;
        
        let rowClass = '';
        let status = '-';
        
        if (isCurrent) {
            rowClass = 'current';
            if (inThisClass) {
                status = '✅ In Class';
            } else {
                status = `<button class="btn btn-success btn-sm" onclick="attendClass('${period.subject}', ${period.duration})">Sign In</button>`;
            }
        } else if (attended) {
            rowClass = 'past';
            status = '✅ Attended';
        } else if (isSchoolTime) {
            const currentMinutes = GameState.time.hour * 60 + GameState.time.minute;
            const periodStart = parseInt(period.time.split(':')[0]) * 60 + parseInt(period.time.split(':')[1]);
            if (currentMinutes > periodStart + period.duration) {
                rowClass = 'past';
                status = '❌ Missed';
            }
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

function attendClass(subject, duration) {
    if (GameState.isBusy()) {
        UI.showNotification('⏳ You\'re already in another activity!', 'warning');
        return;
    }
    
    const currentPeriod = GameState.getCurrentPeriod();
    if (!currentPeriod || currentPeriod.name !== subject) {
        UI.showNotification('⚠️ This class is not in session right now!', 'warning');
        return;
    }
    
    // Mark attendance
    GameState.school.attendance[subject] = true;
    GameState.school.currentClass = subject;
    
    // Set busy for class duration
    const hours = Math.ceil(duration / 60);
    GameState.setBusy(hours, `Attending ${subject} class`);
    
    UI.showNotification(`✅ Signed in to ${subject} class!`, 'success');
    
    // Small grade boost
    if (GameState.school.grades[subject]) {
        GameState.school.grades[subject] = Math.min(100, GameState.school.grades[subject] + 1);
        GameState.calculateGPA();
    }
    
    // Auto sign-out after class
    setTimeout(() => {
        GameState.school.currentClass = null;
        GameState.clearBusy();
        UI.showNotification(`🔔 ${subject} class ended!`, 'info');
        loadSchool();
    }, hours * 1000);
    
    loadSchool();
    UI.updateStats();
}

function renderHomework() {
    const homework = GameState.school.homework;
    const isBusy = GameState.isBusy();
    
    let html = '<h3>📝 Homework Assignments</h3>';
    
    if (homework.length === 0 || homework.every(h => h.done)) {
        html += '<div class="alert alert-success">✅ All homework completed!</div>';
        return html;
    }
    
    if (isBusy) {
        html += `<div class="alert alert-warning">⏳ Currently: ${GameState.currentActivity}</div>`;
    }
    
    html += '<div class="checklist">';
    
    homework.forEach((hw, index) => {
        html += `
            <div class="checklist-item ${hw.done ? 'completed' : ''}">
                <div class="checklist-icon">${hw.done ? '✅' : '📄'}</div>
                <div class="checklist-text">
                    <strong>${hw.subject} - ${hw.description}</strong>
                    <div class="desc">⏱️ Estimated time: ${hw.time} minutes</div>
                    ${!hw.done ? '<div class="desc">Complete to improve your grade!</div>' : ''}
                </div>
                ${!hw.done && !isBusy ? 
                    `<button class="btn btn-success" onclick="doHomework(${index}, ${hw.time}, '${hw.subject}')">Complete</button>` : 
                    hw.done ? '<span style="color: #27ae60;">✓ Done</span>' : ''
                }
            </div>
        `;
    });
    
    html += '</div>';
    return html;
}

function doHomework(index, time, subject) {
    const hw = GameState.school.homework[index];
    if (!hw || hw.done) return;
    
    if (GameState.isBusy()) {
        UI.showNotification('⏳ Finish your current activity first!', 'warning');
        return;
    }
    
    // Set busy for homework duration
    const hours = Math.ceil(time / 60);
    GameState.setBusy(hours, `Doing ${subject} homework`);
    
    // Auto-complete after time
    setTimeout(() => {
        hw.done = true;
        GameState.completeHomework(subject);
        GameState.clearBusy();
        
        UI.showNotification(`✅ ${subject} homework completed! Grade improved!`, 'success');
        
        // Achievement check
        if (GameState.stats.homeworkCompleted === 20) {
            GameState.addAchievement('Dedicated Student', 'Complete 20 homework assignments', '📚');
        }
        
        loadSchool();
        UI.updateStats();
    }, hours * 1000);
    
    UI.showNotification(`📝 Working on ${subject} homework...`, 'info');
    loadSchool();
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
                <li>✅ Attend all classes on time</li>
                <li>📝 Complete homework assignments daily</li>
                <li>👥 Join study groups (extracurriculars)</li>
                <li>🙋 Ask teachers for help</li>
                <li>📚 Stay organized with your phone's school portal</li>
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
        
        if (GameState.school.extracurriculars.length === 3) {
            GameState.addAchievement('Well Rounded', 'Join 3 extracurricular activities', '🎯');
        }
        
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
