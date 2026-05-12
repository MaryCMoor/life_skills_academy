// ==================== 3D CITY (ROBUST VERSION) ====================

const City3D = {
    scene: null,
    camera: null,
    renderer: null,
    buildings: [],
    animationId: null,
    initialized: false,
    
    init() {
        console.log('Initializing 3D City...');
        
        // Wait a tick for DOM to be fully ready
        setTimeout(() => {
            this.initializeCity();
        }, 100);
    },
    
    initializeCity() {
        const container = document.getElementById('cityContainer');
        
        if (!container) {
            console.error('❌ cityContainer element not found!');
            return;
        }
        
        // Ensure container is visible and styled
        container.style.display = 'block';
        container.style.width = '100%';
        container.style.height = '100vh';
        container.style.marginTop = '60px'; // Account for fixed top bar
        
        // Force layout recalculation
        container.offsetHeight;
        
        // Get actual dimensions
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        console.log(`📐 Container dimensions: ${width}x${height}`);
        
        if (width === 0 || height === 0) {
            console.error('❌ Container has zero dimensions!');
            // Fallback to window size
            const fallbackWidth = window.innerWidth;
            const fallbackHeight = window.innerHeight - 60;
            console.log(`Using fallback: ${fallbackWidth}x${fallbackHeight}`);
            this.createScene(container, fallbackWidth, fallbackHeight);
        } else {
            this.createScene(container, width, height);
        }
    },
    
    createScene(container, width, height) {
        try {
            // Create scene
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x87ceeb); // Sky blue
            
            // Create camera
            this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            this.camera.position.set(0, 15, 25);
            this.camera.lookAt(0, 0, 0);
            
            // Create renderer with error handling
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setSize(width, height);
            container.innerHTML = ''; // Clear any existing content
            container.appendChild(this.renderer.domElement);
            
            // Add lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
            this.scene.add(ambientLight);
            
            const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
            directionalLight.position.set(10, 20, 10);
            this.scene.add(directionalLight);
            
            // Add ground
            const groundGeometry = new THREE.PlaneGeometry(100, 100);
            const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x228b22 });
            const ground = new THREE.Mesh(groundGeometry, groundMaterial);
            ground.rotation.x = -Math.PI / 2;
            ground.position.y = -0.5;
            this.scene.add(ground);
            
            // Create buildings
            this.createBuildings();
            
            // Setup event listeners
            window.addEventListener('resize', () => this.onWindowResize());
            this.renderer.domElement.addEventListener('click', (e) => this.onBuildingClick(e));
            
            // Start animation
            this.animate();
            
            this.initialized = true;
            console.log('✅ 3D City initialized successfully');
            
        } catch (error) {
            console.error('❌ Failed to initialize 3D city:', error);
            container.innerHTML = `
                <div style="padding: 50px; text-align: center; background: white; margin: 60px 20px; border-radius: 10px;">
                    <h2 style="color: #e74c3c;">3D Graphics Error</h2>
                    <p>Your browser may not support WebGL.</p>
                    <p style="color: #7f8c8d; font-size: 0.9em;">Error: ${error.message}</p>
                </div>
            `;
        }
    },
    
    createBuildings() {
        const buildingData = [
            { name: 'Home', x: 0, z: -10, color: 0xffa500, icon: '🏠' },
            { name: 'School', x: -8, z: -10, color: 0x4169e1, icon: '🏫' },
            { name: 'Store', x: 8, z: -10, color: 0x32cd32, icon: '🏪' },
            { name: 'Bank', x: -8, z: 0, color: 0xffd700, icon: '🏦' },
            { name: 'Job Center', x: 8, z: 0, color: 0x9370db, icon: '💼' },
            { name: 'Post Office', x: -8, z: 10, color: 0xff6347, icon: '📮' },
            { name: 'Apartments', x: 8, z: 10, color: 0x8b4513, icon: '🏢' },
            { name: 'College', x: 0, z: 10, color: 0x000080, icon: '🎓' },
            { name: 'Entertainment', x: -12, z: 0, color: 0xff1493, icon: '🎮' },
            { name: 'Phone Store', x: 12, z: 0, color: 0x00ced1, icon: '📱' }
        ];
        
        buildingData.forEach((data) => {
            const geometry = new THREE.BoxGeometry(4, 6, 4);
            const material = new THREE.MeshLambertMaterial({ color: data.color });
            const building = new THREE.Mesh(geometry, material);
            
            building.position.set(data.x, 3, data.z);
            building.userData = { name: data.name, icon: data.icon };
            building.originalY = 3;
            
            this.scene.add(building);
            this.buildings.push(building);
        });
        
        console.log(`🏙️ Created ${this.buildings.length} buildings`);
    },
    
    onBuildingClick(event) {
        if (!this.initialized || !this.camera || !this.renderer) return;
        
        if (GameState.isBusy()) {
            UI.showNotification(`⏳ Busy: ${GameState.currentActivity}`, 'warning');
            return;
        }
        
        const rect = this.renderer.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
        
        const intersects = raycaster.intersectObjects(this.buildings);
        
        if (intersects.length > 0) {
            const building = intersects[0].object;
            this.enterBuilding(building.userData.name);
        }
    },
    
    enterBuilding(name) {
        console.log(`🏢 Entering: ${name}`);
        
        document.getElementById('cityContainer').style.display = 'none';
        document.getElementById('locationScreen').style.display = 'block';
        
        const locationMap = {
            'Home': loadHome,
            'School': loadSchool,
            'Store': loadStore,
            'Bank': loadBank,
            'Job Center': loadJobCenter,
            'Post Office': loadPostOffice,
            'Apartments': loadApartments,
            'College': loadCollege,
            'Entertainment': loadEntertainment,
            'Phone Store': loadPhoneStore
        };
        
        if (locationMap[name] && typeof locationMap[name] === 'function') {
            locationMap[name]();
        } else {
            document.getElementById('locationTitle').textContent = name;
            document.getElementById('locationContent').innerHTML = '<p>Coming soon!</p>';
        }
    },
    
    animate() {
        if (!this.initialized) return;
        
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const time = Date.now() * 0.0001;
        
        // Rotate camera
        this.camera.position.x = Math.sin(time) * 30;
        this.camera.position.z = Math.cos(time) * 30;
        this.camera.lookAt(0, 0, 0);
        
        // Animate buildings
        this.buildings.forEach((building, i) => {
            building.position.y = building.originalY + Math.sin(time + i) * 0.2;
        });
        
        this.renderer.render(this.scene, this.camera);
    },
    
    onWindowResize() {
        if (!this.initialized) return;
        
        const container = document.getElementById('cityContainer');
        if (!container) return;
        
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || (window.innerHeight - 60);
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
};

console.log('✅ city3d.js loaded - City3D ready');
