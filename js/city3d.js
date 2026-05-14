// ==================== 3D CITY RENDERER ====================

const City3D = {
    scene: null,
    camera: null,
    renderer: null,
    buildings: [],
    hoveredBuilding: null,
    raycaster: null,
    mouse: null,
    animationId: null,
    isRendering: false,
    
    buildingData: [
        // Residential
        { name: 'Home', color: 0xff5555, x: -12, z: 12, width: 3, height: 2.5, desc: 'Your family home', icon: '🏠' },
        { name: 'Apartments', color: 0x8b4513, x: 12, z: 12, width: 3, height: 4.5, desc: 'Live independently (18+)', icon: '🏢' },
        
        // Education
        { name: 'School', color: 0x5555ff, x: -12, z: -12, width: 4.5, height: 3, desc: 'Learn and grow', icon: '🏫' },
        { name: 'College', color: 0x20b2aa, x: 12, z: -12, width: 4.5, height: 3.5, desc: 'Higher education (Grade 12)', icon: '🎓' },
        
        // Shopping
        { name: 'Store', color: 0xffaa55, x: -12, z: 0, width: 3, height: 2, desc: 'Buy supplies', icon: '🏪' },
        { name: 'Grocery Store', color: 0x4caf50, x: -6, z: 6, width: 3.5, height: 2.5, desc: 'Work as grocery bagger', icon: '🛒' },
        
        // Services
        { name: 'Bank', color: 0x55ff55, x: 0, z: 0, width: 3, height: 3, desc: 'Manage money', icon: '🏦' },
        { name: 'Post Office', color: 0xaaaaaa, x: 6, z: 0, width: 2.5, height: 2, desc: 'Mail and bills', icon: '📮' },
        { name: 'Job Center', color: 0xaa55ff, x: 0, z: -6, width: 3, height: 2.5, desc: 'Find work', icon: '💼' },
        
        // Recreation
        { name: 'Gym', color: 0xe91e63, x: -6, z: -6, width: 3.5, height: 2.5, desc: 'Exercise and stay healthy', icon: '🏋️' },
        { name: 'Park', color: 0x66bb6a, x: 0, z: 6, width: 4, height: 1, desc: 'Relax and enjoy nature', icon: '🌳' },
        
        // Work Locations
        { name: 'Fast Food', color: 0xff6b35, x: 6, z: 6, width: 3, height: 2, desc: 'Work the fryer', icon: '🍔' },
        { name: 'Retail Shop', color: 0x9c27b0, x: 6, z: -6, width: 3, height: 2.5, desc: 'Work retail sales', icon: '👕' },
        { name: 'Office Building', color: 0x607d8b, x: 12, z: 0, width: 3.5, height: 5, desc: 'Office assistant work', icon: '📎' }
    ],
    
    init() {
        console.log('Initializing 3D City...');
        
        try {
            // Setup Three.js
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x87ceeb);
            this.scene.fog = new THREE.Fog(0x87ceeb, 30, 80);
            
            // Camera
            this.camera = new THREE.PerspectiveCamera(
                60,
                window.innerWidth / (window.innerHeight - 60),
                0.1,
                1000
            );
            this.camera.position.set(0, 20, 30);
            this.camera.lookAt(0, 0, 0);
            
            // Renderer
            const canvas = document.getElementById('cityCanvas');
            if (!canvas) {
                throw new Error('Canvas element not found');
            }
            
            this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
            this.renderer.setSize(window.innerWidth, window.innerHeight - 60);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            
            // Raycaster for hover detection
            this.raycaster = new THREE.Raycaster();
            this.mouse = new THREE.Vector2();
            
            // Build the city
            this.createLighting();
            this.createGround();
            this.createBuildings();
            this.createEnvironment();
            
            // Event listeners
            this.setupEventListeners();
            
            // Start animation loop
            this.isRendering = true;
            this.animate();
            
            console.log('✓ 3D City initialized');
        } catch (error) {
            console.error('Failed to initialize 3D city:', error);
            UI.showNotification('Failed to load 3D view', 'error');
        }
    },
    
    createLighting() {
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambient);
        
        const sun = new THREE.DirectionalLight(0xffffff, 0.8);
        sun.position.set(10, 20, 10);
        sun.castShadow = true;
        sun.shadow.camera.left = -30;
        sun.shadow.camera.right = 30;
        sun.shadow.camera.top = 30;
        sun.shadow.camera.bottom = -30;
        sun.shadow.mapSize.width = 2048;
        sun.shadow.mapSize.height = 2048;
        this.scene.add(sun);
    },
    
    createGround() {
        const groundGeometry = new THREE.PlaneGeometry(80, 80);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x5a8f5a });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        // Horizontal roads
        const roadH1 = new THREE.Mesh(new THREE.PlaneGeometry(80, 4), roadMaterial);
        roadH1.rotation.x = -Math.PI / 2;
        roadH1.position.y = 0.01;
        roadH1.position.z = 6;
        this.scene.add(roadH1);
        
        const roadH2 = new THREE.Mesh(new THREE.PlaneGeometry(80, 4), roadMaterial);
        roadH2.rotation.x = -Math.PI / 2;
        roadH2.position.y = 0.01;
        roadH2.position.z = 0;
        this.scene.add(roadH2);
        
        const roadH3 = new THREE.Mesh(new THREE.PlaneGeometry(80, 4), roadMaterial);
        roadH3.rotation.x = -Math.PI / 2;
        roadH3.position.y = 0.01;
        roadH3.position.z = -6;
        this.scene.add(roadH3);
        
        // Vertical roads
        const roadV1 = new THREE.Mesh(new THREE.PlaneGeometry(4, 80), roadMaterial);
        roadV1.rotation.x = -Math.PI / 2;
        roadV1.position.y = 0.01;
        roadV1.position.x = -6;
        this.scene.add(roadV1);
        
        const roadV2 = new THREE.Mesh(new THREE.PlaneGeometry(4, 80), roadMaterial);
        roadV2.rotation.x = -Math.PI / 2;
        roadV2.position.y = 0.01;
        roadV2.position.x = 0;
        this.scene.add(roadV2);
        
        const roadV3 = new THREE.Mesh(new THREE.PlaneGeometry(4, 80), roadMaterial);
        roadV3.rotation.x = -Math.PI / 2;
        roadV3.position.y = 0.01;
        roadV3.position.x = 6;
        this.scene.add(roadV3);
        
        // Road markings
        const markingMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        for (let i = -30; i < 30; i += 4) {
            // Horizontal road markings
            const markingH1 = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 2), markingMaterial);
            markingH1.rotation.x = -Math.PI / 2;
            markingH1.position.set(i, 0.02, 6);
            this.scene.add(markingH1);
            
            const markingH2 = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 2), markingMaterial);
            markingH2.rotation.x = -Math.PI / 2;
            markingH2.position.set(i, 0.02, 0);
            this.scene.add(markingH2);
            
            const markingH3 = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 2), markingMaterial);
            markingH3.rotation.x = -Math.PI / 2;
            markingH3.position.set(i, 0.02, -6);
            this.scene.add(markingH3);
            
            // Vertical road markings
            const markingV1 = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.3), markingMaterial);
            markingV1.rotation.x = -Math.PI / 2;
            markingV1.position.set(-6, 0.02, i);
            this.scene.add(markingV1);
            
            const markingV2 = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.3), markingMaterial);
            markingV2.rotation.x = -Math.PI / 2;
            markingV2.position.set(0, 0.02, i);
            this.scene.add(markingV2);
            
            const markingV3 = new THREE.Mesh(new THREE.PlaneGeometry(2, 0.3), markingMaterial);
            markingV3.rotation.x = -Math.PI / 2;
            markingV3.position.set(6, 0.02, i);
            this.scene.add(markingV3);
        }
    },
    
    createBuildings() {
        this.buildingData.forEach(data => {
            const building = this.createBuilding(data);
            this.buildings.push({
                mesh: building,
                data: data
            });
            this.scene.add(building);
        });
    },
    
    createBuilding(data) {
        const group = new THREE.Group();
        
        // Main building
        const geometry = new THREE.BoxGeometry(data.width, data.height, data.width);
        const material = new THREE.MeshLambertMaterial({ color: data.color });
        const building = new THREE.Mesh(geometry, material);
        building.position.y = data.height / 2;
        building.castShadow = true;
        building.receiveShadow = true;
        group.add(building);
        
        // Roof
        const roofGeometry = new THREE.ConeGeometry(data.width * 0.7, data.height * 0.3, 4);
        const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const roof = new THREE.Mesh(roofGeometry, roofMaterial);
        roof.position.y = data.height + data.height * 0.15;
        roof.rotation.y = Math.PI / 4;
        roof.castShadow = true;
        group.add(roof);
        
        // Windows
        const windowMaterial = new THREE.MeshBasicMaterial({ color: 0x88ccff });
        const windowSize = 0.3;
        const windowSpacing = 0.8;
        
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                const window = new THREE.Mesh(
                    new THREE.PlaneGeometry(windowSize, windowSize),
                    windowMaterial
                );
                window.position.set(
                    -windowSpacing / 2 + j * windowSpacing,
                    0.5 + i * 0.8,
                    data.width / 2 + 0.01
                );
                group.add(window);
            }
        }
        
        // Door
        const doorGeometry = new THREE.PlaneGeometry(0.6, 1);
        const doorMaterial = new THREE.MeshLambertMaterial({ color: 0x654321 });
        const door = new THREE.Mesh(doorGeometry, doorMaterial);
        door.position.set(0, 0.5, data.width / 2 + 0.01);
        group.add(door);
        
        // Create text label using Canvas
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 512;
        canvas.height = 128;
        
        // Background
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        // Text
        context.fillStyle = 'white';
        context.font = 'bold 48px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(data.name, canvas.width / 2, canvas.height / 2);
        
        // Create texture from canvas
        const texture = new THREE.CanvasTexture(canvas);
        const labelMaterial = new THREE.SpriteMaterial({ map: texture });
        const label = new THREE.Sprite(labelMaterial);
        
        // Position label above building
        label.position.set(0, data.height + 1, 0);
        label.scale.set(4, 1, 1);
        
        group.add(label);
        
        group.position.set(data.x, 0, data.z);
        group.userData = data;
        
        return group;
    },
    
    createEnvironment() {
        const treePositions = [
            [-18, 18], [18, 18], [-18, -18], [18, -18],
            [-18, 0], [18, 0], [0, 18], [0, -18],
            [-15, 9], [15, 9], [-15, -9], [15, -9],
            [-9, 15], [9, 15], [-9, -15], [9, -15]
        ];
        
        treePositions.forEach(pos => {
            const tree = this.createTree();
            tree.position.set(pos[0], 0, pos[1]);
            this.scene.add(tree);
        });
        
        const lightPositions = [
            [-9, 9], [9, 9], [-9, -9], [9, -9],
            [-3, 3], [3, 3], [-3, -3], [3, -3]
        ];
        
        lightPositions.forEach(pos => {
            const light = this.createStreetLight();
            light.position.set(pos[0], 0, pos[1]);
            this.scene.add(light);
        });
        
        for (let i = 0; i < 15; i++) {
            const cloud = this.createCloud();
            cloud.position.set(
                Math.random() * 60 - 30,
                20 + Math.random() * 10,
                Math.random() * 60 - 30
            );
            this.scene.add(cloud);
        }
    },
    
    createTree() {
        const group = new THREE.Group();
        
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1;
        trunk.castShadow = true;
        group.add(trunk);
        
        const leavesGeometry = new THREE.SphereGeometry(1.2, 8, 8);
        const leavesMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });
        const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
        leaves.position.y = 2.5;
        leaves.castShadow = true;
        group.add(leaves);
        
        return group;
    },
    
    createStreetLight() {
        const group = new THREE.Group();
        
        const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = 2;
        pole.castShadow = true;
        group.add(pole);
        
        const lightGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffaa });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.y = 4;
        group.add(light);
        
        const pointLight = new THREE.PointLight(0xffffaa, 0.5, 10);
        pointLight.position.y = 4;
        group.add(pointLight);
        
        return group;
    },
    
    createCloud() {
        const group = new THREE.Group();
        const cloudMaterial = new THREE.MeshBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        });
        
        for (let i = 0; i < 3; i++) {
            const sphere = new THREE.Mesh(
                new THREE.SphereGeometry(1 + Math.random(), 6, 6),
                cloudMaterial
            );
            sphere.position.x = (Math.random() - 0.5) * 2;
            sphere.position.y = (Math.random() - 0.5) * 0.5;
            sphere.position.z = (Math.random() - 0.5) * 2;
            group.add(sphere);
        }
        
        return group;
    },
    
    setupEventListeners() {
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseClick = this.onMouseClick.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);
        
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('click', this.onMouseClick);
        window.addEventListener('resize', this.onWindowResize);
        
        const rotateLeft = document.getElementById('rotateLeft');
        const rotateRight = document.getElementById('rotateRight');
        const zoomIn = document.getElementById('zoomIn');
        const zoomOut = document.getElementById('zoomOut');
        
        if (rotateLeft) rotateLeft.addEventListener('click', () => this.rotateCamera(-1));
        if (rotateRight) rotateRight.addEventListener('click', () => this.rotateCamera(1));
        if (zoomIn) zoomIn.addEventListener('click', () => this.zoomCamera(-1));
        if (zoomOut) zoomOut.addEventListener('click', () => this.zoomCamera(1));
    },
    
    onMouseMove(event) {
        if (!this.renderer) return;
        
        const canvas = this.renderer.domElement;
        const rect = canvas.getBoundingClientRect();
        
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.checkHover();
    },
    
    checkHover() {
        if (!this.raycaster || !this.camera) return;
        
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const buildingMeshes = this.buildings.map(b => b.mesh.children[0]);
        const intersects = this.raycaster.intersectObjects(buildingMeshes);
        
        if (this.hoveredBuilding) {
            this.hoveredBuilding.children[0].material.emissive.setHex(0x000000);
            this.hoveredBuilding = null;
            this.hideTooltip();
        }
        
        if (intersects.length > 0) {
            const building = intersects[0].object.parent;
            this.hoveredBuilding = building;
            building.children[0].material.emissive.setHex(0x444444);
            this.showTooltip(building.userData);
            document.body.style.cursor = 'pointer';
        } else {
            document.body.style.cursor = 'default';
        }
    },
    
    showTooltip(data) {
        const tooltip = document.getElementById('buildingTooltip');
        if (!tooltip) return;
        
        tooltip.classList.remove('hidden');
        
        const titleEl = tooltip.querySelector('.tooltip-title');
        const descEl = tooltip.querySelector('.tooltip-desc');
        
        if (titleEl) titleEl.textContent = `${data.icon} ${data.name}`;
        if (descEl) descEl.textContent = data.desc;
        
        tooltip.style.left = (this.mouse.x * 0.5 + 0.5) * window.innerWidth + 'px';
        tooltip.style.top = ((1 - this.mouse.y) * 0.5) * (window.innerHeight - 60) + 'px';
    },
    
    hideTooltip() {
        const tooltip = document.getElementById('buildingTooltip');
        if (tooltip) {
            tooltip.classList.add('hidden');
        }
    },
    
    onMouseClick(event) {
        if (this.hoveredBuilding) {
            const data = this.hoveredBuilding.userData;
            this.enterBuilding(data.name);
        }
    },
    
    enterBuilding(buildingName) {
        // Age/grade restrictions
        if (buildingName === 'Apartments' && GameState.player.age < GameState.ADULT_AGE) {
            UI.showNotification('❌ You must be 18 to rent an apartment!', 'error');
            return;
        }
        
        if (buildingName === 'College' && GameState.player.grade < 12) {
            UI.showNotification('❌ College is only available in Grade 12!', 'error');
            return;
        }
        
        // Pause rendering when entering location
        this.pauseRendering();
        
        document.getElementById('cityContainer').classList.add('hidden');
        document.getElementById('locationScreen').classList.remove('hidden');
        
        const locationMap = {
            'Home': 'loadHome',
            'School': 'loadSchool',
            'Store': 'loadStore',
            'Bank': 'loadBank',
            'Job Center': 'loadJobCenter',
            'Post Office': 'loadPostOffice',
            'Apartments': 'loadApartments',
            'College': 'loadCollege',
            'Gym': 'loadGym',
            'Park': 'loadPark',
            'Grocery Store': 'loadGroceryWork',
            'Fast Food': 'loadFastFoodWork',
            'Retail Shop': 'loadRetailWork',
            'Office Building': 'loadOfficeWork'
        };
        
        const loadFunction = locationMap[buildingName];
        if (loadFunction && typeof window[loadFunction] === 'function') {
            window[loadFunction]();
        } else {
            // Generic workplace loader
            loadWorkplace(buildingName);
        }
    },
    
    pauseRendering() {
        this.isRendering = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    },
    
    resumeRendering() {
        if (!this.isRendering) {
            this.isRendering = true;
            this.animate();
        }
    },
    
    rotateCamera(direction) {
        if (!this.camera) return;
        
        const angle = direction * Math.PI / 8;
        const x = this.camera.position.x;
        const z = this.camera.position.z;
        
        this.camera.position.x = x * Math.cos(angle) - z * Math.sin(angle);
        this.camera.position.z = x * Math.sin(angle) + z * Math.cos(angle);
        this.camera.lookAt(0, 0, 0);
    },
    
    zoomCamera(direction) {
        if (!this.camera) return;
        
        const factor = 1 + direction * 0.1;
        this.camera.position.multiplyScalar(factor);
        
        const distance = this.camera.position.length();
        if (distance < 20) {
            this.camera.position.normalize().multiplyScalar(20);
        } else if (distance > 50) {
            this.camera.position.normalize().multiplyScalar(50);
        }
    },
    
    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        this.camera.aspect = window.innerWidth / (window.innerHeight - 60);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight - 60);
    },
    
    animate() {
        if (!this.isRendering) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Animate clouds
        this.scene.children.forEach(obj => {
            if (obj.type === 'Group' && obj.children.length > 2 && 
                obj.children[0].geometry && obj.children[0].geometry.type === 'SphereGeometry') {
                obj.position.x += 0.002;
                if (obj.position.x > 35) obj.position.x = -35;
            }
        });
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    },
    
    destroy() {
        console.log('Destroying 3D City...');
        
        this.pauseRendering();
        
        // Remove event listeners
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('click', this.onMouseClick);
        window.removeEventListener('resize', this.onWindowResize);
        
        // Cleanup Three.js resources
        if (this.scene) {
            this.scene.traverse(obj => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) {
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach(mat => mat.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
            });
        }
        
        if (this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
        
        this.scene = null;
        this.camera = null;
        this.buildings = [];
        this.hoveredBuilding = null;
        this.raycaster = null;
        this.mouse = null;
        
        console.log('✓ 3D City destroyed');
    }
};

// Enhanced backToCity function
function backToCity() {
    // Remove emergency button if exists
    const btn = document.getElementById('emergencyBackBtn');
    if (btn) {
        btn.remove();
    }
    
    document.getElementById('cityContainer').classList.remove('hidden');
    document.getElementById('locationScreen').classList.add('hidden');
    City3D.hideTooltip();
    City3D.resumeRendering();
}

// Generic workplace loader for job locations
function loadWorkplace(locationName) {
    document.getElementById('locationTitle').textContent = locationName;
    
    const job = GameState.work.currentJob;
    const currentShift = job ? getCurrentShift(job) : null;
    
    let content = `
        <div class="card-large">
            <h2>${locationName}</h2>
            <p style="font-size: 18px; margin: 20px 0;">Welcome to your workplace!</p>
            
            ${job && job.title.includes(locationName.replace(/Fast Food|Grocery Store|Retail Shop|Office Building/, '')) ? `
                ${currentShift ? `
                    <div class="alert alert-success">
                        ✅ You have a shift right now! Clock in to start working.
                    </div>
                    <button class="btn btn-success btn-large" onclick="clockIn(); backToCity();" style="margin: 20px 0;">
                        🕐 Clock In
                    </button>
                ` : `
                    <div class="alert alert-info">
                        ℹ️ No shift scheduled right now. Check your schedule at the Job Center.
                    </div>
                `}
            ` : `
                <div class="alert alert-warning">
                    ⚠️ You don't work here. Visit the Job Center to apply for a job!
                </div>
            `}
        </div>
    `;
    
    document.getElementById('locationContent').innerHTML = content;
    
    // Add emergency button
    ensureBackButton();
}

// Gym location
function loadGym() {
    document.getElementById('locationTitle').textContent = '🏋️ Gym';
    
    const content = `
        <h3>💪 Fitness Center</h3>
        <p>Stay healthy and reduce stress through exercise!</p>
        
        <div class="content-grid">
            <div class="card">
                <div class="card-title">🏃 Cardio (30 min)</div>
                <div class="card-content">
                    <p>Run on the treadmill or use the elliptical</p>
                    <div class="info-row">
                        <span class="info-label">Time:</span>
                        <span class="info-value">30 minutes</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Benefits:</span>
                        <span class="info-value">Health +5, Stress -10</span>
                    </div>
                    <button class="btn btn-primary" onclick="exerciseCardio()">Start Cardio</button>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">🏋️ Strength Training (45 min)</div>
                <div class="card-content">
                    <p>Lift weights and build muscle</p>
                    <div class="info-row">
                        <span class="info-label">Time:</span>
                        <span class="info-value">45 minutes</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Benefits:</span>
                        <span class="info-value">Health +8, Stress -12</span>
                    </div>
                    <button class="btn btn-primary" onclick="exerciseStrength()">Start Strength</button>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">🧘 Yoga (60 min)</div>
                <div class="card-content">
                    <p>Stretch and find inner peace</p>
                    <div class="info-row">
                        <span class="info-label">Time:</span>
                        <span class="info-value">60 minutes</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">Benefits:</span>
                        <span class="info-value">Health +5, Stress -20, Happiness +10</span>
                    </div>
                    <button class="btn btn-primary" onclick="exerciseYoga()">Start Yoga</button>
                </div>
            </div>
        </div>
        
        <div class="info-box mt-20">
            <h4>💡 Gym Tips:</h4>
            <ul>
                <li>Exercise is one of the best ways to reduce stress!</li>
                <li>Regular workouts improve your health</li>
                <li>Working out costs energy but boosts happiness</li>
                <li>Take rest days to recover</li>
            </ul>
        </div>
    `;
    
    document.getElementById('locationContent').innerHTML = content;
    
    // Add emergency button
    ensureBackButton();
}

function exerciseCardio() {
    if (GameState.needs.energy < 20) {
        UI.showNotification('❌ Too tired to exercise!', 'error');
        return;
    }
    
    UI.showNotification('🏃 Running...', 'info');
    TimeManager.advanceTime(30);
    GameState.needs.energy = Math.max(0, GameState.needs.energy - 15);
    GameState.needs.health = Math.min(100, GameState.needs.health + 5);
    GameState.needs.stress = Math.max(0, GameState.needs.stress - 10);
    GameState.needs.hunger = Math.max(0, GameState.needs.hunger - 10);
    UI.showNotification('✅ Great cardio workout!', 'success');
    UI.updateStats();
}

function exerciseStrength() {
    if (GameState.needs.energy < 30) {
        UI.showNotification('❌ Too tired to lift weights!', 'error');
        return;
    }
    
    UI.showNotification('🏋️ Lifting weights...', 'info');
    TimeManager.advanceTime(45);
    GameState.needs.energy = Math.max(0, GameState.needs.energy - 25);
    GameState.needs.health = Math.min(100, GameState.needs.health + 8);
    GameState.needs.stress = Math.max(0, GameState.needs.stress - 12);
    GameState.needs.hunger = Math.max(0, GameState.needs.hunger - 15);
    UI.showNotification('✅ Feeling strong!', 'success');
    UI.updateStats();
}

function exerciseYoga() {
    if (GameState.needs.energy < 15) {
        UI.showNotification('❌ Too tired for yoga!', 'error');
        return;
    }
    
    UI.showNotification('🧘 Finding inner peace...', 'info');
    TimeManager.advanceTime(60);
    GameState.needs.energy = Math.max(0, GameState.needs.energy - 10);
    GameState.needs.health = Math.min(100, GameState.needs.health + 5);
    GameState.needs.stress = Math.max(0, GameState.needs.stress - 20);
    GameState.needs.happiness = Math.min(100, GameState.needs.happiness + 10);
    GameState.needs.hunger = Math.max(0, GameState.needs.hunger - 8);
    UI.showNotification('✅ Namaste! Feeling peaceful.', 'success');
    UI.updateStats();
}

// Park location
function loadPark() {
    document.getElementById('locationTitle').textContent = '🌳 Park';
    
    const content = `
        <h3>🌳 City Park</h3>
        <p>Enjoy nature and relax!</p>
        
        <div class="content-grid">
            <div class="card">
                <div class="card-title">🚶 Take a Walk (20 min)</div>
                <div class="card-content">
                    <p>Stroll through the park</p>
                    <button class="btn btn-primary" onclick="parkWalk()">Go for Walk</button>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">📖 Read a Book (60 min)</div>
                <div class="card-content">
                    <p>Relax with a good book</p>
                    <button class="btn btn-primary" onclick="parkRead()">Read</button>
                </div>
            </div>
            
            <div class="card">
                <div class="card-title">🎨 People Watch (30 min)</div>
                <div class="card-content">
                    <p>Observe and relax</p>
                    <button class="btn btn-primary" onclick="parkRelax()">Relax</button>
                </div>
            </div>
        </div>
    `;
    
    document.getElementById('locationContent').innerHTML = content;
    
    // Add emergency button
    ensureBackButton();
}

function parkWalk() {
    UI.showNotification('🚶 Walking...', 'info');
    TimeManager.advanceTime(20);
    GameState.needs.stress = Math.max(0, GameState.needs.stress - 8);
    GameState.needs.happiness = Math.min(100, GameState.needs.happiness + 5);
    UI.showNotification('✅ Refreshing walk!', 'success');
    UI.updateStats();
}

function parkRead() {
    UI.showNotification('📖 Reading...', 'info');
    TimeManager.advanceTime(60);
    GameState.needs.stress = Math.max(0, GameState.needs.stress - 15);
    GameState.needs.happiness = Math.min(100, GameState.needs.happiness + 10);
    UI.showNotification('✅ Great book!', 'success');
    UI.updateStats();
}

function parkRelax() {
    UI.showNotification('🎨 Relaxing...', 'info');
    TimeManager.advanceTime(30);
    GameState.needs.stress = Math.max(0, GameState.needs.stress - 12);
    GameState.needs.happiness = Math.min(100, GameState.needs.happiness + 8);
    UI.showNotification('✅ Feeling peaceful!', 'success');
    UI.updateStats();
}

// Emergency back button system
function ensureBackButton() {
    // Remove old button if exists
    const oldBtn = document.getElementById('emergencyBackBtn');
    if (oldBtn) {
        oldBtn.remove();
    }
    
    // Create new button
    const btn = document.createElement('button');
    btn.id = 'emergencyBackBtn';
    btn.innerHTML = '⬅️ Back to City';
    btn.onclick = backToCity;
    
    document.body.appendChild(btn);
}

// Override enterBuilding to add back button
const originalEnterBuilding = City3D.enterBuilding;
City3D.enterBuilding = function(buildingName) {
    originalEnterBuilding.call(this, buildingName);
    setTimeout(ensureBackButton, 100);
};

// Wrapper function for compatibility
function loadCity3D() {
    City3D.init();
}

// Make globally available
window.City3D = City3D;
window.loadCity3D = loadCity3D;
window.backToCity = backToCity;
window.loadWorkplace = loadWorkplace;
window.loadGym = loadGym;
window.loadPark = loadPark;
window.exerciseCardio = exerciseCardio;
window.exerciseStrength = exerciseStrength;
window.exerciseYoga = exerciseYoga;
window.parkWalk = parkWalk;
window.parkRead = parkRead;
window.parkRelax = parkRelax;

console.log('✅ city3d.js loaded');
