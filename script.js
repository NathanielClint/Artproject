import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/controls/OrbitControls.js";

// ==================================================
// 1. SCENE SETUP
// ==================================================

const canvas = document.getElementById("viewer");

if (!canvas) {
    throw new Error("Canvas #viewer was not found in index.html");
}

const scene = new THREE.Scene();
scene.background = new THREE.Color("#080d16");

const camera = new THREE.PerspectiveCamera(
    38,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.35;

// ==================================================
// 2. LIGHTING
// ==================================================

scene.add(
    new THREE.HemisphereLight("#d9f5ff", "#18202e", 2.6)
);

const frontLight = new THREE.DirectionalLight("#ffffff", 3.5);
frontLight.position.set(0, 3, 8);
scene.add(frontLight);

const cyanLight = new THREE.PointLight("#00dfff", 30);
cyanLight.position.set(-4, 1, 4);
scene.add(cyanLight);

const purpleLight = new THREE.PointLight("#c45aff", 25);
purpleLight.position.set(4, 1, 3);
scene.add(purpleLight);

const rimLight = new THREE.PointLight("#168bff", 35);
rimLight.position.set(0, 3, -4);
scene.add(rimLight);

// ==================================================
// 3. COLORS
// ==================================================

const COLORS = {
    navy: "#102f50",
    blue: "#15547c",
    blueLight: "#197da5",
    cyan: "#00d9f5",
    cyanLight: "#70f5ff",
    silver: "#aebbc4",
    silverLight: "#e0e4e7",
    gray: "#626e78",
    dark: "#19222c",
    black: "#080b10",
    red: "#ff342d",
    orange: "#ff7a29",
    gold: "#ffcc63"
};

function color(hex) {
    return new THREE.Color(hex);
}

// ==================================================
// 4. WOLF GROUP
// ==================================================

const wolf = new THREE.Group();
scene.add(wolf);

// ==================================================
// 5. PARTICLE SYSTEM
// ==================================================

// Every particle is a solid, faceted 3D object.
// InstancedMesh allows thousands of solid particles
// to render efficiently.

const particleGeometry = new THREE.IcosahedronGeometry(
    0.085,
    0
);

const particleMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    roughness: 0.55,
    metalness: 0.22,
    flatShading: true
});

const particleData = [];

function addParticle(x, y, z, hex, size = 1) {
    particleData.push({
        x,
        y,
        z,
        hex,
        size,
        rotationX: Math.random() * Math.PI,
        rotationY: Math.random() * Math.PI,
        rotationZ: Math.random() * Math.PI
    });
}

// ==================================================
// 6. SHAPE HELPERS
// ==================================================

function pointInPolygon(x, y, polygon) {
    let inside = false;

    for (
        let i = 0, j = polygon.length - 1;
        i < polygon.length;
        j = i++
    ) {
        const xi = polygon[i][0];
        const yi = polygon[i][1];

        const xj = polygon[j][0];
        const yj = polygon[j][1];

        const intersect =
            ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect) inside = !inside;
    }

    return inside;
}

// Fill a polygon with solid particles.
function fillPolygon(
    polygon,
    count,
    colorFunction,
    zFront = 0.2,
    depth = 0.3,
    sizeMin = 0.7,
    sizeMax = 1.2
) {
    const xs = polygon.map(p => p[0]);
    const ys = polygon.map(p => p[1]);

    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    let created = 0;
    let attempts = 0;

    while (created < count && attempts < count * 15) {
        attempts++;

        const x = minX + Math.random() * (maxX - minX);
        const y = minY + Math.random() * (maxY - minY);

        if (!pointInPolygon(x, y, polygon)) continue;

        const z = zFront + (Math.random() - 0.5) * depth;
        const hex = colorFunction(x, y);

        const size = sizeMin + Math.random() * (sizeMax - sizeMin);

        addParticle(x, y, z, hex, size);

        created++;
    }
}

// ==================================================
// 7. MAIN WOLF SILHOUETTE
// ==================================================

// Symmetrical outline inspired by the reference image.
// Tall pointed ears, wide cheek flares, pointed chin.

const headOutline = [
    [-0.28, 2.95],
    [-0.58, 2.52],
    [-0.88, 2.08],
    [-1.12, 1.78],
    [-1.17, 1.25],
    [-1.08, 0.78],
    [-1.45, 0.45],
    [-1.72, 0.05],
    [-1.35, -0.03],
    [-1.63, -0.42],
    [-1.3, -0.48],
    [-1.45, -0.93],
    [-1.12, -1.28],
    [-0.9, -1.85],
    [-0.55, -2.3],
    [-0.25, -2.55],
    [0, -2.78],
    [0.25, -2.55],
    [0.55, -2.3],
    [0.9, -1.85],
    [1.12, -1.28],
    [1.45, -0.93],
    [1.3, -0.48],
    [1.63, -0.42],
    [1.35, -0.03],
    [1.72, 0.05],
    [1.45, 0.45],
    [1.08, 0.78],
    [1.17, 1.25],
    [1.12, 1.78],
    [0.88, 2.08],
    [0.58, 2.52],
    [0.28, 2.95],
    [0.12, 2.25],
    [-0.12, 2.25]
];

// Main blue outer head
fillPolygon(
    headOutline,
    1600,
    (x, y) => {
        if (y < -1.5) return COLORS.navy;
        if (Math.abs(x) > 1.2) return COLORS.blue;
        return Math.random() > 0.5 ? COLORS.blue : COLORS.navy;
    },
    0,
    0.45,
    0.8,
    1.3
);

// ==================================================
// 8. LARGE EAR SHAPES
// ==================================================

const leftEar = [
    [-1.08, 1.15],
    [-1.15, 1.8],
    [-0.58, 2.95],
    [-0.3, 2.15],
    [-0.35, 1.5],
    [-0.68, 1.1]
];

const rightEar = leftEar.map(([x, y]) => [-x, y]);

for (const ear of [leftEar, rightEar]) {
    fillPolygon(
        ear,
        300,
        () => Math.random() > 0.5 ? COLORS.blue : COLORS.navy,
        0.24,
        0.2,
        0.8,
        1.1
    );
}

// Dark inner ear panels
const leftInnerEar = [
    [-0.93, 1.45],
    [-0.99, 1.85],
    [-0.59, 2.65],
    [-0.52, 1.8],
    [-0.65, 1.42]
];

const rightInnerEar = leftInnerEar.map(([x, y]) => [-x, y]);

for (const ear of [leftInnerEar, rightInnerEar]) {
    fillPolygon(
        ear,
        140,
        () => COLORS.dark,
        0.43,
        0.08,
        0.65,
        1
    );
}

// ==================================================
// 9. CYAN FOREHEAD STRIPES
// ==================================================

const forehead = [
    [-0.3, 2.1],
    [0, 2.45],
    [0.3, 2.1],
    [0.43, 1.2],
    [0.25, 0.5],
    [0, 0.15],
    [-0.25, 0.5],
    [-0.43, 1.2]
];

fillPolygon(
    forehead,
    240,
    () => COLORS.cyan,
    0.53,
    0.08,
    0.7,
    1.1
);

// Bright central forehead highlight
const foreheadHighlight = [
    [-0.1, 1.9],
    [0, 2.2],
    [0.1, 1.9],
    [0.18, 1.15],
    [0, 0.85],
    [-0.18, 1.15]
];

fillPolygon(
    foreheadHighlight,
    90,
    () => COLORS.cyanLight,
    0.63,
    0.05,
    0.6,
    0.9
);

// ==================================================
// 10. EYE SOCKETS
// ==================================================

const leftEye = [
    [-0.95, 1.05],
    [-0.55, 1.25],
    [-0.2, 1.05],
    [-0.28, 0.72],
    [-0.62, 0.62],
    [-0.88, 0.8]
];

const rightEye = leftEye.map(([x, y]) => [-x, y]);

for (const eye of [leftEye, rightEye]) {
    fillPolygon(
        eye,
        160,
        () => COLORS.black,
        0.67,
        0.06,
        0.75,
        1.05
    );
}

// ==================================================
// 11. RED AND ORANGE EYE ACCENTS
// ==================================================

const leftEyeAccent = [
    [-0.98, 1.1],
    [-0.91, 1.08],
    [-0.83, 0.83],
    [-0.68, 0.73],
    [-0.4, 0.76],
    [-0.48, 0.68],
    [-0.77, 0.65],
    [-0.94, 0.83]
];

const rightEyeAccent = leftEyeAccent.map(([x, y]) => [-x, y]);

for (const accent of [leftEyeAccent, rightEyeAccent]) {
    fillPolygon(
        accent,
        95,
        () => COLORS.red,
        0.77,
        0.035,
        0.65,
        0.95
    );
}

// ==================================================
// 12. CYAN CHEEK PANELS
// ==================================================

const leftCheek = [
    [-1.5, 0.1],
    [-1.1, 0.55],
    [-0.72, 0.3],
    [-0.55, -0.15],
    [-0.85, -0.65],
    [-1.25, -0.55]
];

const rightCheek = leftCheek.map(([x, y]) => [-x, y]);

for (const cheek of [leftCheek, rightCheek]) {
    fillPolygon(
        cheek,
        190,
        () => Math.random() > 0.3 ? COLORS.blueLight : COLORS.blue,
        0.48,
        0.1,
        0.7,
        1.1
    );
}

// ==================================================
// 13. ANGULAR SILVER CHEEK FUR
// ==================================================

const leftSilverCheek = [
    [-0.78, 0.1],
    [-0.5, 0.3],
    [-0.28, -0.12],
    [-0.42, -0.65],
    [-0.78, -1.05],
    [-1.05, -0.72]
];

const rightSilverCheek = leftSilverCheek.map(([x, y]) => [-x, y]);

for (const cheek of [leftSilverCheek, rightSilverCheek]) {
    fillPolygon(
        cheek,
        170,
        () => Math.random() > 0.5 ? COLORS.silver : COLORS.gray,
        0.63,
        0.08,
        0.75,
        1.2
    );
}

// ==================================================
// 14. LONG CENTRAL MUZZLE
// ==================================================

const muzzle = [
    [-0.35, 0.75],
    [0, 0.5],
    [0.35, 0.75],
    [0.25, -0.65],
    [0.15, -1.3],
    [0, -1.48],
    [-0.15, -1.3],
    [-0.25, -0.65]
];

fillPolygon(
    muzzle,
    350,
    () => Math.random() > 0.35 ? COLORS.cyan : COLORS.blueLight,
    0.75,
    0.1,
    0.7,
    1.2
);

// ==================================================
// 15. MUZZLE SIDE PLATES
// ==================================================

const leftMuzzlePlate = [
    [-0.48, 0.05],
    [-0.18, -0.1],
    [-0.15, -0.85],
    [-0.4, -1.1],
    [-0.65, -0.7]
];

const rightMuzzlePlate = leftMuzzlePlate.map(([x, y]) => [-x, y]);

for (const plate of [leftMuzzlePlate, rightMuzzlePlate]) {
    fillPolygon(
        plate,
        100,
        () => COLORS.silver,
        0.84,
        0.05,
        0.65,
        1
    );
}

// ==================================================
// 16. NOSE AND MOUTH
// ==================================================

const nose = [
    [-0.24, -1.15],
    [0.24, -1.15],
    [0.3, -1.38],
    [0, -1.52],
    [-0.3, -1.38]
];

fillPolygon(
    nose,
    110,
    () => COLORS.dark,
    0.95,
    0.06,
    0.65,
    1
);

// Nose highlight
const noseHighlight = [
    [-0.12, -1.2],
    [0.12, -1.2],
    [0, -1.27]
];

fillPolygon(
    noseHighlight,
    25,
    () => COLORS.gray,
    1.02,
    0.02,
    0.6,
    0.8
);

// Mouth
const mouth = [
    [-0.18, -1.45],
    [0.18, -1.45],
    [0.1, -1.65],
    [0, -1.7],
    [-0.1, -1.65]
];

fillPolygon(
    mouth,
    55,
    () => COLORS.black,
    0.91,
    0.03,
    0.65,
    0.9
);

// ==================================================
// 17. LOWER FACE / CHIN
// ==================================================

const chin = [
    [-0.45, -1.2],
    [-0.25, -1.55],
    [0, -2.35],
    [0.25, -1.55],
    [0.45, -1.2],
    [0.3, -2.05],
    [0, -2.65],
    [-0.3, -2.05]
];

fillPolygon(
    chin,
    250,
    () => Math.random() > 0.5 ? COLORS.blue : COLORS.navy,
    0.45,
    0.12,
    0.7,
    1.1
);

// Bright chin stripe
const chinStripe = [
    [-0.15, -1.85],
    [0, -2.55],
    [0.15, -1.85],
    [0, -2.05]
];

fillPolygon(
    chinStripe,
    55,
    () => COLORS.cyan,
    0.62,
    0.04,
    0.65,
    0.95
);

// ==================================================
// 18. SOLID PARTICLE INSTANCING
// ==================================================

// Create one InstancedMesh containing all the
// individual solid particles.

const instanceCount = particleData.length;

const particleMesh = new THREE.InstancedMesh(
    particleGeometry,
    particleMaterial,
    instanceCount
);

const dummy = new THREE.Object3D();

const instanceColor = new THREE.Color();

for (let i = 0; i < instanceCount; i++) {
    const p = particleData[i];

    dummy.position.set(p.x, p.y, p.z);

    dummy.rotation.set(
        p.rotationX,
        p.rotationY,
        p.rotationZ
    );

    dummy.scale.setScalar(p.size);

    dummy.updateMatrix();

    particleMesh.setMatrixAt(i, dummy.matrix);

    instanceColor.set(p.hex);

    particleMesh.setColorAt(i, instanceColor);
}

particleMesh.instanceMatrix.needsUpdate = true;

if (particleMesh.instanceColor) {
    particleMesh.instanceColor.needsUpdate = true;
}

wolf.add(particleMesh);

// ==================================================
// 19. EXTRA FLOATING SOLID PARTICLES
// ==================================================

const floatingParticles = [];

const floatingGeometry = new THREE.IcosahedronGeometry(
    0.035,
    0
);

const floatingMaterial = new THREE.MeshStandardMaterial({
    color: "#70eaff",
    emissive: "#146e91",
    emissiveIntensity: 0.4,
    roughness: 0.4,
    metalness: 0.3,
    flatShading: true
});

for (let i = 0; i < 180; i++) {
    const particle = new THREE.Mesh(
        floatingGeometry,
        floatingMaterial
    );

    particle.position.set(
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 2
    );

    particle.userData.originalY = particle.position.y;
    particle.userData.phase = Math.random() * Math.PI * 2;
    particle.userData.speed = 0.3 + Math.random() * 0.7;

    floatingParticles.push(particle);
    scene.add(particle);
}

// ==================================================
// 20. ORBIT CONTROLS
// ==================================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;

controls.minDistance = 5;
controls.maxDistance = 15;

controls.minPolarAngle = 0.35;
controls.maxPolarAngle = Math.PI - 0.35;

controls.target.set(0, 0, 0);
controls.update();

// Reset view
const resetButton = document.getElementById("reset");

if (resetButton) {
    resetButton.addEventListener("click", () => {
        camera.position.set(0, 0, 10);
        controls.target.set(0, 0, 0);
        controls.update();
    });
}

// ==================================================
// 21. ANIMATION
// ==================================================

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now() * 0.001;

    for (const p of floatingParticles) {
        p.position.y =
            p.userData.originalY +
            Math.sin(time * p.userData.speed + p.userData.phase) * 0.12;

        p.rotation.x += 0.003;
        p.rotation.y += 0.004;
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();

// ==================================================
// 22. RESIZE
// ==================================================

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
