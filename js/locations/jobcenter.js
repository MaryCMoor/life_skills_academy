// ==================== JOB CENTER LOCATION ====================

function loadJobCenter() {
    document.getElementById('locationTitle').textContent = '💼 Job Center';
    
    const content = `
        <div class="tabs">
            <div class="tab active" onclick="showJobTab('available')">Available Jobs</div>
            <div class="tab" onclick="showJobTab('current')">Current Job</div>
            <div class="tab" onclick="showJobTab('history')">Work History</div>
        </div>
        
        <div id="job-available" class="tab-content active">
            ${renderAvailableJobs()}
        </div>
        
        <div id="job-current" class="tab-content">
            ${renderCurrentJob()}
        </div>
        
        <div id="job-history" class="tab-content">
            ${renderJobHistory()}
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

function renderAvailableJobs() {
    let html = '<h3>💼 Available Jobs</h3>';
    
    const jobs = [
        { 
            id: 'paper-route', 
            title: 'Paper Route', 
            wage: 8, 
            minAge: 13, 
            requirements: 'Reliable, early riser',
            description: 'Deliver newspapers to homes in your neighborhood',
            icon: '📰'
        },
        { 
            id: 'lawn-mowing', 
            title: 'Lawn Mowing', 
            wage: 12, 
            minAge: 14, 
            requirements: 'Physical fitness',
            description: 'Mow lawns for neighbors and local businesses',
            icon: '🌱'
        },
        { 
            id: 'babysitting', 
            title: 'Babysitting', 
            wage: 10, 
            minAge: 14, 
            requirements: 'Responsible, patient',
            description: 'Watch children while parents are away',
            icon: '👶'
        },
        { 
            id: 'grocery-bagger', 
            title: 'Grocery Bagger', 
            wage: 11, 
            minAge: 15, 
            requirements: 'Customer service',
            description: 'Bag groceries and assist customers at local store',
            icon: '🛒'
        },
        { 
            id: 'fast-food', 
            title: 'Fast Food Worker', 
            wage: 13, 
            minAge: 16, 
            requirements: 'Fast-paced environment',
            description: 'Prepare food and serve customers',
            icon: '🍔'
        },
        { 
            id: 'retail', 
            title: 'Retail Sales', 
            wage: 14, 
            minAge: 16, 
            requirements: 'Communication skills',
            description: 'Help customers and stock shelves',
            icon: '👕'
        },
        { 
            id: 'office', 
            title: 'Office Assistant', 
            wage: 16, 
            minAge: 18, 
            requirements: 'Computer skills, organization',
            description: 'File documents, answer phones, data entry',
            icon: '📎'
        }
    ];
    
    html += '<div class="content-grid">';
    
    jobs.forEach(job => {
        const meetsAge = GameState.player.age >= job.minAge;
        const hasJob = GameState.work.currentJob !== null;
        
        html += `
            <div class="card">
                <div class="card-title">${job.icon} ${job.title}</div>
                <div class="card-content">
                    <p>${job.description}</p>
                    
                    <div class="info-row">
                        <span class="info-label">Wage:</span>
                        <span class="info-value">$${job.wage}/hour</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Min Age:</span>
                        <span class="info-value">${job.minAge}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Requirements:</span>
                        <span class="info-value">${job.requirements}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Stress Impact:</span>
                        <span class="info-value" style="color: #e74c3c;">+15 per shift</span>
                    </div>
                    
                    ${!hasJob && meetsAge ?
                        `<button class="btn btn-success mt-10" onclick="applyForJob('${job.id}', '${job.title}', ${job.wage})">
                            Apply for Job
                        </button>` :
                        hasJob ?
                        '<button class="btn mt-10" disabled>Already Employed</button>' :
                        `<button class="btn mt-10" disabled>Too Young (Need age ${job.minAge})</button>`
                    }
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    html += `
        <div class="info-box mt-20">
            <h4>💡 Work Tips:</h4>
            <ul>
                <li>Each work shift is 4 hours long</li>
                <li>Working adds +15 base stress</li>
                <li>Working on school days adds +10 additional stress</li>
                <li>Balance work with school and rest</li>
                <li>Higher wages available as you get older</li>
                <li>Build work experience for better opportunities</li>
            </ul>
        </div>
        
        <div class="alert alert-warning">
            ⚠️ <strong>Stress Warning:</strong> Working while attending school significantly increases stress. 
            Make sure to get enough sleep and manage your time carefully!
        </div>
    `;
    
    return html;
}

function applyForJob(jobId, jobTitle, wage) {
    if (GameState.work.currentJob) {
        UI.showNotification('You already have a job! Quit your current job first.', 'warning');
        return;
    }
    
    GameState.work.currentJob = {
        id: jobId,
        title: jobTitle,
        wage: wage,
        startDate: {
            year: GameState.time.year,
            month: GameState.time.month,
            date: GameState.time.date
        },
        shiftsWorked: 0
    };
    
    UI.showNotification(`🎉 Congratulations! You got the ${jobTitle} job!`, 'success');
    loadJobCenter();
}

function renderCurrentJob() {
    let html = '<h3>💼 Current Job</h3>';
    
    if (!GameState.work.currentJob) {
        html += `
            <div class="alert alert-info">
                You don't have a job yet. Check the "Available Jobs" tab to apply!
            </div>
        `;
        return html;
    }
    
    const job = GameState.work.currentJob;
    
    html += `
        <div class="card-large">
            <h2>${job.title}</h2>
            
            <div class="info-grid">
                <div class="info-row">
                    <span class="info-label">Wage:</span>
                    <span class="info-value">$${job.wage}/hour</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Shifts Worked:</span>
                    <span class="info-value">${job.shiftsWorked}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Total Earnings:</span>
                    <span class="info-value">$${(job.shiftsWorked * 4 * job.wage).toFixed(2)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Start Date:</span>
                    <span class="info-value">${job.startDate.month}/${job.startDate.date}/${job.startDate.year}</span>
                </div>
            </div>
            
            <div style="margin-top: 30px; display: flex; gap: 10px;">
                <button class="btn btn-primary btn-large" onclick="workShift()">
                    🕐 Work Shift (4 hours)
                </button>
                <button class="btn btn-danger" onclick="quitJob()">
                    Quit Job
                </button>
            </div>
        </div>
        
        <div class="info-box mt-20">
            <h4>💰 Shift Information:</h4>
            <ul>
                <li>Duration: 4 hours</li>
                <li>Pay: $${(job.wage * 4).toFixed(2)} per shift</li>
                <li>Energy Cost: -20</li>
                <li>Hunger Cost: -15</li>
                <li>Base Stress: +15</li>
                <li>${GameState.player.age < 18 && GameState.isWeekday() ? '⚠️ School Day Stress: +10 additional' : ''}</li>
            </ul>
        </div>
    `;
    
    if (GameState.needs.stress > 60) {
        html += `
            <div class="alert alert-warning">
                ⚠️ Your stress level is high (${Math.round(GameState.needs.stress)}). 
                Working another shift may push you towards burnout. Consider resting first!
            </div>
        `;
    }
    
    return html;
}

function workShift() {
    if (GameState.isBusy()) {
        UI.showNotification('You are already busy!', 'warning');
        return;
    }
    
    const job = GameState.work.currentJob;
    if (!job) return;
    
    const shiftHours = 4;
    const earnings = job.wage * shiftHours;
    
    GameState.setBusy('working', shiftHours * 3);
    
    UI.showNotification(`💼 Working ${shiftHours} hour shift...`, 'info');
    
    setTimeout(() => {
        GameState.addMoney(earnings, job.title);
        GameState.stats.hoursWorked += shiftHours;
        GameState.addSkill('communication', 3);
        GameState.addSkill('timeManagement', 2);
        
        job.shiftsWorked++;
        
        let stressGain = 15;
        if (GameState.player.age < 18 && GameState.isWeekday()) {
            stressGain += 10;
            UI.showNotification('😓 Balancing school and work is stressful!', 'warning', 3000);
        }
        GameState.needs.stress = Math.min(100, GameState.needs.stress + stressGain);
        
        GameState.needs.energy = Math.max(0, GameState.needs.energy - 20);
        GameState.needs.hunger = Math.max(0, GameState.needs.hunger - 15);
        
        GameState.clearBusy();
        
        UI.showNotification(`✅ Shift complete! Earned $${earnings.toFixed(2)}`, 'success');
        
        loadJobCenter();
        UI.updateStats();
    }, shiftHours * 3000);
}

function quitJob() {
    if (!GameState.work.currentJob) return;
    
    const job = GameState.work.currentJob;
    
    GameState.work.jobHistory.push({
        ...job,
        endDate: {
            year: GameState.time.year,
            month: GameState.time.month,
            date: GameState.time.date
        }
    });
    
    GameState.work.currentJob = null;
    
    UI.showNotification(`You quit your job as ${job.title}`, 'info');
    loadJobCenter();
}

function renderJobHistory() {
    let html = '<h3>📜 Work History</h3>';
    
    if (GameState.work.jobHistory.length === 0) {
        html += `
            <div class="alert alert-info">
                No work history yet. Your previous jobs will appear here.
            </div>
        `;
        return html;
    }
    
    html += '<div class="history-list">';
    
    GameState.work.jobHistory.forEach(job => {
        const totalEarned = job.shiftsWorked * 4 * job.wage;
        
        html += `
            <div class="history-item">
                <h4>${job.title}</h4>
                <div class="info-row">
                    <span class="info-label">Duration:</span>
                    <span class="info-value">${job.startDate.month}/${job.startDate.date}/${job.startDate.year} - ${job.endDate.month}/${job.endDate.date}/${job.endDate.year}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Shifts Worked:</span>
                    <span class="info-value">${job.shiftsWorked}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Total Earned:</span>
                    <span class="info-value">$${totalEarned.toFixed(2)}</span>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    const totalShifts = GameState.work.jobHistory.reduce((sum, job) => sum + job.shiftsWorked, 0);
    const totalEarnings = GameState.work.jobHistory.reduce((sum, job) => sum + (job.shiftsWorked * 4 * job.wage), 0);
    
    html += `
        <div class="info-box mt-20">
            <h4>📊 Career Statistics:</h4>
            <ul>
                <li>Total Jobs Held: ${GameState.work.jobHistory.length}</li>
                <li>Total Shifts Worked: ${totalShifts}</li>
                <li>Total Earnings: $${totalEarnings.toFixed(2)}</li>
                <li>Total Hours Worked: ${GameState.stats.hoursWorked}</li>
            </ul>
        </div>
    `;
    
    return html;
}

console.log('✅ jobcenter.js loaded');
