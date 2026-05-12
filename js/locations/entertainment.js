// ==================== ENTERTAINMENT CENTER ====================

function loadEntertainment() {
    document.getElementById('locationTitle').textContent = '🎮 Entertainment Center';
    
    const content = `
        <div class="tabs">
            <div class="tab active" onclick="showEntertainmentTab('overview')">Overview</div>
            <div class="tab" onclick="showEntertainmentTab('bowling')">🎳 Bowling</div>
            <div class="tab" onclick="showEntertainmentTab('skating')">⛸️ Skating</div>
            <div class="tab" onclick="showEntertainmentTab('arcade')">🕹️ Arcade</div>
            <div class="tab" onclick="showEntertainmentTab('hangout')">👥 Hangout</div>
        </div>
        
        <div id="ent-overview" class="tab-content active">
            ${renderEntertainmentOverview()}
        </div>
        
        <div id="ent-bowling" class="tab-content">
            ${renderBowling()}
        </div>
        
        <div id="ent-skating" class="tab-content">
            ${renderSkating()}
        </div>
        
        <div id="ent-arcade" class="tab-content">
            ${renderArcade()}
        </div>
        
        <div id="ent-hangout" class="tab-content">
            ${renderHangout()}
        </div>
    `;
    
    document.getElementById('locationContent').innerHTML = content;
}

function showEntertainmentTab(tab) {
    document.querySelectorAll('#locationContent .tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#locationContent .tab-content').forEach(t => t.classList.remove('active'));
    
    event.target.classList.add('active');
    document.getElementById(`ent-${tab}`).classList.add('active');
}

function renderEntertainmentOverview() {
    return `
        <h3>🎮 Welcome to the Entertainment Center!</h3>
        
        <div class="alert alert-info">
            💰 Your Cash: $${GameState.money.cash.toFixed(2)} | 
            ⚡ Social Energy: ${GameState.entertainment.socialEnergy}%
        </div>
        
        <div class="content-grid">
            <div class="card">
                <div class="card-title">🎳 Bowling Alley</div>
                <div class="card-content">
                    <p>Knock down those pins! Practice your bowling skills.</p>
                    <p><strong>Cost:</strong> $15 per game</p>
                    <p><strong>Time:</strong> 1 hour</p>
                    <p><strong>Skill Gain:</strong> +Bowling, +Social Energy</p>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">⛸️ Skating Rink</div>
                <div class="card-content">
                    <p>Glide around the rink with friends!</p>
                    <p><strong>Cost:</strong> $12 per session</p>
                    <p><strong>Time:</strong> 2 hours</p>
                    <p><strong>Skill Gain:</strong> +Skating, +Social Energy</p>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">🕹️ Arcade</div>
                <div class="card-content">
                    <p>Play classic arcade games!</p>
                    <p><strong>Cost:</strong> $5 per 30 minutes</p>
                    <p><strong>Time:</strong> 30 minutes</p>
                    <p><strong>Rewards:</strong> Tickets & prizes</p>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">👥 Friend Hangout</div>
                <div class="card-content">
                    <p>Spend time with friends (FREE!)</p>
                    <p><strong>Cost:</strong> FREE</p>
                    <p><strong>Time:</strong> 1 hour</p>
                    <p><strong>Benefit:</strong> +Friendship, +Social Energy</p>
                </div>
            </div>
        </div>
        
        <div class="info-box mt-20">
            <h4>💡 Entertainment Tips:</h4>
            <ul>
                <li>Balance fun with responsibilities!</li>
                <li>Social activities boost your mood and energy</li>
                <li>Don't spend all your money on entertainment</li>
                <li>Make time for friends - it's important!</li>
                <li>Some activities improve skills that help in life</li>
            </ul>
        </div>
    `;
}

function renderBowling() {
    const cost = 15;
    const canAfford = GameState.money.cash >= cost;
    const isBusy = GameState.isBusy();
    
    return `
        <h3>🎳 Bowling Alley</h3>
        
        <div class="card">
            <div class="card-title">Strike Zone Bowling</div>
            <div class="card-content">
                <div class="stats-display">
                    <div class="stat-box">
                        <div class="icon">🎳</div>
                        <div class="label">Your Skill</div>
                        <div class="value">${GameState.skills.bowling}/100</div>
                    </div>
                    <div class="stat-box">
                        <div class="icon">💵</div>
                        <div class="label">Cost</div>
                        <div class="value">$${cost}</div>
                    </div>
                    <div class="stat-box">
                        <div class="icon">⏱️</div>
                        <div class="label">Duration</div>
                        <div class="value">1 hour</div>
                    </div>
                </div>
                
                <div class="mt-20">
                    ${!canAfford ? '<div class="alert alert-danger">❌ Not enough cash!</div>' : ''}
                    ${isBusy ? '<div class="alert alert-warning">⏳ You\'re busy with another activity!</div>' : ''}
                    
                    <button class="btn btn-primary btn-large" 
                            onclick="playBowling()" 
                            ${!canAfford || isBusy ? 'disabled' : ''}>
                        🎳 Play Bowling ($${cost})
                    </button>
                </div>
                
                <div class="info-box mt-20">
                    <h4>How to Play:</h4>
                    <p>Roll the ball down the lane and try to knock down all 10 pins!</p>
                    <ul>
                        <li>Each game has 10 frames</li>
                        <li>2 rolls per frame (unless you get a strike!)</li>
                        <li>Strike = All pins on first roll (10 bonus points)</li>
                        <li>Spare = All pins in 2 rolls (bonus points)</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

function playBowling() {
    if (GameState.spendMoney(15, 'bowling')) {
        GameState.setBusy(1, 'Bowling');
        GameState.stats.gamesPlayed++;
        
        // Start bowling minigame
        if (window.EntertainmentGames) {
            EntertainmentGames.startBowling();
        }
    }
}

function renderSkating() {
    const cost = 12;
    const canAfford = GameState.money.cash >= cost;
    const isBusy = GameState.isBusy();
    
    return `
        <h3>⛸️ Skating Rink</h3>
        
        <div class="card">
            <div class="card-title">Ice & Roller Skating</div>
            <div class="card-content">
                <div class="stats-display">
                    <div class="stat-box">
                        <div class="icon">⛸️</div>
                        <div class="label">Your Skill</div>
                        <div class="value">${GameState.skills.skating}/100</div>
                    </div>
                    <div class="stat-box">
                        <div class="icon">💵</div>
                        <div class="label">Cost</div>
                        <div class="value">$${cost}</div>
                    </div>
                    <div class="stat-box">
                        <div class="icon">⏱️</div>
                        <div class="label">Duration</div>
                        <div class="value">2 hours</div>
                    </div>
                </div>
                
                <div class="mt-20">
                    ${!canAfford ? '<div class="alert alert-danger">❌ Not enough cash!</div>' : ''}
                    ${isBusy ? '<div class="alert alert-warning">⏳ You\'re busy with another activity!</div>' : ''}
                    
                    <button class="btn btn-primary btn-large" 
                            onclick="goSkating()" 
                            ${!canAfford || isBusy ? 'disabled' : ''}>
                        ⛸️ Go Skating ($${cost})
                    </button>
                </div>
                
                <div class="info-box mt-20">
                    <h4>What to Expect:</h4>
                    <ul>
                        <li>Skate rental included in price</li>
                        <li>Music and lights make it fun!</li>
                        <li>Great way to hang out with friends</li>
                        <li>Improves balance and coordination</li>
                        <li>Builds social connections</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

function goSkating() {
    if (GameState.spendMoney(12, 'skating')) {
        GameState.setBusy(2, 'Skating');
        GameState.addSkill('skating', 5);
        GameState.entertainment.socialEnergy = Math.min(100, GameState.entertainment.socialEnergy + 20);
        GameState.stats.gamesPlayed++;
        
        UI.showNotification('⛸️ Having fun skating!', 'success');
        
        // Start skating minigame
        if (window.EntertainmentGames) {
            EntertainmentGames.startSkating();
        }
        
        UI.updateStats();
    }
}

function renderArcade() {
    const cost = 5;
    const canAfford = GameState.money.cash >= cost;
    const isBusy = GameState.isBusy();
    
    return `
        <h3>🕹️ Arcade Games</h3>
        
        <p>Classic arcade games! Earn tickets to win prizes!</p>
        
        <div class="content-grid">
            <div class="card">
                <div class="card-title">🎯 Target Shooter</div>
                <div class="card-content">
                    <p>Hit the targets to earn tickets!</p>
                    <p><strong>Cost:</strong> $${cost}</p>
                    <p><strong>Tickets:</strong> 10-50</p>
                    <button class="btn btn-success" onclick="playArcadeGame('shooter')" ${!canAfford || isBusy ? 'disabled' : ''}>
                        Play Game
                    </button>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">🏀 Basketball</div>
                <div class="card-content">
                    <p>Shoot hoops before time runs out!</p>
                    <p><strong>Cost:</strong> $${cost}</p>
                    <p><strong>Tickets:</strong> 15-60</p>
                    <button class="btn btn-success" onclick="playArcadeGame('basketball')" ${!canAfford || isBusy ? 'disabled' : ''}>
                        Play Game
                    </button>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">🎮 Racing Game</div>
                <div class="card-content">
                    <p>Race against the clock!</p>
                    <p><strong>Cost:</strong> $${cost}</p>
                    <p><strong>Tickets:</strong> 20-80</p>
                    <button class="btn btn-success" onclick="playArcadeGame('racing')" ${!canAfford || isBusy ? 'disabled' : ''}>
                        Play Game
                    </button>
                </div>
            </div>
        </div>
        
        ${!canAfford ? '<div class="alert alert-danger mt-20">❌ Not enough cash for arcade games!</div>' : ''}
        ${isBusy ? '<div class="alert alert-warning mt-20">⏳ You\'re busy with another activity!</div>' : ''}
    `;
}

function playArcadeGame(gameType) {
    if (GameState.spendMoney(5, 'arcade game')) {
        GameState.entertainment.socialEnergy = Math.min(100, GameState.entertainment.socialEnergy + 10);
        GameState.stats.gamesPlayed++;
        
        // Random ticket earnings
        const tickets = Math.floor(Math.random() * 40) + 20;
        
        UI.showNotification(`🎮 Fun game! Earned ${tickets} tickets!`, 'success');
        
        if (window.EntertainmentGames) {
            EntertainmentGames.startArcade(gameType);
        }
        
        UI.updateStats();
    }
}

function renderHangout() {
    const isBusy = GameState.isBusy();
    
    return `
        <h3>👥 Hang Out with Friends</h3>
        
        <div class="card">
            <div class="card-title">Social Time</div>
            <div class="card-content">
                <p>Spend quality time with your friends. It's FREE and great for your mental health!</p>
                
                <div class="stats-display mt-20">
                    <div class="stat-box">
                        <div class="icon">👥</div>
                        <div class="label">Friendship</div>
                        <div class="value">${GameState.entertainment.friendships}</div>
                    </div>
                    <div class="stat-box">
                        <div class="icon">⚡</div>
                        <div class="label">Social Energy</div>
                        <div class="value">${GameState.entertainment.socialEnergy}%</div>
                    </div>
                    <div class="stat-box">
                        <div class="icon">⏱️</div>
                        <div class="label">Time</div>
                        <div class="value">1 hour</div>
                    </div>
                </div>
                
                <div class="mt-20">
                    ${isBusy ? '<div class="alert alert-warning">⏳ You\'re busy with another activity!</div>' : ''}
                    
                    <button class="btn btn-primary btn-large" onclick="hangOutWithFriends()" ${isBusy ? 'disabled' : ''}>
                        👥 Hang Out (FREE!)
                    </button>
                </div>
                
                <div class="info-box mt-20">
                    <h4>Benefits of Socializing:</h4>
                    <ul>
                        <li>Reduces stress and improves mood</li>
                        <li>Builds valuable friendships</li>
                        <li>Develops social skills</li>
                        <li>Creates happy memories</li>
                        <li>100% FREE!</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
}

function hangOutWithFriends() {
    GameState.setBusy(1, 'Hanging out with friends');
    GameState.entertainment.friendships++;
    GameState.entertainment.socialEnergy = Math.min(100, GameState.entertainment.socialEnergy + 30);
    GameState.entertainment.lastHangout = new Date().toISOString();
    
    UI.showNotification('👥 Having a great time with friends!', 'success');
    
    if (GameState.entertainment.friendships === 5) {
        GameState.addAchievement('Social Butterfly', 'Hang out with friends 5 times', '🦋');
    }
    
    setTimeout(() => {
        UI.showNotification('😊 That was fun! You feel refreshed!', 'success');
    }, 2000);
    
    UI.updateStats();
}
