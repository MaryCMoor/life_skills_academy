// ==================== 3D CITY (IMPROVED WITH LABELS) ====================

const City3D = {
    scene: null,
    camera: null,
    renderer: null,
    buildings: [],
    labels: [],
    animationId: null,
    initialized: false,
    
    init() {
        console.log('🏙️ City3D.init() called');
        setTimeout(() => this.attemptInitialization(), 200);
    },
    
    attemptInitialization() {
        const container = document.getElementById('cityContainer');
        if (!container) {
            console.error('❌ cityContainer not found!');
            return;
        }
        
        container.style.display = 'block';
        container.style.position = 'fixed';
        container.style.top = '60px';
        container.style.left = '0';
        container.style.right = '0';
        container.style.bottom = '0';
        container.style.width = '100vw';
        container.style.height = 'calc(100vh - 60px)';
        container.style.overflow = 'hidden';
        
        void container.offsetHeight;
        
        let width = container.clientWidth || window.innerWidth;
        let height = container.clientHeight || (window.innerHeight - 60);
        
        if (width === 0 || height === 0) {
            width = window.innerWidth;
            height = window.innerHeight - 60;
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
        this.scene.background = new THREE.Color(0x87ceeb); // Sky blue
        this.scene.fog = new THREE.Fog(0x87ceeb, 50, 100);
        
        // Create camera - STATIC POSITION
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.set(0, 20, 35); // Fixed position
        this.camera.lookAt(0, 0, 0);
        
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: false
        });
        this.renderer.setSize(width, height, false);
        this.renderer.setPixelRatio(window.devicePixelRatio || 1);
        this.renderer.shadowMap.enabled = true;
        
        container.innerHTML = '';
        container.appendChild(this.renderer.domElement);
        
        console.log('✅ Renderer created');
        
        // Add lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
        this.scene.add(ambientLight);
        
        const sun = new THREE.DirectionalLight(0xffffff, 0.9);
        sun.position.set(20, 30, 20);
        sun.castShadow = true;
        this.scene.add(sun);
        
        // Add ground with grid
        const groundGeometry = new THREE.PlaneGeometry(150, 150);
        const groundMaterial = new THREE.MeshLambertMaterial({ 
            color: 0x2d5016,
            side: THREE.DoubleSide
        });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -0.5;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Add grid helper (roads)
        const gridHelper = new THREE.GridHelper(150, 30, 0x555555, 0x888888);
        gridHelper.position.y = -0.4;
        this.scene.add(gridHelper);
        
        // Create buildings
        this.createBuildings();
        
        // Create labels
        this.createLabels(container);
        
        // Setup events
        window.addEventListener('resize', () => this.handleResize());
        this.renderer.domElement.addEventListener('click', (e) => this.handleClick(e));
        this.renderer.domElement.addEventListener('mousemove', (e) => this.handleHover(e));
        this.renderer.domElement.style.cursor = 'pointer';
        
        // Start animation
        this.initialized = true;
        this.animate();
        
        console.log('✅ 3D City fully initialized!');
    },
    
    createBuildings() {
        const buildingData = [
            { name: 'Home', x: 0, z: -10, color: 0xff8c42, icon: '🏠', height: 5 },
            { name: 'School', x: -8, z: -10, color: 0x4a90e2, icon: '🏫', height: 7 },
            { name: 'Store', x: 8, z: -10, color: 0x50c878, icon: '🏪', height: 5 },
            { name: 'Bank', x: -8, z: 0, color: 0xffd700, icon: '🏦', height: 8 },
            { name: 'Job Center', x: 8, z: 0, color: 0x9b59b6, icon: '💼', height: 6 },
            { name: 'Post Office', x: -8, z: 10, color: 0xe74c3c, icon: '📮', height: 5 },
            { name: 'Apartments', x: 8, z: 10, color: 0xa0522d, icon: '🏢', height: 9 },
            { name: 'College', x: 0, z: 10, color: 0x1e3a8a, icon: '🎓', height: 8 },
            { name: 'Entertainment', x: -12, z: 0, color: 0xff1493, icon: '🎮', height: 6 },
            { name: 'Phone Store', x: 12, z: 0, color: 0x00ced1, icon: '📱', height: 5 }
        ];
        
        buildingData.forEach((data) => {
            // Create building with windows
            const buildingGroup = new THREE.Group();
            
            // Main building
            const geometry = new THREE.BoxGeometry(4, data.height, 4);
            const material = new THREE.MeshLambertMaterial({ color: data.color });
            const building = new THREE.Mesh(geometry, material);
            building.castShadow = true;
            building.receiveShadow = true;
            buildingGroup.add(building);
            
            // Add windows (darker squares)
            const windowMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 2; j++) {
                    const windowGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.1);
                    const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
                    window1.position.set(-1 + j * 2, -data.height/2 + 1 + i * 1.5, 2.05);
                    buildingGroup.add(window1);
                }
            }
            
            // Add roof
            const roofGeometry = new THREE.ConeGeometry(3, 1.5, 4);
            const roofMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
            const roof = new THREE.Mesh(roofGeometry, roofMaterial);
            roof.position.y = data.height / 2 + 0.75;
            roof.rotation.y = Math.PI / 4;
            buildingGroup.add(roof);
            
            buildingGroup.position.set(data.x, data.height / 2, data.z);
            buildingGroup.userData = { 
                name: data.name, 
                icon: data.icon,
                originalColor: data.color
            };
            
            this.scene.add(buildingGroup);
            this.buildings.push(buildingGroup);
        });
        
        console.log(`🏢 Created ${this.buildings.length} buildings`);
    },
    
    createLabels(container) {
        // Create label container
        const labelContainer = document.createElement('div');
        labelContainer.id = 'buildingLabels';
        labelContainer.style.position = 'absolute';
        labelContainer.style.top = '0';
        labelContainer.style.left = '0';
        labelContainer.style.width = '100%';
        labelContainer.style.height = '100%';
        labelContainer.style.pointerEvents = 'none';
        labelContainer.style.zIndex = '1';
        container.appendChild(labelContainer);
        
        this.buildings.forEach((building) => {
            const label = document.createElement('div');
            label.className = 'building-label';
            label.innerHTML = `
                <div class="label-icon">${building.userData.icon}</div>
                <div class="label-text">${building.userData.name}</div>
            `;
            label.style.position = 'absolute';
            label.style.background = 'rgba(0, 0, 0, 0.8)';
            label.style.color = 'white';
            label.style.padding = '8px 12px';
            label.style.borderRadius = '8px';
            label.style.fontSize = '14px';
            label.style.fontWeight = 'bold';
            label.style.textAlign = 'center';
            label.style.transform = 'translate(-50%, -50%)';
            label.style.whiteSpace = 'nowrap';
            label.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
            label.style.border = '2px solid rgba(255,255,255,0.3)';
            label.style.transition = 'all 0.3s ease';
            
            labelContainer.appendChild(label);
            this.labels.push({ element: label, building: building });
        });
    },
    
    updateLabels() {
        if (!this.initialized) return;
        
        this.labels.forEach(({ element, building }) => {
            const vector = new THREE.Vector3();
            
            // Get position above building
            const pos = building.position.clone();
            pos.y += 8; // Above the building
            vector.copy(pos);
            
            // Project to screen coordinates
            vector.project(this.camera);
            
            // Convert to screen position
            const x = (vector.x * 0.5 + 0.5) * this.renderer.domElement.clientWidth;
            const y = (vector.y * -0.5 + 0.5) * this.renderer.domElement.clientHeight;
            
            element.style.left = x + 'px';
            element.style.top = y + 'px';
            
            // Hide if behind camera
            element.style.opacity = vector.z < 1 ? '1' : '0';
        });
    },
    
    handleHover(event) {
        if (!this.initialized) return;
        
        const rect = this.renderer.domElement.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera({ x, y }, this.camera);
        
        const intersects = raycaster.intersectObjects(this.buildings, true);
        
        // Reset all buildings
        this.buildings.forEach(building => {
            building.children[0].material.color.setHex(building.userData.originalColor);
            building.children[0].material.emissive.setHex(0x000000);
        });
        
        // Highlight hovered building
        if (intersects.length > 0) {
            let building = intersects[0].object;
            while (building.parent && !building.userData.name) {
                building = building.parent;
            }
            if (building.userData.name) {
                building.children[0].material.emissive.setHex(0x444444);
                this.renderer.domElement.style.cursor = 'pointer';
            }
        } else {
            this.renderer.domElement.style.cursor = 'default';
        }
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
        
        const intersects = raycaster.intersectObjects(this.buildings, true);
        
        if (intersects.length > 0) {
            let building = intersects[0].object;
            while (building.parent && !building.userData.name) {
                building = building.parent;
            }
            if (building.userData.name) {
                console.log(`🎯 Clicked: ${building.userData.name}`);
                this.enterLocation(building.userData.name);
            }
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
        
        // NO CAMERA ROTATION - Camera stays still!
        // Buildings stay still too - no bobbing
        
        // Update label positions
        this.updateLabels();
        
        // Render scene
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
                <p style="color: #2c3e50;">Your browser doesn't support WebGL.</p>
                <p style="color: #7f8c8d; font-size: 0.9em;">Error: ${error.message}</p>
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
        `;
    }
};

console.log('✅ city3d.js loaded - City3D ready');
