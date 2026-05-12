// ==================== 3D CITY (FIXED) ====================

const City3D = {
    scene: null,
    camera: null,
    renderer: null,
    buildings: [],
    animationId: null,
    
    init() {
        console.log('Initializing 3D City...');
        
        const container = document.getElementById('cityContainer');
        
        // Check if container exists
        if (!container) {
            console.error('❌ cityContainer not found in DOM!');
            return;
        }
        
        // Make sure container is visible and has dimensions
        container.style.display = 'block';
        
        // Get dimensions
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight - 60; // Account for top bar
        
        if (width === 0 || height === 0) {
            console.warn('⚠️ Container has no dimensions, using window size');
        }
        
        console.log(`📐 City dimensions: ${width}x${height}`);
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb); // Sky blue
        
        // Create camera
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(0, 15, 25);
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        try {
            this.renderer = new THREE.WebGLRenderer({ antialias: true });
            this.renderer.setSize(width, height);
            container.appendChild(this.renderer.domElement);
        } catch (error) {
            console.error('❌ Failed to create WebGL renderer:', error);
            container.innerHTML = '<div style="padding: 50px; text-align: center;"><h2>WebGL not supported</h2><p>Your browser does not support 3D graphics.</p></div>';
            return;
        }
        
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
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Handle clicks
        this.renderer.domElement.addEventListener('click', (e) => this.onBuildingClick(e));
        
        // Start animation
        this.animate();
        
        console.log('✅ 3D City initialized');
    },
    
    createBuildings() {
        const buildingData = [
            { name: 'Home', x: 0, z: -10, color: 0xffa500, icon: '🏠' },
            { name: 'School', x: -8, z: -10, color: 0x4169e1, icon: '🏫' },
            { name: 'Store', x: 8, z: -10, color: 0x32cd32, icon: '🏪' },
            { name: 'Bank', x: -8, z: 0, color: 0xgold, icon: '🏦' },
            { name: 'Job Center', x: 8, z: 0, color: 0x9370db, icon: '💼' },
            { name: 'Post Office', x: -8, z: 10, color: 0xff6347, icon: '📮' },
            { name: 'Apartments', x: 8, z: 10, color: 0x8b4513, icon: '🏢' },
            { name: 'College', x: 0, z: 10, color: 0x000080, icon: '🎓' },
            { name: 'Entertainment', x: -12, z: 0, color: 0xff1493, icon: '🎮' },
            { name: 'Phone Store', x: 12, z: 0, color: 0x00ced1, icon: '📱' }
        ];
        
        buildingData.forEach((data, index) => {
            const geometry = new THREE.BoxGeometry(4, 6, 4);
            const material = new THREE.MeshLambertMaterial({ color: data.color });
            const building = new THREE.Mesh(geometry, material);
            
            building.position.set(data.x, 3, data.z);
            building.userData = { name: data.name, icon: data.icon, index: index };
            
            this.scene.add(building);
            this.buildings.push(building);
            
            // Add hover effect
            building.originalY = 3;
        });
        
        console.log(`🏙️ Created ${this.buildings.length} buildings`);
    },
    
    onBuildingClick(event) {
        if (!this.camera || !this.renderer) return;
        
        // Check if player is busy
        if (GameState.isBusy()) {
            if (typeof UI !== 'undefined') {
                UI.showNotification(`⏳ You're busy: ${GameState.currentActivity}`, 'warning');
            }
            return;
        }
        
        // Calculate mouse position
        const rect = this.renderer.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        // Raycast
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(new THREE.Vector2(x, y), this.camera);
        
        const intersects = raycaster.intersectObjects(this.buildings);
        
        if (intersects.length > 0) {
            const building = intersects[0].object;
            const name = building.userData.name;
            
            console.log(`🏢 Clicked: ${name}`);
            this.enterBuilding(name);
        }
    },
    
    enterBuilding(name) {
        // Hide city, show location screen
        document.getElementById('cityContainer').style.display = 'none';
        document.getElementById('locationScreen').style.display = 'block';
        
        // Load appropriate location
        switch(name) {
            case 'Home':
                if (typeof loadHome !== 'undefined') loadHome();
                break;
            case 'School':
                if (typeof loadSchool !== 'undefined') loadSchool();
                break;
            case 'Store':
                if (typeof loadStore !== 'undefined') loadStore();
                break;
            case 'Bank':
                if (typeof loadBank !== 'undefined') loadBank();
                break;
            case 'Job Center':
                if (typeof loadJobCenter !== 'undefined') loadJobCenter();
                break;
            case 'Post Office':
                if (typeof loadPostOffice !== 'undefined') loadPostOffice();
                break;
            case 'Apartments':
                if (typeof loadApartments !== 'undefined') loadApartments();
                break;
            case 'College':
                if (typeof loadCollege !== 'undefined') loadCollege();
                break;
            case 'Entertainment':
                if (typeof loadEntertainment !== 'undefined') loadEntertainment();
                break;
            case 'Phone Store':
                if (typeof loadPhoneStore !== 'undefined') loadPhoneStore();
                break;
            default:
                document.getElementById('locationTitle').textContent = name;
                document.getElementById('locationContent').innerHTML = '<p>Coming soon!</p>';
        }
    },
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (!this.renderer || !this.scene || !this.camera) return;
        
        // Gentle camera rotation
        const time = Date.now() * 0.0001;
        this.camera.position.x = Math.sin(time) * 30;
        this.camera.position.z = Math.cos(time) * 30;
        this.camera.lookAt(0, 0, 0);
        
        // Animate buildings (gentle bob)
        this.buildings.forEach((building, i) => {
            building.position.y = building.originalY + Math.sin(time + i) * 0.2;
        });
        
        this.renderer.render(this.scene, this.camera);
    },
    
    onWindowResize() {
        if (!this.camera || !this.renderer) return;
        
        const container = document.getElementById('cityContainer');
        if (!container) return;
        
        const width = container.clientWidth || window.innerWidth;
        const height = container.clientHeight || window.innerHeight - 60;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        
        console.log(`📐 Resized to ${width}x${height}`);
    },
    
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        console.log('🗑️ City3D disposed');
    }
};

console.log('✅ city3d.js loaded - City3D ready');
