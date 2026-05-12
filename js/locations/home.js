<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Life Skills Academy</title>
    
    <!-- Three.js for 3D City -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
    
    <!-- CSS Files -->
    <link rel="stylesheet" href="css/main.css">
    <link rel="stylesheet" href="css/city3d.css">
    <link rel="stylesheet" href="css/locations.css">
    <link rel="stylesheet" href="css/minigames.css">
</head>
<body>
    <div id="app">
        <!-- Top Status Bar -->
        <div id="topBar">
            <div class="time-section">
                <div class="time-display" id="timeDisplay">Monday, Sep 1 - 7:00 AM</div>
                <div class="time-controls">
                    <button class="time-btn pause" id="pauseBtn" onclick="togglePause()">⏸</button>
                    <button class="time-btn active" id="speed1" onclick="setSpeed(1)">1x</button>
                    <button class="time-btn" id="speed3" onclick="setSpeed(3)">3x</button>
                    <button class="time-btn" id="speed10" onclick="setSpeed(10)">10x</button>
                </div>
            </div>
            <div class="stats-section">
                <div class="stat">👤 <span id="playerName">Alex</span></div>
                <div class="stat">🎂 <span id="playerAge">14</span> yrs</div>
                <div class="stat">💵 $<span id="cash">50</span></div>
                <div class="stat">🏦 $<span id="bank">0</span></div>
                <div class="stat">📚 GPA: <span id="gpa">0.0</span></div>
            </div>
        </div>
        
        <!-- 3D City View -->
        <div id="cityContainer">
            <canvas id="cityCanvas"></canvas>
            
            <!-- City Controls -->
            <div id="cityControls">
                <button class="control-btn" id="rotateLeft">↻ Rotate</button>
                <button class="control-btn" id="rotateRight">Rotate ↺</button>
                <button class="control-btn" id="zoomIn">🔍+</button>
                <button class="control-btn" id="zoomOut">🔍−</button>
            </div>
            
            <!-- Building Tooltip -->
            <div id="buildingTooltip" class="tooltip hidden">
                <div class="tooltip-title"></div>
                <div class="tooltip-desc"></div>
                <div class="tooltip-hint">Click to enter</div>
            </div>
        </div>
        
        <!-- Location Screen -->
        <div id="locationScreen" class="hidden">
            <div class="location-header">
                <h2 id="locationTitle">Location</h2>
                <button class="btn-back" id="backBtn" onclick="backToCity()">← Back to City</button>
            </div>
            <div class="location-content" id="locationContent"></div>
        </div>
        
        <!-- Onboarding -->
        <div id="onboarding" class="modal-overlay active">
            <div class="modal-content">
                <h1>🎓 Life Skills Academy</h1>
                <p class="subtitle">Learn Real Life Skills Through Simulation</p>
                
                <div class="info-box">
                    <h3>Your Journey:</h3>
                    <ul>
                        <li><strong>Ages 14-17:</strong> Live as a teen - chores, school, jobs</li>
                        <li><strong>Age 18+:</strong> Real world - rent, bills, credit cards</li>
                        <li><strong>Learn:</strong> Cooking, banking, budgeting, and more!</li>
                    </ul>
                </div>
                
                <div class="form-group">
                    <label>Your Name:</label>
                    <input type="text" id="nameInput" value="Alex" maxlength="15">
                </div>
                
                <div class="form-group">
                    <label>Gender:</label>
                    <select id="genderInput">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                
                <button class="btn-primary btn-large" onclick="startGame()">
                    Begin Your Life Journey →
                </button>
            </div>
        </div>
    </div>
    
    <!-- Core Scripts - MUST LOAD IN THIS ORDER -->
    <script src="js/state.js"></script>
    <script src="js/utils/saveload.js"></script>
    <script src="js/utils/time.js"></script>
    <script src="js/utils/ui.js"></script>
    
    <!-- 3D City -->
    <script src="js/city3d.js"></script>
    
    <!-- Location Scripts -->
    <script src="js/locations/home.js"></script>
    <script src="js/locations/school.js"></script>
    <script src="js/locations/store.js"></script>
    <script src="js/locations/bank.js"></script>
    <script src="js/locations/jobcenter.js"></script>
    <script src="js/locations/postoffice.js"></script>
    <script src="js/locations/apartments.js"></script>
    <script src="js/locations/college.js"></script>
    
    <!-- Minigame Scripts -->
    <script src="js/minigames/chores.js"></script>
    <script src="js/minigames/cooking.js"></script>
    <script src="js/minigames/laundry.js"></script>
    <script src="js/minigames/checkwriting.js"></script>
    
    <!-- Main Game Logic - MUST LOAD LAST -->
    <script src="js/game.js"></script>
</body>
</html>
