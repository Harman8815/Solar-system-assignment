import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { createStars } from './stars.js';
import getSun from './getSun.js';

let scene, camera, renderer, controls;
let sun = null;
let planets = [];
let paused = false;
let texturesEnabled = true;
let darkMode = true;

let raycaster, mouse;
let tooltip;

const textureLoader = new THREE.TextureLoader();

const planetData = [
    { name: "Mercury", color: 0xaaaaaa, size: 0.5, distance: 8, orbitSpeed: 0.02, rotationSpeed: 0.01, texture: './textures/mercury.png' },
    { name: "Venus", color: 0xffcc66, size: 1, distance: 12, orbitSpeed: 0.015, rotationSpeed: 0.008, texture: './textures/venus.png' },
    { name: "Earth", color: 0x3399ff, size: 1.2, distance: 16, orbitSpeed: 0.01, rotationSpeed: 0.02, texture: './textures/earth.png' },
    { name: "Mars", color: 0xff3300, size: 1, distance: 20, orbitSpeed: 0.008, rotationSpeed: 0.018, texture: './textures/mars.png' },
    { name: "Jupiter", color: 0xff9966, size: 3, distance: 28, orbitSpeed: 0.006, rotationSpeed: 0.04, texture: './textures/jupiter.png' },
    { name: "Saturn", color: 0xffcc99, size: 2.5, distance: 40, orbitSpeed: 0.004, rotationSpeed: 0.038, texture: './textures/saturn.png' },
    { name: "Uranus", color: 0x66ccff, size: 2, distance: 50, orbitSpeed: 0.003, rotationSpeed: 0.03, texture: './textures/uranus.png' },
    { name: "Neptune", color: 0x3333ff, size: 2, distance: 56, orbitSpeed: 0.002, rotationSpeed: 0.028, texture: './textures/neptune.png' }
];

//  Initialization
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(80, 60, 100);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createLights();
    createOrbitControls();
    createStars(scene, 3000);
    createSun();
    createPlanets();
    createUI();
    createTooltip();

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', onMouseMove);
}

function createLights() {
    const pointLight = new THREE.PointLight(0xffffff, 1000, 3000);
    pointLight.position.set(0, 0, 0);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    scene.add(ambientLight);
}

function createOrbitControls() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true;
    controls.enableZoom = true;
}

async function createSun() {
    try {
        sun = await getSun();
        sun.scale.set(0.5, 0.5, 0.5);
        sun.position.set(0, 0, 0);
        scene.add(sun);
    } catch (err) {
        console.error("Failed to load Sun:", err);
        sun = null;
    }
}

function createPlanets() {
    const tiltMap = {
        Mercury: 0.03, Venus: 177.4, Earth: 23.5, Mars: 25.2,
        Jupiter: 3.1, Saturn: 26.7, Uranus: 97.8, Neptune: 28.3
    };

    planets = [];
    planetData.forEach(p => {
        const geometry = new THREE.SphereGeometry(p.size, 32, 32);
        const material = new THREE.MeshStandardMaterial({
            map: textureLoader.load(p.texture),
            metalness: 0.1,
            roughness: 1
        });

        const mesh = new THREE.Mesh(geometry, material);
        mesh.name = p.name; //  Tooltip name
        mesh.rotation.z = THREE.MathUtils.degToRad(tiltMap[p.name]);
        const rotationDir = (p.name === "Venus" || p.name === "Uranus") ? -1 : 1;
        scene.add(mesh);

        const orbit = new THREE.Mesh(
            new THREE.RingGeometry(p.distance - 0.05, p.distance + 0.05, 64),
            new THREE.MeshBasicMaterial({ color: 0x888888, side: THREE.DoubleSide })
        );
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);

        const planetObj = {
            mesh,
            angle: 0,
            orbitSpeed: p.orbitSpeed,
            rotationSpeed: p.rotationSpeed * rotationDir,
            distance: p.distance,
            texture: material.map,
            color: p.color
        };

        if (p.name === "Saturn") mesh.add(createSaturnRing(p.size));
        if (p.name === "Earth") planetObj.moon = createMoon();

        planets.push(planetObj);
    });
    planets.forEach(p => {
        if (p.moon) p.mesh.add(p.moon.mesh);
    });
}

function createSaturnRing(planetSize) {
    const positions = [];
    const count = 2500;
    const inner = planetSize * 1.5, outer = planetSize * 2.5, thickness = 0.09;

    for (let i = 0; i < count; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const r = inner + Math.random() * (outer - inner);
        const x = Math.cos(angle) * r + (Math.random() - 0.5) * thickness;
        const y = (Math.random() - 0.5) * 0.02;
        const z = Math.sin(angle) * r + (Math.random() - 0.5) * thickness;
        positions.push(x, y, z);
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
        color: 0xaaaaff,
        size: 0.05,
        transparent: true,
        opacity: 0.7,
        depthWrite: false
    });

    const ring = new THREE.Points(geometry, material);
    return ring;
}

function createMoon() {
    const moonMesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.27, 32, 32),
        new THREE.MeshStandardMaterial({ color: 0xaaaaaa, roughness: 1 })
    );
    moonMesh.position.set(2, 0, 0);
    moonMesh.rotation.z = THREE.MathUtils.degToRad(6.7);

    return { mesh: moonMesh, angle: 0, orbitSpeed: 0.04, distance: 2 };
}

function createTooltip() {
    tooltip = document.createElement("div");
    Object.assign(tooltip.style, {
        position: "absolute", padding: "5px", background: "rgba(0,0,0,0.7)",
        color: "white", borderRadius: "4px", fontSize: "12px",
        pointerEvents: "none", display: "none"
    });
    document.body.appendChild(tooltip);
}

function createUI() {
    const controlsDiv = document.getElementById("controls");
    Object.assign(controlsDiv.style, {
        position: "absolute", top: "20px", right: "20px",
        background: darkMode ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.8)",
        padding: "15px", color: darkMode ? "white" : "black",
        maxHeight: "90vh", overflowY: "auto", borderRadius: "10px",
        boxShadow: "0 4px 10px rgba(0,0,0,0.3)", fontFamily: "Arial, sans-serif",
        fontSize: "14px", width: "200px"
    });
    controlsDiv.innerHTML = "<h3 style='margin:0 0 10px; font-size:16px;'>Controls</h3>";

    const makeButton = (text, onclick) => {
        const btn = document.createElement("button");
        btn.textContent = text;
        Object.assign(btn.style, {
            background: "#444", color: "white", border: "none",
            borderRadius: "5px", padding: "5px 10px", marginTop: "5px",
            cursor: "pointer", width: "100%", fontSize: "13px"
        });
        btn.onclick = onclick;
        controlsDiv.appendChild(btn);
        controlsDiv.appendChild(document.createElement("br"));
        return btn;
    };

    const pauseBtn = makeButton("Pause", () => {
        paused = !paused;
        pauseBtn.textContent = paused ? "Resume" : "Pause";
    });

    makeButton("Toggle Dark/Light", toggleDarkLight);
    makeButton("Toggle Textures", toggleTextures);

    planetData.forEach((p, i) => {
        const container = document.createElement("div");
        Object.assign(container.style, {
            marginBottom: "10px", padding: "5px 0",
            borderBottom: "1px solid rgba(255,255,255,0.2)"
        });

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = true;
        checkbox.onchange = () => planets[i].mesh.visible = checkbox.checked;
        container.appendChild(checkbox);

        const label = document.createElement("label");
        label.textContent = ` ${p.name}`;
        label.style.marginLeft = "5px";
        container.appendChild(label);

        const speedLabel = document.createElement("span");
        speedLabel.textContent = `Speed: ${planets[i].orbitSpeed.toFixed(3)}`;
        Object.assign(speedLabel.style, { display: "block", margin: "5px 0 3px" });
        container.appendChild(speedLabel);

        const slider = document.createElement("input");
        Object.assign(slider, {
            type: "range", min: "0", max: "0.05", step: "0.001",
            value: planets[i].orbitSpeed
        });
        slider.style.width = "100%";
        slider.oninput = e => {
            const val = parseFloat(e.target.value);
            planets[i].orbitSpeed = val;
            speedLabel.textContent = `Speed: ${val.toFixed(3)}`;
        };
        container.appendChild(slider);

        controlsDiv.appendChild(container);
    });
}

function toggleDarkLight() {
    darkMode = !darkMode;
    scene.background = new THREE.Color(darkMode ? 0x000000 : 0xffffff);
}

function toggleTextures() {
    texturesEnabled = !texturesEnabled;
    planets.forEach(p => {
        p.mesh.material.map = texturesEnabled ? p.texture : null;
        p.mesh.material.needsUpdate = true;
    });
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const hit = raycaster.intersectObjects(planets.map(p => p.mesh));
    if (hit.length > 0) {
        tooltip.style.display = "block";
        tooltip.style.left = `${event.clientX + 10}px`;
        tooltip.style.top = `${event.clientY + 10}px`;
        tooltip.textContent = hit[0].object.name;
    } else tooltip.style.display = "none";
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate(t = 0) {
    requestAnimationFrame(animate);

    if (!paused) {
        planets.forEach(p => {
            p.angle += p.orbitSpeed;
            p.mesh.rotation.y += p.rotationSpeed;
            p.mesh.position.x = Math.cos(p.angle) * p.distance;
            p.mesh.position.z = Math.sin(p.angle) * p.distance;

            if (p.moon) {
                p.moon.angle += p.moon.orbitSpeed;
                p.moon.mesh.position.x = Math.cos(p.moon.angle) * p.moon.distance;
                p.moon.mesh.position.z = Math.sin(p.moon.angle) * p.moon.distance;
            }
        });

        if (sun) {
            sun.rotation.y += 0.001;
            sun.userData.update(t * 0.001);
        }
    }

    controls.update();
    renderer.render(scene, camera);
}

initScene();
animate();
