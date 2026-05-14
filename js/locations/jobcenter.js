// ==================== JOB CENTER LOCATION ====================

function loadJobCenter() {
    document.getElementById('locationTitle').textContent = '💼 Job Center';
    
    const content = `
        <div class="tabs">
            <div class="tab active" onclick="showJobTab('available')">Available Jobs</div>
            <div class="tab" onclick="showJobTab('current')">Current Job</div>
            <div class="tab" onclick="showJobTab('schedule')">My Schedule</div>
            <div class="tab" onclick="showJobTab('history')">Work History</div>
        </div>
        
        <div id="job-available" class="tab-content active">
            ${renderAvailableJobs()}
        </div>
        
        <div id="job-current" class="tab-content">
            ${renderCurrentJob()}
        </div>
        
        <div id="job-schedule" class="tab-content">
            ${renderSchedule()}
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
            icon: '📰',
            hoursPerWeek: 10,
            shiftPattern: 'Early morning (6-8am), Mon-Fri'
        },
        { 
            id: 'lawn-mowing', 
            title: 'Lawn Mowing', 
            wage: 12, 
            minAge: 14, 
            requirements: 'Physical fitness',
            description: 'Mow lawns for neighbors and local businesses',
            icon: '🌱',
            hoursPerWeek: 12,
            shiftPattern: 'Afternoons/Weekends, flexible schedule'
        },
        { 
            id: 'babysitting', 
            title: 'Babysitting', 
            wage: 10, 
            minAge: 14, 
            requirements: 'Responsible, patient',
            description: 'Watch children while parents are away',
            icon: '👶',
            hoursPerWeek: 8,
            shiftPattern: 'Evenings (6-10pm), Tue/Thu/Sat'
        },
        { 
            id: 'grocery-bagger', 
            title: 'Grocery Bagger', 
            wage: 11, 
            minAge: 15, 
            requirements: 'Customer service',
            description: 'Bag groceries and assist customers at local store',
            icon: '🛒',
            hoursPerWeek: 15,
            shiftPattern: 'After school (4-7pm), Mon-Fri'
        },
        { 
            id: 'fast-food', 
            title: 'Fast Food Worker', 
            wage: 13, 
            minAge: 16, 
            requirements: 'Fast-paced environment',
            description: 'Prepare food and serve customers',
            icon: '🍔',
            hoursPerWeek: 20,
            shiftPattern: 'Evenings (5-9pm), varies'
        },
        { 
            id: 'retail', 
            title: 'Retail Sales', 
            wage: 14, 
            minAge: 16, 
            requirements: 'Communication skills',
            description: 'Help customers and stock shelves',
            icon: '👕',
            hoursPerWeek: 20,
            shiftPattern: 'After school + weekends'
        },
        { 
            id: 'office', 
            title: 'Office Assistant', 
            wage: 16, 
            minAge: 18, 
            requirements: 'Computer skills, organization',
            description: 'File documents, answer phones, data entry',
            icon: '📎',
            hoursPerWeek: 25,
            shiftPattern: 'Weekdays (9am-2pm or 3-8pm)'
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
                        <span class="info-label">Hours/Week:</span>
                        <span class="info-value">~${job.hoursPerWeek} hours</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Schedule:</span>
                        <span class="info-value" style="font-size: 12px;">${job.shiftPattern}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Min Age:</span>
                        <span class="info-value">${job.minAge}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Requirements:</span>
                        <span class="info-value" style="font-size: 12px;">${job.requirements}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Stress Impact:</span>
                        <span class="info-value" style="color: #e74c3c;">+15 per shift</span>
                    </div>
                    
                    ${!hasJob && meetsAge ?
                        `<button class="btn btn-success mt-10" onclick="applyForJob('${job.id}', '${job.title}', ${job.wage}, ${job.hoursPerWeek})">
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
                <li><strong>Check your schedule regularly!</strong> You need to clock in during shift times</li>
                <li>Each shift is typically 3-4 hours</li>
                <li>You can request more hours from your manager</li>
                <li>Working during school adds extra stress</li>
                <li>Missing shifts can get you fired!</li>
                <li>Time advances automatically when you clock in</li>
            </ul>
        </div>
        
        <div class="alert alert-warning">
            ⚠️ <strong>Stress Warning:</strong> Working while attending school significantly increases stress. 
            Make sure to get enough sleep and manage your time carefully!
        </div>
    `;
    
    return html;
}

function applyForJob(jobId, jobTitle, wage, hoursPerWeek) {
    if (GameState.work.currentJob) {
        UI.showNotification('You already have a job! Quit your current job first.', 'warning');
        return;
    }
    
    // Generate initial schedule
    const schedule = generateJobSchedule(jobId, hoursPerWeek);
    
    GameState.work.currentJob = {
        id: jobId,
        title: jobTitle,
        wage: wage,
        hoursPerWeek: hoursPerWeek,
        startDate: {
            year: GameState.time.year,
            month: GameState.time.month,
            date: GameState.time.date
        },
        shiftsWorked: 0,
        shiftsScheduled: schedule,
        missedShifts: 0,
        canRequestMoreHours: true
    };
    
    UI.showNotification(`🎉 Congratulations! You got the ${jobTitle} job!`, 'success');
    UI.showNotification('📅 Check your schedule to see when your shifts are!', 'info', 4000);
    loadJobCenter();
}

function generateJobSchedule(jobId, hoursPerWeek) {
    // Generate schedule based on job type
    const schedules = {
        'paper-route': [
            { day: 1, startHour: 6, startMin: 0, duration: 2 },
            { day: 2, startHour: 6, startMin: 0, duration: 2 },
            { day: 3, startHour: 6, startMin: 0, duration: 2 },
            { day: 4, startHour: 6, startMin: 0, duration: 2 },
            { day: 5, startHour: 6, startMin: 0, duration: 2 }
        ],
        'babysitting': [
            { day: 2, startHour: 18, startMin: 0, duration: 4 },
            { day: 4, startHour: 18, startMin: 0, duration: 4 },
            { day: 6, startHour: 18, startMin: 0, duration: 4 }
        ],
        'grocery-bagger': [
            { day: 1, startHour: 16, startMin: 0, duration: 3 },
            { day: 2, startHour: 16, startMin: 0, duration: 3 },
            { day: 3, startHour: 16, startMin: 0, duration: 3 },
            { day: 4, startHour: 16, startMin: 0, duration: 3 },
            { day: 5, startHour: 16, startMin: 0, duration: 3 }
        ],
        'fast-food': [
            { day: 1, startHour: 17, startMin: 0, duration: 4 },
            { day: 3, startHour: 17, startMin: 0, duration: 4 },
            { day: 5, startHour: 17, startMin: 0, duration: 4 },
            { day: 6, startHour: 12, startMin: 0, duration: 5 }
        ],
        'retail': [
            { day: 1, startHour: 16, startMin: 0, duration: 4 },
            { day: 3, startHour: 16, startMin: 0, duration: 4 },
            { day: 5, startHour: 16, startMin: 0, duration: 4 },
            { day: 6, startHour: 10, startMin: 0, duration: 6 }
        ],
        'lawn-mowing': [
            { day: 3, startHour: 15, startMin: 0, duration: 4 },
            { day: 6, startHour: 9, startMin: 0, duration: 4 },
            { day: 0, startHour: 9, startMin: 0, duration: 4 }
        ],
        'office': [
            { day: 1, startHour: 15, startMin: 0, duration: 5 },
            { day: 2, startHour: 15, startMin: 0, duration: 5 },
            { day: 3, startHour: 15, startMin: 0, duration: 5 },
            { day: 4, startHour: 15, startMin: 0, duration: 5 },
            { day: 5, startHour: 15, startMin: 0, duration: 5 }
        ]
    };
    
    return schedules[jobId] || [];
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
    const currentShift = getCurrentShift(job);
    
    html += `
        <div class="card-large">
            <h2>${job.title}</h2>
            
            <div class="info-grid">
                <div class="info-row">
                    <span class="info-label">Wage:</span>
                    <span class="info-value">$${job.wage}/hour</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Hours/Week:</span>
                    <span class="info-value">${job.hoursPerWeek} hours</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Shifts Worked:</span>
                    <span class="info-value">${job.shiftsWorked}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Missed Shifts:</span>
                    <span class="info-value" style="color: ${job.missedShifts > 2 ? '#e74c3c' : '#7f8c8d'}">${job.missedShifts}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Total Earnings:</span>
                    <span class="info-value">$${(job.shiftsWorked * job.wage * 4).toFixed(2)}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">Start Date:</span>
                    <span class="info-value">${job.startDate.month}/${job.startDate.date}/${job.startDate.year}</span>
                </div>
            </div>
            
            ${currentShift ? `
                <div class="alert alert-success mt-20">
                    ✅ <strong>You have a shift NOW!</strong><br>
                    Shift: ${formatShiftTime(currentShift)} (${currentShift.duration} hours)<br>
                    <strong>Clock in to start working!</strong>
                </div>
            ` : `
                <div class="alert alert-info mt-20">
                    ℹ️ No shift scheduled right now. Check your schedule for upcoming shifts.
                </div>
            `}
            
            <div style="margin-top: 30px; display: flex; gap: 10px; flex-wrap: wrap;">
                ${currentShift ? `
                    <button class="btn btn-success btn-large" onclick="clockIn()">
                        🕐 Clock In (${currentShift.duration}h shift)
                    </button>
                ` : ''}
                
                ${job.canRequestMoreHours ? `
                    <button class="btn btn-primary" onclick="requestMoreHours()">
                        📋 Request More Hours
                    </button>
                ` : `
                    <button class="btn" disabled>
                        ⏳ More hours requested (wait for approval)
                    </button>
                `}
                
                <button class="btn btn-danger" onclick="quitJob()">
                    Quit Job
                </button>
            </div>
        </div>
        
        ${job.missedShifts > 0 ? `
            <div class="alert alert-warning mt-20">
                ⚠️ <strong>Warning:</strong> You've missed ${job.missedShifts} shift(s). 
                Missing 3+ shifts may result in termination!
            </div>
        ` : ''}
        
        <div class="info-box mt-20">
            <h4>💰 How Work Shifts Work:</h4>
            <ul>
                <li>Check your schedule to see when you work</li>
                <li>Clock in during your scheduled shift time</li>
                <li>Time advances automatically during your shift</li>
                <li>You get paid instantly when shift ends</li>
                <li>Missing shifts damages your employment record</li>
                <li>You can request more hours from your manager</li>
            </ul>
        </div>
    `;
    
    return html;
}

function renderSchedule() {
    if (!GameState.work.currentJob) {
        return `
            <div class="alert alert-info">
                You don't have a job yet. Get hired first to see your schedule!
            </div>
        `;
    }
    
    const job = GameState.work.currentJob;
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const currentDay = GameState.time.day;
    
    let html = '<h3>📅 My Work Schedule</h3>';
    
    html += `
        <div class="alert alert-info">
            <strong>Current Day:</strong> ${days[currentDay]}<br>
            <strong>Current Time:</strong> ${String(GameState.time.hour).padStart(2, '0')}:${String(GameState.time.minute).padStart(2, '0')}
        </div>
    `;
    
    html += '<div class="schedule-table" style="overflow-x: auto;">';
    html += '<table style="width: 100%; border-collapse: collapse; background: white; border-radius: 10px; overflow: hidden;">';
    html += '<thead style="background: #3498db; color: white;"><tr>';
    html += '<th style="padding: 12px; text-align: left;">Day</th>';
    html += '<th style="padding: 12px; text-align: left;">Shift Time</th>';
    html += '<th style="padding: 12px; text-align: left;">Duration</th>';
    html += '<th style="padding: 12px; text-align: left;">Status</th>';
    html += '</tr></thead><tbody>';
    
    // Create a week view
    for (let dayNum = 0; dayNum < 7; dayNum++) {
        const shiftsToday = job.shiftsScheduled.filter(s => s.day === dayNum);
        const isToday = dayNum === currentDay;
        
        if (shiftsToday.length > 0) {
            shiftsToday.forEach(shift => {
                const shiftStatus = getShiftStatus(shift);
                const rowClass = isToday ? 'current' : '';
                
                html += `<tr class="${rowClass}" style="border-bottom: 1px solid #ecf0f1;">`;
                html += `<td style="padding: 12px; font-weight: ${isToday ? 'bold' : 'normal'};">${isToday ? '👉 ' : ''}${days[dayNum]}</td>`;
                html += `<td style="padding: 12px;">${formatShiftTime(shift)}</td>`;
                html += `<td style="padding: 12px;">${shift.duration} hours</td>`;
                html += `<td style="padding: 12px;">${shiftStatus}</td>`;
                html += '</tr>';
            });
        } else {
            html += `<tr style="border-bottom: 1px solid #ecf0f1; opacity: 0.5;">`;
            html += `<td style="padding: 12px;">${days[dayNum]}</td>`;
            html += `<td colspan="3" style="padding: 12px; text-align: center; color: #95a5a6;">Off</td>`;
            html += '</tr>';
        }
    }
    
    html += '</tbody></table></div>';
    
    const totalHours = job.shiftsScheduled.reduce((sum, s) => sum + s.duration, 0);
    const weeklyPay = totalHours * job.wage;
    
    html += `
        <div class="stats-display mt-20">
            <div class="stat-box">
                <div class="icon">⏰</div>
                <div class="label">Weekly Hours</div>
                <div class="value">${totalHours}</div>
            </div>
            <div class="stat-box">
                <div class="icon">💰</div>
                <div class="label">Weekly Pay</div>
                <div class="value">$${weeklyPay}</div>
            </div>
            <div class="stat-box">
                <div class="icon">💵</div>
                <div class="label">Hourly Rate</div>
                <div class="value">$${job.wage}</div>
            </div>
        </div>
    `;
    
    html += `
        <div class="info-box mt-20">
            <h4>📋 Schedule Notes:</h4>
            <ul>
                <li>This is your recurring weekly schedule</li>
                <li>Clock in anytime during your shift window</li>
                <li>Being late is okay, but you'll work fewer hours</li>
                <li>Missing shifts entirely damages your record</li>
                <li>Want more hours? Request them from your manager!</li>
            </ul>
        </div>
    `;
    
    return html;
}

function getCurrentShift(job) {
    const currentDay = GameState.time.day;
    const currentMinutes = GameState.time.hour * 60 + GameState.time.minute;
    
    return job.shiftsScheduled.find(shift => {
        if (shift.day !== currentDay) return false;
        
        const shiftStart = shift.startHour * 60 + shift.startMin;
        const shiftEnd = shiftStart + (shift.duration * 60);
        
        // Allow clocking in up to 15 minutes before and anytime during shift
        return currentMinutes >= (shiftStart - 15) && currentMinutes < shiftEnd;
    });
}

function getShiftStatus(shift) {
    const currentDay = GameState.time.day;
    const currentMinutes = GameState.time.hour * 60 + GameState.time.minute;
    
    if (shift.day === currentDay) {
        const shiftStart = shift.startHour * 60 + shift.startMin;
        const shiftEnd = shiftStart + (shift.duration * 60);
        
        if (currentMinutes < shiftStart - 15) {
            return '<span style="color: #3498db;">⏰ Upcoming</span>';
        } else if (currentMinutes >= shiftStart - 15 && currentMinutes < shiftEnd) {
            return '<span style="color: #27ae60; font-weight: bold;">✅ CLOCK IN NOW!</span>';
        } else {
            return '<span style="color: #95a5a6;">✓ Completed/Missed</span>';
        }
    } else if (shift.day < currentDay || (shift.day > currentDay && shift.day - currentDay > 3)) {
        return '<span style="color: #95a5a6;">⏳ Future</span>';
    } else {
        return '<span style="color: #3498db;">⏳ Scheduled</span>';
    }
}

function formatShiftTime(shift) {
    const startHour = shift.startHour;
    const startMin = shift.startMin;
    const endHour = startHour + shift.duration;
    
    const formatTime = (h, m) => {
        const period = h >= 12 ? 'PM' : 'AM';
        const hour12 = h > 12 ? h - 12 : (h === 0 ? 12 : h);
        return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
    };
    
    return `${formatTime(startHour, startMin)} - ${formatTime(endHour, startMin)}`;
}

function clockIn() {
    const job = GameState.work.currentJob;
    if (!job) return;
    
    const currentShift = getCurrentShift(job);
    if (!currentShift) {
        UI.showNotification('❌ No shift scheduled right now!', 'error');
        return;
    }
    
    if (GameState.isBusy()) {
        UI.showNotification('❌ You are already busy!', 'warning');
        return;
    }
    
    const shiftMinutes = currentShift.duration * 60;
    const earnings = job.wage * currentShift.duration;
    
    UI.showNotification(`💼 Clocking in... Working ${currentShift.duration}h shift`, 'info');
    
    // Set busy
    GameState.setBusy('working', shiftMinutes);
    
    // Advance time
    if (typeof TimeManager !== 'undefined' && TimeManager.advanceTime) {
        TimeManager.advanceTime(shiftMinutes);
    }
    
    // Apply effects
    GameState.addMoney(earnings, job.title);
    GameState.stats.hoursWorked += currentShift.duration;
    GameState.addSkill('communication', 3);
    GameState.addSkill('timeManagement', 2);
    GameState.addSkill('responsibility', 3);
    
    job.shiftsWorked++;
    
    // Stress calculation
    let stressGain = 15;
    if (GameState.player.age < 18 && GameState.isWeekday()) {
        stressGain += 10;
        UI.showNotification('😓 Balancing school and work is stressful!', 'warning', 3000);
    }
    GameState.needs.stress = Math.min(100, GameState.needs.stress + stressGain);
    GameState.needs.energy = Math.max(0, GameState.needs.energy - (currentShift.duration * 5));
    GameState.needs.hunger = Math.max(0, GameState.needs.hunger - (currentShift.duration * 4));
    
    // Clear busy
    GameState.clearBusy();
    
    UI.showNotification(`✅ Shift complete! Earned $${earnings.toFixed(2)} (${currentShift.duration}h @ $${job.wage}/h)`, 'success');
    
    // Check for achievements
    if (job.shiftsWorked >= 10) {
        GameState.addAchievement('Hard Worker', 'Work 10 shifts at your job', '💼');
    }
    
    loadJobCenter();
    UI.updateStats();
}

function requestMoreHours() {
    const job = GameState.work.currentJob;
    if (!job || !job.canRequestMoreHours) return;
    
    if (!confirm('Request more hours from your manager? They will review your request and update your schedule.')) {
        return;
    }
    
    job.canRequestMoreHours = false;
    UI.showNotification('📋 Request submitted! Your manager will respond soon.', 'info');
    
    // Simulate manager response after some time
    setTimeout(() => {
        if (!GameState.work.currentJob || GameState.work.currentJob.id !== job.id) return;
        
        // Add 1-2 more shifts
        const newShifts = Math.floor(Math.random() * 2) + 1;
        
        // Find available days
        const occupiedDays = job.shiftsScheduled.map(s => s.day);
        const availableDays = [0, 1, 2, 3, 4, 5, 6].filter(d => !occupiedDays.includes(d));
        
        if (availableDays.length > 0) {
            for (let i = 0; i < Math.min(newShifts, availableDays.length); i++) {
                const day = availableDays[i];
                const isWeekend = day === 0 || day === 6;
                
                job.shiftsScheduled.push({
                    day: day,
                    startHour: isWeekend ? 10 : 16,
                    startMin: 0,
                    duration: isWeekend ? 6 : 4
                });
            }
            
            job.hoursPerWeek += newShifts * 4;
            UI.showNotification('✅ Request approved! Check your updated schedule!', 'success');
        } else {
            UI.showNotification('📋 Schedule is full. No additional shifts available.', 'info');
        }
        
        job.canRequestMoreHours = true;
        
        if (document.getElementById('job-current')?.classList.contains('active')) {
            loadJobCenter();
            showJobTab(event, 'current');
        }
    }, 5000); // 5 seconds simulates waiting for approval
    
    loadJobCenter();
}

function quitJob() {
    if (!GameState.work.currentJob) return;
    
    const job = GameState.work.currentJob;
    
    if (!confirm(`Quit your job as ${job.title}? You'll lose your schedule and have to reapply if you want to work here again.`)) {
        return;
    }
    
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
