/* 
================================================================
GLOBAL INTERACTIVITY & LOGIC
================================================================
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Reveal Logic (Intersection Observer)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Initial check for all nodes with reveal-node class
    document.querySelectorAll('.reveal-node').forEach(node => revealObserver.observe(node));

    // 2. Confetti Celebration (for Enlistment Form)
    const enlistForm = document.getElementById('enlistForm');
    if (enlistForm) {
        enlistForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Fire confetti if library is loaded
            if (typeof confetti === 'function') {
                const count = 200;
                const defaults = {
                    origin: { y: 0.7 },
                    colors: ['#FFD700', '#0077be', '#cc0000', '#ffffff'],
                    zIndex: 3000
                };

                const fire = (particleRatio, opts) => {
                    confetti({
                        ...defaults,
                        ...opts,
                        particleCount: Math.floor(count * particleRatio)
                    });
                };

                fire(0.25, { spread: 26, startVelocity: 55 });
                fire(0.2, { spread: 60 });
                fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
                fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
                fire(0.1, { spread: 120, startVelocity: 45 });
            }

            setTimeout(() => {
                alert("WELCOME TO THE CREW! 🏴‍☠️✨");
                this.reset();
            }, 500);
        });
    }

    // 4. COMBAT MODE TOGGLE
    const combatToggle = document.getElementById('combatToggle');
    if (combatToggle) {
        combatToggle.addEventListener('click', () => {
            document.body.classList.toggle('in-combat');
            if (document.body.classList.contains('in-combat')) {
                combatToggle.textContent = '⚔️🔥';
            } else {
                combatToggle.textContent = '⚔️';
            }
        });
    }

    // 5. WEBGL 3D GRAND LINE EXPERIENCE (Three.js)
    const init3DMap = () => {
        const container = document.getElementById('grand-line-3d');
        if (!container || typeof THREE === 'undefined') return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 20000);
        camera.position.set(30, 30, 100);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        container.appendChild(renderer.domElement);

        // SUN
        const sun = new THREE.Vector3();

        // WATER
        const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
        const water = new THREE.Water(
            waterGeometry,
            {
                textureWidth: 512,
                textureHeight: 512,
                waterNormals: new THREE.TextureLoader().load('https://threejs.org/examples/textures/waternormals.jpg', function (texture) {
                    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
                }),
                sunDirection: new THREE.Vector3(),
                sunColor: 0xffffff,
                waterColor: 0x001e0f,
                distortionScale: 3.7,
                fog: scene.fog !== undefined
            }
        );
        water.rotation.x = -Math.PI / 2;
        scene.add(water);

        // SKY
        const sky = new THREE.Sky();
        sky.scale.setScalar(10000);
        scene.add(sky);

        const skyUniforms = sky.material.uniforms;
        skyUniforms['turbidity'].value = 10;
        skyUniforms['rayleigh'].value = 2;
        skyUniforms['mieCoefficient'].value = 0.005;
        skyUniforms['mieDirectionalG'].value = 0.8;

        const parameters = { elevation: 2, azimuth: 180 };
        const pmremGenerator = new THREE.PMREMGenerator(renderer);

        const updateSun = () => {
            const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
            const theta = THREE.MathUtils.degToRad(parameters.azimuth);
            sun.setFromSphericalCoords(1, phi, theta);
            sky.material.uniforms['sunPosition'].value.copy(sun);
            water.material.uniforms['sunDirection'].value.copy(sun).normalize();
            scene.environment = pmremGenerator.fromScene(sky).texture;
        };
        updateSun();

        // 3D PIRATE SHIP (Procedural)
        const shipGroup = new THREE.Group();

        // Hull
        const hullGeo = new THREE.BoxGeometry(10, 5, 20);
        const hullMat = new THREE.MeshStandardMaterial({ color: 0x4a3721 });
        const hull = new THREE.Mesh(hullGeo, hullMat);
        shipGroup.add(hull);

        // Masts
        const mastGeo = new THREE.CylinderGeometry(0.2, 0.2, 15);
        const mastMat = new THREE.MeshStandardMaterial({ color: 0x2b1d0e });
        const mast1 = new THREE.Mesh(mastGeo, mastMat);
        mast1.position.set(0, 10, 5);
        shipGroup.add(mast1);

        const mast2 = new THREE.Mesh(mastGeo, mastMat);
        mast2.position.set(0, 10, -5);
        shipGroup.add(mast2);

        // Sails
        const sailGeo = new THREE.BoxGeometry(8, 6, 0.1);
        const sailMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const sail1 = new THREE.Mesh(sailGeo, sailMat);
        sail1.position.set(0, 12, 5);
        shipGroup.add(sail1);

        const sail2 = new THREE.Mesh(sailGeo, sailMat);
        sail2.position.set(0, 10, -5);
        shipGroup.add(sail2);

        scene.add(shipGroup);

        // STARS (Galaxy Effect)
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
        const starVertices = [];
        for (let i = 0; i < 15000; i++) {
            const x = (Math.random() - 0.5) * 5000;
            const y = (Math.random()) * 2000;
            const z = (Math.random() - 0.5) * 5000;
            starVertices.push(x, y, z);
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);

        // Visibility Logic Based on Scroll
        const header = document.querySelector('header');
        const toggle3DEffects = () => {
            if (!header) return;
            const headerBottom = header.getBoundingClientRect().bottom;

            // If header is out of view, hide the ship and stars to focus on content
            const isVisible = headerBottom > 0;
            shipGroup.visible = isVisible;
            stars.visible = isVisible;

            // Adjust water opacity or intensity if needed
            water.material.uniforms['distortionScale'].value = isVisible ? 3.7 : 1.5;
        };

        window.addEventListener('scroll', toggle3DEffects);
        toggle3DEffects(); // Run once on init

        // ANIMATION LOOP
        const animate = () => {
            requestAnimationFrame(animate);
            const time = performance.now() * 0.001;

            water.material.uniforms['time'].value += 1.0 / 60.0;

            // Ship movement
            shipGroup.position.y = Math.sin(time) * 1;
            shipGroup.rotation.z = Math.sin(time * 0.5) * 0.05;
            shipGroup.rotation.x = Math.cos(time * 0.5) * 0.02;
            shipGroup.rotation.y += 0.005; // Continuously rotating ship

            stars.rotation.y += 0.0001; // Rotating galaxy

            renderer.render(scene, camera);
        };

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        animate();
    };

    init3DMap();
});
