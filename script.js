
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/controls/OrbitControls.js";

// ==========================================
// SCENE
// ==========================================

const canvas = document.getElementById("viewer");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#080d15");

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 0, 9);

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;

// ==========================================
// LIGHTING
// ==========================================

scene.add(new THREE.AmbientLight("#ffffff", 1.8));

const frontLight = new THREE.PointLight("#ffffff", 35);
frontLight.position.set(0, 2, 5);
scene.add(frontLight);

const blueLight = new THREE.PointLight("#5a9fff", 25);
blueLight.position.set(-4, 1, 1);
scene.add(blueLight);

const purpleLight = new THREE.PointLight("#c77bff", 25);
purpleLight.position.set(4, 0, 1);
scene.add(purpleLight);

// ==========================================
// PARTICLE GROUP
// ==========================================

const wolf = new THREE.Group();
scene.add(wolf);

const particles = [];
const particleGeometry = new THREE.BufferGeometry();

const positions = [];
const colors = [];
const sizes = [];

const colorSilver = new THREE.Color("#C0C5CC");
const colorDark = new THREE.Color("#555D68");
const colorBlue = new THREE.Color("#667F99");
const colorBlack = new THREE.Color("#252b35");
const colorGold = new THREE.Color("#ffbd50");

// ==========================================
// PARTICLE CREATION
// ==========================================

function addParticle(x, y, z, color, size = 0.035) {
    positions.push(x, y, z);

    colors.push(color.r, color.g, color.b);

    sizes.push(size);

    particles.push({
        x, y, z,
        originalX: x,
        originalY: y,
        originalZ: z,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.7,
        floating: false
    });
}

// Random point inside an ellipsoid
function insideEllipsoid(rx, ry, rz) {
    let x, y, z;

    do {
        x = (Math.random() * 2 - 1) * rx;
        y = (Math.random() * 2 - 1) * ry;
        z = (Math.random() * 2 - 1) * rz;
    } while (
        (x * x) / (rx * rx) +
        (y * y) / (ry * ry) +
        (z * z) / (rz * rz) > 1
    );

    return [x, y, z];
}

// ==========================================
// HEAD SHAPE
// ==========================================

// Skull: broad, rounded wolf head
for (let i = 0; i < 2200; i++) {
    const [x, y, z] = insideEllipsoid(1.05, 1.35, 0.55);

    const color = Math.random() > 0.25
        ? colorSilver
        : colorDark;

    addParticle(
        x,
        y + 0.15,
        z,
        color,
        0.025 + Math.random() * 0.025
    );
}

// ==========================================
// POINTED EARS
// ==========================================

function addEar(side) {
    const count = 550;

    for (let i = 0; i < count; i++) {
        const t = Math.random();

        const height = Math.random() * 1.3;

        const width = (1 - height / 1.3) * 0.38;

        const x = side * (0.72 + t * 0.12)
            + (Math.random() * 2 - 1) * width;

        const y = 1.05 + height;

        const z = (Math.random() * 2 - 1) * 0.28;

        const color = Math.random() > 0.5
            ? colorSilver
            : colorDark;

        addParticle(
            x, y, z,
            color,
            0.025 + Math.random() * 0.025
        );
    }

    // Dark inner ear
    for (let i = 0; i < 140; i++) {
        const height = Math.random() * 0.85;

        const width = (1 - height / 0.85) * 0.18;

        addParticle(
            side * 0.82 + (Math.random() * 2 - 1) * width,
            1.25 + height,
            0.25,
            colorDark,
            0.03
        );
    }
}

addEar(-1);
addEar(1);

// ==========================================
// CHEEKS
// ==========================================

for (const side of [-1, 1]) {
    for (let i = 0; i < 650; i++) {
        const [x, y, z] = insideEllipsoid(0.48, 0.72, 0.35);

        addParticle(
            side * (0.78 + Math.abs(x) * 0.2),
            y - 0.25,
            z + 0.12,
            Math.random() > 0.4 ? colorDark : colorSilver,
            0.025 + Math.random() * 0.03
        );
    }
}

// ==========================================
// WOLF MUZZLE
// ==========================================

// Long upper muzzle
for (let i = 0; i < 850; i++) {
    const [x, y, z] = insideEllipsoid(0.38, 0.58, 0.42);

    addParticle(
        x,
        y - 0.32,
        z + 0.55,
        Math.random() > 0.3 ? colorSilver : colorDark,
        0.025 + Math.random() * 0.025
    );
}

// Lower jaw
for (let i = 0; i < 400; i++) {
    const [x, y, z] = insideEllipsoid(0.42, 0.25, 0.3);

    addParticle(
        x,
        y - 0.92,
        z + 0.5,
        colorDark,
        0.025 + Math.random() * 0.02
    );
}

// Nose
for (let i = 0; i < 120; i++) {
    const [x, y, z] = insideEllipsoid(0.22, 0.13, 0.15);

    addParticle(
        x,
        y - 0.02,
        z + 1.05,
        colorBlack,
        0.025 + Math.random() * 0.03
    );
}

// ==========================================
// EYES
// ==========================================

for (const side of [-1, 1]) {
    // Dark eye socket
    for (let i = 0; i < 120; i++) {
        const [x, y, z] = insideEllipsoid(0.23, 0.14, 0.09);

        addParticle(
            side * 0.42 + x,
            0.25 + y,
            0.48 + z,
            colorBlack,
            0.03
        );
    }

    // Amber glowing eye
    for (let i = 0; i < 65; i++) {
        const [x, y, z] = insideEllipsoid(0.13, 0.07, 0.05);

        addParticle(
            side * 0.42 + x,
            0.25 + y,
            0.59 + z,
            colorGold,
            0.025 + Math.random() * 0.025
        );
    }

    // Vertical pupil
    for (let i = 0; i < 20; i++) {
        addParticle(
            side * 0.42,
            0.25 + (Math.random() - 0.5) * 0.1,
            0.65,
            colorBlack,
            0.025
        );
    }
}

// ==========================================
// FLOATING PARTICLES
// ==========================================

const floatingParticles = [];

for (let i = 0; i < 500; i++) {
    const x = (Math.random() - 0.5) * 5;
    const y = (Math.random() - 0.5) * 5;
    const z = (Math.random() - 0.5) * 3;

    const color = Math.random() > 0.5
        ? colorSilver
        : colorBlue;

    addParticle(
        x, y, z,
        color,
        0.015 + Math.random() * 0.025
    );

    floatingParticles.push(particles[particles.length - 1]);

    floatingParticles[floatingParticles.length - 1].floating = true;
}

// ==========================================
// BUILD PARTICLE GEOMETRY
// ==========================================

particleGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
);

particleGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
);

particleGeometry.setAttribute(
    "size",
    new THREE.Float32BufferAttribute(sizes, 1)
);

// Circular particle texture
const particleCanvas = document.createElement("canvas");
particleCanvas.width = 64;
particleCanvas.height = 64;

const ctx = particleCanvas.getContext("2d");

const gradient = ctx.createRadialGradient(
    32, 32, 0,
    32, 32, 32
);

gradient.addColorStop(0, "rgba(255,255,255,1)");
gradient.addColorStop(0.3, "rgba(255,255,255,0.9)");
gradient.addColorStop(1, "rgba(255,255,255,0)");

ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 64, 64);

const particleTexture = new THREE.CanvasTexture(particleCanvas);

const particleMaterial = new THREE.PointsMaterial({
    size: 0.065,
    map: particleTexture,
    vertexColors: true,
    transparent: true,
    opacity: 0.95,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
});

const points = new THREE.Points(
    particleGeometry,
    particleMaterial
);

wolf.add(points);

// ==========================================
// CONTROLS
// ==========================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;

controls.minDistance = 4;
controls.maxDistance = 14;

controls.target.set(0, 0.1, 0);

controls.update();

// Reset button
const reset = document.getElementById("reset");

if (reset) {
    reset.addEventListener("click", () => {
        camera.position.set(0, 0, 9);
        controls.target.set(0, 0.1, 0);
        controls.update();
    });
}

// ==========================================
// ANIMATION
// ==========================================

const positionAttribute = particleGeometry.attributes.position;

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.001;

    // Subtle motion for floating particles
    for (const p of floatingParticles) {
        const i = particles.indexOf(p);

        positionAttribute.array[i * 3] =
            p.originalX + Math.sin(time * p.speed + p.phase) * 0.08;

        positionAttribute.array[i * 3 + 1] =
            p.originalY + Math.cos(time * p.speed + p.phase) * 0.1;

        positionAttribute.array[i * 3 + 2] =
            p.originalZ + Math.sin(time * 0.5 + p.phase) * 0.05;
    }

    positionAttribute.needsUpdate = true;

    controls.update();
    renderer.render(scene, camera);
}

animate();

// ==========================================
// RESIZE
// ==========================================

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );
});
