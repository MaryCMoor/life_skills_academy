// ==================== 3D CITY (ULTRA-ROBUST VERSION) ====================

const City3D = {
    scene: null,
    camera: null,
    renderer: null,
    buildings: [],
    animationId: null,
    initialized: false,
    
    init() {
        console.log('🏙️ City3D.init() called');
        
        // Wait for DOM to be fully ready and styled
        setTimeout(() => {
            this.attemptInitialization();
        }, 200);
    },
    
    attemptInitialization() {
        console.log('🔍 Attempting city initialization...');
        
        const container = document.getElementById('cityContainer');
        
        if (!container) {
            console.error('❌ cityContainer not found!');
            return;
        }
        
        // Force container to be visible and have dimensions
        container.style.display = 'block';
        container.style.position = 'fixed';
        container.style.top = '60px';
        container.style.left = '0';
        container.style.right = '0';
        container.style.bottom = '0';
        container.style.width = '100vw';
        container.style.height = 'calc(100vh - 60px)';
        container.style.overflow = 'hidden';
        
        // Force reflow
        void container.offsetHeight;
        
        // Get dimensions with multiple fallbacks
        let width = container.clientWidth;
        let height = container.clientHeight;
        
        if (width === 0 || height === 0) {
            console.warn('⚠️ Container has zero dimensions, using window size');
            width = window.innerWidth;
            height = window.innerHeight - 60;
        }
        
        if (width === 0 || height === 0) {
            console.warn('⚠️ Window also has zero dimensions, using defaults');
            width = 1920;
            height = 1080;
        }
        
        console.log(`📐 Using dimensions: ${width}x${height}`);
        
        try {
            this.createCity(container, width, height);
        } catch (error) {
            console.error('❌ City creation failed:', error);
            this.showFallbackMessage(container, error);
        }
    },
    
    createCity(container, width, height) {
        console.log('🏗️ Creating 3D city...');
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb);
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(0, 15, 25);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer with explicit dimensions
        console.log('🎨 Creating WebGL renderer...');
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: false
        });
        
        // Set size BEFORE appending to DOM
        this.renderer.setSize(width, height, false);
        this.renderer.setPixelRatio(window.devicePixelRatio || 1);
        
        // Clear container and append canvas
        container.innerHTML = '';
        container.appendChild(this.renderer.domElement);
        
        console.log('✅ Renderer created and attached');
        
        // Add lights
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
        
        // Setup events
        window.addEventListener('resize', () => this.handleResize());
        this.renderer.domElement.addEventListener('click', (e) => this.handleClick(e));
        this.renderer.domElement.style.cursor = 'pointer';
        
        // Start animation
        this.initialized = true;
        this.animate();
        
        console.log('✅ 3D City fully initialized!');
    },
    
    createBuildings() {
        const buildings = [
            { name: 'Home', x: 0, z: -10, color: 0xffa500 },
            { name: 'School', x: -8, z: -10, color: 0x4169e1 },
            { name: 'Store', x: 8, z: -10, color: 0x32cd32 },
            { name: 'Bank', x: -8, z: 0, color: 0xffd700 },
            { name: 'Job Center', x: 8, z: 0, color: 0x9370db },
            { name: 'Post Office', x: -8, z: 10, color: 0xff6347 },
            { name: 'Apartments', x: 8, z: 10, color: 0x8b4513 },
            { name: 'College', x: 0, z: 10, color: 0x000080 },
            { name: 'Entertainment', x: -12, z: 0, color: 0xff1493 },
            { name: 'Phone Store', x: 12, z: 0, color: 0x00ced1 }
        ];
        
        buildings.forEach((data) => {
            const geometry = new THREE.BoxGeometry(4, 6, 4);
            const material = new THREE.MeshLambertMaterial({ color: data.color });
            const building = new THREE.Mesh(geometry, material);
            
            building.position.set(data.x, 3, data.z);
            building.userData = { name: data.name };
            building.originalY = 3;
            
            this.scene.add(building);
            this.buildings.push(building);
        });
        
        console.log(`🏢 Created ${this.buildings.length} buildings`);
    },
    
    handleClick(event) {
        if (!this.initialized) return;
        
        if (GameState.isBusy()) {
            UI.showNotification(`⏳ ${GameState.currentActivity}`, 'warning');
            return;
        }
        
        const rect = this.renderer.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x, y }, this.camera);
        
        const intersects = raycaster.intersectObjects(this.buildings);
        
        if (intersects.length > 0) {
            const name = intersects[0].object.userData.name;
            console.log(`🎯 Clicked: ${name}`);
            this.enterLocation(name);
        }
    },
    
    enterLocation(name) {
        document.getElementById('cityContainer').style.display = 'none';
        document.getElementById('locationScreen').style.display = 'block';
        
        const locations = {
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
        
        if (locations[name]) {
            locations[name]();
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
        
        // Bob buildings
        this.buildings.forEach((b, i) => {
            b.position.y = b.originalY + Math.sin(time + i) * 0.2;
        });
        
        this.renderer.render(this.scene, this.camera);
    },
    
    handleResize() {
        if (!this.initialized) return;
        
        const container = document.getElementById('cityContainer');
        if (!container) return;
        
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight - 60;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
    },
    
    showFallbackMessage(container, error) {
        container.innerHTML = `
            <div style="
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 40px;
                border-radius: 15px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                text-align: center;
                max-width: 500px;
            ">
                <h2 style="color: #e74c3c; margin-top: 0;">⚠️ 3D View Unavailable</h2>
                <p style="color: #2c3e50; line-height: 1.6;">
                    Your browser doesn't support WebGL, or it's been disabled.
                </p>
                <p style="color: #7f8c8d; font-size: 0.9em;">
                    Error: ${error.message}
                </p>
                <div style="margin-top: 30px;">
                    <button onclick="location.reload()" style="
                        padding: 12px 30px;
                        background: #3498db;
                        color: white;
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        font-size: 1.1em;
                    ">🔄 Try Again</button>
                </div>
            </div>
        `;
    }
};

console.log('✅ city3d.js loaded - City3D ready');
