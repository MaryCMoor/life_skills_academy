// ==================== JOB CENTER (UPDATED) ====================

function loadJobCenter() {
    document.getElementById('locationTitle').textContent = '💼 Job Center';
    
    const content = `
        <div class="tabs">
            <div class="tab active" onclick="showJobTab('resume')">Resume</div>
            <div class="tab" onclick="showJobTab('jobs')">Job Listings</div>
            <div class="tab" onclick="showJobTab('current')">Current Job</div>
        </div>
        
        <div id="job-resume" class="tab-content active">
            ${renderResume()}
        </div>
        
        <div id="job-jobs" class="tab-content">
            ${renderJobListings()}
        </div>
        
        <div id="job-current" class="tab-content">
            ${renderCurrentJob()}
        </div>
    `;
    
    document.getElementById('locationContent').innerHTML = content;
}

function showJobTab(tab) {
    document.querySelectorAll('#locationContent .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#locationContent .tab-content').forEach(t => t.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`job-${tab}`).classList.add('active');
}

function renderResume() {
    let html = '<h3>📄 Your Resume</h3>';
    
    if (!GameState.work.hasResume) {
        html += `
            <div class="alert alert-warning">
                ⚠️ You need a resume before applying for jobs!
            </div>
            
            <div class="card">
                <div class="card-title">Create Your Resume</div>
                <div class="card-content">
                    <p>A resume is a document that shows employers:</p>
                    <ul>
                        <li>📋 Your contact information</li>
                        <li>🎓 Your education</li>
                        <li>💼 Your work experience</li>
                        <li>🎯 Your skills</li>
                    </ul>
                    <button class="btn btn-primary btn-large mt-20" onclick="createResume()">
                        ✍️ Create Resume
                    </button>
                </div>
            </div>
        `;
    } else {
        html += `
            <div class="alert alert-success">
                ✅ You have a resume ready!
            </div>
            
            <div class="card">
                <div class="card-title">📄 ${GameState.player.name}'s Resume</div>
                <div class="card-content">
                    <h4>Education:</h4>
                    <p>Currently in Grade ${GameState.player.grade}</p>
                    <p>GPA: ${GameState.school.gpa}</p>
                    
                    <h4>Skills:</h4>
                    <ul>
                        ${Object.keys(GameState.skills).slice(0, 5).map(skill => 
                            `<li>${skill}: ${GameState.skills[skill]}/100</li>`
                        ).join('')}
                    </ul>
                    
                    <h4>Work Experience:</h4>
                    ${GameState.work.jobHistory.length > 0 ? 
                        '<ul>' + GameState.work.jobHistory.map(job => 
                            `<li>${job.title} - ${job.duration}</li>`
                        ).join('') + '</ul>' :
                        '<p>No work experience yet</p>'
                    }
                    
                    <button class="btn btn-primary mt-20" onclick="updateResume()">
                        ✏️ Update Resume
                    </button>
                </div>
            </div>
        `;
    }
    
    return html;
}

function createResume() {
    GameState.work.hasResume = true;
    UI.showNotification('✅ Resume created!', 'success');
    GameState.addSkill('timeManagement', 5);
    GameState.addAchievement('Career Ready', 'Create your first resume', '📄');
    loadJobCenter();
}

function updateResume() {
    UI.showNotification('✅ Resume updated!', 'success');
    loadJobCenter();
}

function renderJobListings() {
    if (!GameState.work.hasResume) {
        return `
            <div class="alert alert-danger">
                ❌ You need to create a resume first!
            </div>
        `;
    }
    
    const jobs = [
        { id: 'cashier', title: 'Cashier', wage: 12, minAge: 14, minGPA: 0, hours: '4pm-8pm', desc: 'Work at local store', requirement: 'None' },
        { id: 'tutor', title: 'Tutor', wage: 20, minAge: 15, minGPA: 3.5, hours: '3pm-6pm', desc: 'Help younger students', requirement: 'GPA 3.5+' },
        { id: 'waiter', title: 'Waiter', wage: 15, minAge: 16, minGPA: 0, hours: '5pm-9pm', desc: 'Restaurant service', requirement: 'Age 16+' },
        { id: 'retail', title: 'Retail Associate', wage: 14, minAge: 16, minGPA: 0, hours: '4pm-9pm', desc: 'Sales and stocking', requirement: 'Age 16+' },
        { id: 'intern', title: 'Office Intern', wage: 18, minAge: 17, minGPA: 3.0, hours: '3pm-7pm', desc: 'Office work experience', requirement: 'Age 17+, GPA 3.0+' }
    ];
    
    let html = '<h3>💼 Available Jobs</h3>';
    
    jobs.forEach(job => {
        const meetsAge = GameState.player.age >= job.minAge;
        const meetsGPA = parseFloat(GameState.school.gpa) >= job.minGPA;
        const eligible = meetsAge && meetsGPA;
        const hasJob = GameState.work.currentJob !== null;
        
        html += `
            <div class="job-listing">
                <div class="job-title">${job.title}</div>
                <div class="job-details">
                    <div class="job-detail">💰 $${job.wage}/hour</div>
                    <div class="job-detail">⏰ ${job.hours}</div>
                    <div class="job-detail">📋 ${job.requirement}</div>
                </div>
                <div class="job-requirements">${job.desc}</div>
                
                ${!eligible ? 
                    `<div class="alert alert-warning">
                        ❌ Requirements not met
                        ${!meetsAge ? `<br>• Need to be ${job.minAge} years old` : ''}
                        ${!meetsGPA ? `<br>• Need GPA of ${job.minGPA}` : ''}
                    </div>` :
                    hasJob ?
                        '<button class="btn" disabled>Already have a job</button>' :
                        `<button class="btn btn-success" onclick="applyJob('${job.id}', '${job.title}', ${job.wage})">Apply</button>`
                }
            </div>
        `;
    });
    
    return html;
}

function applyJob(jobId, title, wage) {
    GameState.work.currentJob = {
        id: jobId,
        title: title,
        wage: wage,
        startDate: new Date().toISOString()
    };
    
    UI.showNotification(`🎉 Congratulations! You got the ${title} job!`, 'success');
    UI.showNotification('💼 Use "Work Shift" to punch in and earn money!', 'info', 5000);
    
    GameState.addAchievement('Employed', 'Get your first job', '💼');
    
    loadJobCenter();
}

function renderCurrentJob() {
    if (!GameState.work.currentJob) {
        return `
            <div class="alert alert-info">
                You don't have a job yet. Check the Job Listings!
            </div>
        `;
    }
    
    const job = GameState.work.currentJob;
    const onShift = GameState.work.onShift;
    const isBusy = GameState.isBusy();
    
    let html = '<h3>💼 Your Current Job</h3>';
    
    html += `
        <div class="card">
            <div class="card-title">${job.title}</div>
            <div class="card-content">
                <div class="info-row">
                    <span class="info-label">Wage:</span>
                    <span class="info-value">$${job.wage}/hour</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Warnings:</span>
                    <span class="info-value">${GameState.work.warnings}/3</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Status:</span>
                    <span class="info-value">${onShift ? '🟢 On Shift' : '🔴 Off Shift'}</span>
                </div>
                ${onShift ? `
                    <div class="info-row">
                        <span class="info-label">Shift Started:</span>
                        <span class="info-value">${GameState.work.shiftStartTime || 'Unknown'}</span>
                    </div>
                ` : ''}
                
                ${GameState.work.warnings > 0 ? 
                    `<div class="alert alert-warning mt-20">
                        ⚠️ You have ${GameState.work.warnings} warning(s). 3 warnings = fired!
                    </div>` : ''
                }
                
                <div class="mt-20">
                    ${!onShift && !isBusy ? `
                        <button class="btn btn-primary btn-large" onclick="punchIn()">
                            🕐 Punch In (Start 4-hour shift)
                        </button>
                    ` : onShift ? `
                        <button class="btn btn-danger btn-large" onclick="punchOut()">
                            ⏰ Punch Out (End shift)
                        </button>
                    ` : `
                        <div class="alert alert-warning">⏳ ${GameState.currentActivity}</div>
                    `}
                    
                    <button class="btn btn-danger mt-20" onclick="quitJob()">Quit Job</button>
                </div>
            </div>
        </div>
    `;
    
    html += `
        <div class="info-box mt-20">
            <h4>💡 Job Tips:</h4>
            <ul>
                <li>⏰ Punch in to start earning money</li>
                <li>💰 You earn $${job.wage} for each hour worked</li>
                <li>📊 Complete your full shift for best results</li>
                <li>⚠️ Being late or leaving early = warnings</li>
                <li>💼 Build good work history for better jobs</li>
            </ul>
        </div>
    `;
    
    return html;
}

function punchIn() {
    if (GameState.isBusy()) {
        UI.showNotification('⏳ Finish your current activity first!', 'warning');
        return;
    }
    
    const job = GameState.work.currentJob;
    if (!job) return;
    
    // Record shift start time
    GameState.work.onShift = true;
    GameState.work.shiftStartTime = `${GameState.time.hour}:${GameState.time.minute.toString().padStart(2, '0')}`;
    
    // Set busy for 4 hours
    GameState.setBusy(4, `Working as ${job.title}`);
    
    UI.showNotification(`✅ Punched in! Working for 4 hours...`, 'success');
    
    // Auto punch out after 4 hours
    setTimeout(() => {
        punchOut();
    }, 4000); // 4 seconds = 4 game hours
    
    loadJobCenter();
}

function punchOut() {
    const job = GameState.work.currentJob;
    if (!job || !GameState.work.onShift) return;
    
    const hoursWorked = 4;
    const earnings = job.wage * hoursWorked;
    
    GameState.work.onShift = false;
    GameState.work.shiftStartTime = null;
    GameState.addMoney(earnings, 'work');
    GameState.addSkill('timeManagement', 3);
    GameState.stats.hoursWorked += hoursWorked;
    GameState.clearBusy();
    
    UI.showNotification(`✅ Shift complete! Earned $${earnings}`, 'success');
    
    // Achievements
    if (GameState.stats.totalMoneyEarned >= 500) {
        GameState.addAchievement('Hard Worker', 'Earn $500 from jobs', '💼');
    }
    
    if (GameState.stats.hoursWorked >= 40) {
        GameState.addAchievement('Full Time', 'Work 40 hours total', '⏰');
    }
    
    loadJobCenter();
    UI.updateStats();
}

function quitJob() {
    if (!confirm('Are you sure you want to quit your job?')) return;
    
    const job = GameState.work.currentJob;
    if (job) {
        GameState.work.jobHistory.push({
            title: job.title,
            duration: 'Short term',
            wage: job.wage
        });
    }
    
    GameState.work.currentJob = null;
    GameState.work.warnings = 0;
    GameState.work.onShift = false;
    GameState.work.shiftStartTime = null;
    
    UI.showNotification('You quit your job', 'info');
    loadJobCenter();
}
