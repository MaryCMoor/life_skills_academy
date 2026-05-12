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
    
    buildingData: [
        { name: 'Home', color: 0xff5555, x: -8, z: 8, width: 3, height: 2.5, desc: 'Your family home', icon: '🏠' },
        { name: 'School', color: 0x5555ff, x: 8, z: 8, width: 4, height: 3, desc: 'Learn and grow', icon: '🏫' },
        { name: 'Store', color: 0xffaa55, x: -8, z: -2, width: 3, height: 2, desc: 'Buy supplies', icon: '🏪' },
        { name: 'Bank', color: 0x55ff55, x: 8, z: -2, width: 3, height: 2.5, desc: 'Manage money', icon: '🏦' },
        { name: 'Job Center', color: 0xaa55ff, x: -8, z: -8, width: 3, height: 2, desc: 'Find work', icon: '💼' },
        { name: 'Post Office', color: 0xaaaaaa, x: 0, z: -8, width: 2.5, height: 2, desc: 'Mail and bills', icon: '📮' },
        { name: 'Apartments', color: 0x8b4513, x: 0, z: 8, width: 3, height: 4, desc: 'Live independently (18+)', icon: '🏢' },
        { name: 'College', color: 0x20b2aa, x: 8, z: -8, width: 4, height: 3.5, desc: 'Higher education (Grade 12)', icon: '🎓' }
    ],
    
    init() {
        console.log('Initializing 3D City...');
        
        // Setup Three.js
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87ceeb);
        this.scene.fog = new THREE.Fog(0x87ceeb, 20, 60);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / (window.innerHeight - 60),
            0.1,
            1000
        );
        this.camera.position.set(0, 15, 20);
        this.camera.lookAt(0, 0, 0);
        
        // Renderer
        const canvas = document.getElementById('cityCanvas');
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
        this.animate();
        
        console.log('✓ 3D City initialized');
    },
    
    createLighting() {
        // Ambient light
        const ambient = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambient);
        
        // Directional light (sun)
        const sun = new THREE.DirectionalLight(0xffffff, 0.8);
        sun.position.set(10, 20, 10);
        sun.castShadow = true;
        sun.shadow.camera.left = -20;
        sun.shadow.camera.right = 20;
        sun.shadow.camera.top = 20;
        sun.shadow.camera.bottom = -20;
        sun.shadow.mapSize.width = 2048;
        sun.shadow.mapSize.height = 2048;
        this.scene.add(sun);
    },
    
    createGround() {
        // Ground plane
        const groundGeometry = new THREE.PlaneGeometry(50, 50);
        const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x5a8f5a });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // Roads
        const roadMaterial = new THREE.MeshLambertMaterial({ color: 0x333333 });
        
        // Horizontal road
        const roadH = new THREE.Mesh(new THREE.PlaneGeometry(50, 4), roadMaterial);
        roadH.rotation.x = -Math.PI / 2;
        roadH.position.y = 0.01;
        this.scene.add(roadH);
        
        // Vertical road
        const roadV = new THREE.Mesh(new THREE.PlaneGeometry(4, 50), roadMaterial);
        roadV.rotation.x = -Math.PI / 2;
        roadV.position.y = 0.01;
        this.scene.add(roadV);
        
        // Road markings
        const markingMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        for (let i = -20; i < 20; i += 3) {
            const marking = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 1.5), markingMaterial);
            marking.rotation.x = -Math.PI / 2;
            marking.position.set(i, 0.02, 0);
            this.scene.add(marking);
            
            const marking2 = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 0.3), markingMaterial);
            marking2.rotation.x = -Math.PI / 2;
            marking2.position.set(0, 0.02, i);
            this.scene.add(marking2);
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
        
        // Position the building
        group.position.set(data.x, 0, data.z);
        group.userData = data;
        
        return group;
    },
    
    createEnvironment() {
        // Trees
        const treePositions = [
            [-12, 12], [12, 12], [-12, -12], [12, -12],
            [-15, 0], [15, 0], [0, 15], [0, -15]
        ];
        
        treePositions.forEach(pos => {
            const tree = this.createTree();
            tree.position.set(pos[0], 0, pos[1]);
            this.scene.add(tree);
        });
        
        // Street lights
        const lightPositions = [
            [-5, 5], [5, 5], [-5, -5], [5, -5]
        ];
        
        lightPositions.forEach(pos => {
            const light = this.createStreetLight();
            light.position.set(pos[0], 0, pos[1]);
            this.scene.add(light);
        });
        
        // Clouds
        for (let i = 0; i < 10; i++) {
            const cloud = this.createCloud();
            cloud.position.set(
                Math.random() * 40 - 20,
                15 + Math.random() * 10,
                Math.random() * 40 - 20
            );
            this.scene.add(cloud);
        }
    },
    
    createTree() {
        const group = new THREE.Group();
        
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.2, 0.3, 2, 8);
        const trunkMaterial = new THREE.MeshLambertMaterial({ color: 0x8b4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 1;
        trunk.castShadow = true;
        group.add(trunk);
        
        // Leaves
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
        
        // Pole
        const poleGeometry = new THREE.CylinderGeometry(0.1, 0.1, 4, 8);
        const poleMaterial = new THREE.MeshLambertMaterial({ color: 0x666666 });
        const pole = new THREE.Mesh(poleGeometry, poleMaterial);
        pole.position.y = 2;
        pole.castShadow = true;
        group.add(pole);
        
        // Light
        const lightGeometry = new THREE.SphereGeometry(0.3, 8, 8);
        const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xffffaa });
        const light = new THREE.Mesh(lightGeometry, lightMaterial);
        light.position.y = 4;
        group.add(light);
        
        // Point light
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
        // Mouse move for hover
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        
        // Click to enter building
        window.addEventListener('click', (e) => this.onMouseClick(e));
        
        // Window resize
        window.addEventListener('resize', () => this.onWindowResize());
        
        // Camera controls
        document.getElementById('rotateLeft').addEventListener('click', () => this.rotateCamera(-1));
        document.getElementById('rotateRight').addEventListener('click', () => this.rotateCamera(1));
        document.getElementById('zoomIn').addEventListener('click', () => this.zoomCamera(-1));
        document.getElementById('zoomOut').addEventListener('click', () => this.zoomCamera(1));
    },
    
    onMouseMove(event) {
        const canvas = this.renderer.domElement;
        const rect = canvas.getBoundingClientRect();
        
        this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        this.checkHover();
    },
    
    checkHover() {
        this.raycaster.setFromCamera(this.mouse, this.camera);
        
        const buildingMeshes = this.buildings.map(b => b.mesh.children[0]);
        const intersects = this.raycaster.intersectObjects(buildingMeshes);
        
        // Reset previous hover
        if (this.hoveredBuilding) {
            this.hoveredBuilding.children[0].material.emissive.setHex(0x000000);
            this.hoveredBuilding = null;
            this.hideTooltip();
        }
        
        // New hover
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
        tooltip.classList.remove('hidden');
        tooltip.querySelector('.tooltip-title').textContent = `${data.icon} ${data.name}`;
        tooltip.querySelector('.tooltip-desc').textContent = data.desc;
        
        // Position tooltip near mouse
        tooltip.style.left = (this.mouse.x * 0.5 + 0.5) * window.innerWidth + 'px';
        tooltip.style.top = ((1 - this.mouse.y) * 0.5) * (window.innerHeight - 60) + 'px';
    },
    
    hideTooltip() {
        const tooltip = document.getElementById('buildingTooltip');
        tooltip.classList.add('hidden');
    },
    
    onMouseClick(event) {
        if (this.hoveredBuilding) {
            const data = this.hoveredBuilding.userData;
            console.log('Entering:', data.name);
            this.enterBuilding(data.name);
        }
    },
    
    enterBuilding(buildingName) {
        // Check restrictions
        if (buildingName === 'Apartments' && GameState.player.age < 18) {
            UI.showNotification('❌ You must be 18 to rent an apartment!', 'error');
            return;
        }
        
        if (buildingName === 'College' && GameState.player.grade < 12) {
            UI.showNotification('❌ College is only available in Grade 12!', 'error');
            return;
        }
        
        // Hide city, show location
        document.getElementById('cityContainer').classList.add('hidden');
        document.getElementById('locationScreen').classList.remove('hidden');
        
        // Load location
        const locationMap = {
            'Home': 'loadHome',
            'School': 'loadSchool',
            'Store': 'loadStore',
            'Bank': 'loadBank',
            'Job Center': 'loadJobCenter',
            'Post Office': 'loadPostOffice',
            'Apartments': 'loadApartments',
            'College': 'loadCollege'
        };
        
        const loadFunction = locationMap[buildingName];
        if (window[loadFunction]) {
            window[loadFunction]();
        }
    },
    
    rotateCamera(direction) {
        const angle = direction * Math.PI / 8;
        const x = this.camera.position.x;
        const z = this.camera.position.z;
        
        this.camera.position.x = x * Math.cos(angle) - z * Math.sin(angle);
        this.camera.position.z = x * Math.sin(angle) + z * Math.cos(angle);
        this.camera.lookAt(0, 0, 0);
    },
    
    zoomCamera(direction) {
        const factor = 1 + direction * 0.1;
        this.camera.position.multiplyScalar(factor);
        
        // Clamp zoom
        const distance = this.camera.position.length();
        if (distance < 15) {
            this.camera.position.normalize().multiplyScalar(15);
        } else if (distance > 40) {
            this.camera.position.normalize().multiplyScalar(40);
        }
    },
    
    onWindowResize() {
        this.camera.aspect = window.innerWidth / (window.innerHeight - 60);
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight - 60);
    },
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Rotate clouds slowly
        this.scene.children.forEach(obj => {
            if (obj.type === 'Group' && obj.children.length > 2 && obj.children[0].geometry.type === 'SphereGeometry') {
                obj.position.x += 0.002;
                if (obj.position.x > 25) obj.position.x = -25;
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    },
    
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        // Cleanup Three.js resources
        this.scene.traverse(obj => {
            if (obj.geometry) obj.geometry.dispose();
            if (obj.material) obj.material.dispose();
        });
        
        this.renderer.dispose();
    }
};

// Back to city function
function backToCity() {
    document.getElementById('cityContainer').classList.remove('hidden');
    document.getElementById('locationScreen').classList.add('hidden');
    City3D.hideTooltip();
}
