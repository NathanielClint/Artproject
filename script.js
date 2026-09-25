import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/controls/OrbitControls.js";

// ==================================================
// 1. SCENE
// ==================================================

const canvas = document.getElementById("viewer");

if (!canvas) {
    throw new Error("Canvas #viewer not found");
}

const scene = new THREE.Scene();
scene.background = new THREE.Color("#10141c");

const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 0, 11);

const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// ==================================================
// 2. LIGHTS
// ==================================================

scene.add(
    new THREE.HemisphereLight("#d9f6ff", "#111827", 2.2)
);

const frontLight = new THREE.DirectionalLight("#ffffff", 3.5);
frontLight.position.set(0, 4, 8);
scene.add(frontLight);

const leftLight = new THREE.PointLight("#00dfff", 18);
leftLight.position.set(-4, 1, 3);
scene.add(leftLight);

const rightLight = new THREE.PointLight("#d58aff", 18);
rightLight.position.set(4, 1, 3);
scene.add(rightLight);

const rimLight = new THREE.DirectionalLight("#438bff", 2.5);
rimLight.position.set(0, 2, -5);
scene.add(rimLight);

// ==================================================
// 3. WOLF GROUP AND MATERIALS
// ==================================================

const wolf = new THREE.Group();
scene.add(wolf);

const C = {
    navy: "#123652",
    navyLight: "#174d70",
    blue: "#17638b",
    blueBright: "#168bb0",
    cyan: "#00cce9",
    cyanBright: "#39efff",
    cyanPale: "#8cffff",
    silver: "#b8c0c5",
    silverLight: "#d8dce0",
    gray: "#7e8990",
    grayDark: "#4c5861",
    black: "#10151b",
    blackBlue: "#091522",
    red: "#fa352b",
    orange: "#ff782f",
    white: "#f0f2f4"
};

function mat(hex, metalness = 0.15, roughness = 0.65) {
    return new THREE.MeshStandardMaterial({
        color: hex,
        metalness,
        roughness,
        flatShading: true,
        side: THREE.DoubleSide
    });
}

// ==================================================
// 4. SOLID POLYGON GEOMETRY
// ==================================================

// Every region is an actual solid polygon with depth.
// This produces a faceted, mask-like 3D appearance.

function polygon(points, material, z = 0, depth = 0.08) {
    const shape = new THREE.Shape();

    shape.moveTo(points[0][0], points[0][1]);

    for (let i = 1; i < points.length; i++) {
        shape.lineTo(points[i][0], points[i][1]);
    }

    shape.closePath();

    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: false,
        curveSegments: 1
    });

    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.z = z;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    wolf.add(mesh);
    return mesh;
}

// Mirror a shape across the center line.
function mirror(points) {
    return points.map(([x, y]) => [-x, y]);
}

// Add a shape on both sides.
function symmetric(points, material, z = 0, depth = 0.08) {
    polygon(points, material, z, depth);
    polygon(mirror(points), material, z, depth);
}

// ==================================================
// 5. MAIN HEAD SILHOUETTE
// ==================================================

const silhouette = [
    [-0.25, 2.9],
    [-0.58, 2.35],
    [-0.9, 1.95],
    [-1.05, 1.45],
    [-1.0, 0.95],
    [-1.42, 0.55],
    [-1.7, 0.12],
    [-1.42, -0.08],
    [-1.58, -0.45],
    [-1.28, -0.6],
    [-1.3, -1.15],
    [-1.0, -1.65],
    [-0.75, -2.15],
    [-0.4, -2.48],
    [0, -2.78],
    [0.4, -2.48],
    [0.75, -2.15],
    [1.0, -1.65],
    [1.3, -1.15],
    [1.28, -0.6],
    [1.58, -0.45],
    [1.42, -0.08],
    [1.7, 0.12],
    [1.42, 0.55],
    [1.0, 0.95],
    [1.05, 1.45],
    [0.9, 1.95],
    [0.58, 2.35],
    [0.25, 2.9],
    [0, 2.2]
];

polygon(
    silhouette,
    mat(C.navy, 0.2),
    -0.45,
    0.45
);

// ==================================================
// 6. OUTER EAR SHAPES
// ==================================================

const ear = [
    [-1.08, 1.15],
    [-1.12, 1.85],
    [-0.58, 2.95],
    [-0.28, 2.3],
    [-0.32, 1.55],
    [-0.7, 1.0]
];

symmetric(ear, mat(C.navyLight), -0.05, 0.2);

// Blue ear facets
const earFacet = [
    [-1.02, 1.4],
    [-0.99, 1.83],
    [-0.62, 2.62],
    [-0.62, 1.7]
];

symmetric(earFacet, mat(C.blue), 0.17, 0.08);

// Inner ear black
const innerEar = [
    [-0.92, 1.48],
    [-0.93, 1.88],
    [-0.64, 2.55],
    [-0.66, 1.66]
];

symmetric(innerEar, mat(C.black), 0.28, 0.06);

// Red-orange inner ear stripe
const earStripe = [
    [-0.87, 1.55],
    [-0.85, 1.95],
    [-0.78, 2.18],
    [-0.78, 1.65],
    [-0.7, 1.4]
];

symmetric(earStripe, mat(C.red), 0.38, 0.035);

// Orange highlight inside ears
const earOrange = [
    [-0.82, 1.6],
    [-0.8, 1.95],
    [-0.77, 2.08],
    [-0.75, 1.65]
];

symmetric(earOrange, mat(C.orange), 0.43, 0.025);

// ==================================================
// 7. CENTER FOREHEAD
// ==================================================

const forehead = [
    [-0.28, 2.2],
    [0, 2.45],
    [0.28, 2.2],
    [0.42, 1.3],
    [0.27, 0.55],
    [0, 0.2],
    [-0.27, 0.55],
    [-0.42, 1.3]
];

polygon(forehead, mat(C.cyan), 0.3, 0.15);

// Bright cyan central forehead facet
const foreheadCenter = [
    [-0.12, 1.98],
    [0, 2.2],
    [0.12, 1.98],
    [0.19, 1.25],
    [0, 0.92],
    [-0.19, 1.25]
];

polygon(
    foreheadCenter,
    mat(C.cyanBright),
    0.47,
    0.04
);

// Blue forehead side facets
const foreheadSide = [
    [-0.58, 1.7],
    [-0.3, 1.9],
    [-0.28, 1.3],
    [-0.45, 0.7],
    [-0.72, 1.0]
];

symmetric(foreheadSide, mat(C.blue), 0.25, 0.09);

// ==================================================
// 8. EYE SOCKETS
// ==================================================

const eyeSocket = [
    [-0.95, 1.1],
    [-0.56, 1.3],
    [-0.22, 1.05],
    [-0.3, 0.75],
    [-0.62, 0.62],
    [-0.9, 0.82]
];

symmetric(eyeSocket, mat(C.blackBlue), 0.5, 0.08);

// Red eye stripe
const eyeRed = [
    [-0.95, 1.08],
    [-0.87, 1.04],
    [-0.76, 0.83],
    [-0.52, 0.75],
    [-0.37, 0.78],
    [-0.48, 0.69],
    [-0.78, 0.68],
    [-0.92, 0.84]
];

symmetric(eyeRed, mat(C.red), 0.61, 0.04);

// Orange eye highlight
const eyeOrange = [
    [-0.91, 1.03],
    [-0.84, 0.87],
    [-0.72, 0.76],
    [-0.52, 0.74],
    [-0.62, 0.71],
    [-0.82, 0.78]
];

symmetric(eyeOrange, mat(C.orange), 0.68, 0.025);

// Narrow red eye
const eye = [
    [-0.8, 0.91],
    [-0.55, 0.99],
    [-0.35, 0.9],
    [-0.56, 0.84]
];

symmetric(eye, mat(C.red), 0.72, 0.035);

// ==================================================
// 9. CHEEK FLARES
// ==================================================

const cheekOuter = [
    [-0.95, 0.65],
    [-1.45, 0.28],
    [-1.72, 0.02],
    [-1.4, -0.08],
    [-1.6, -0.4],
    [-1.3, -0.42],
    [-1.12, -0.85],
    [-0.88, -0.35],
    [-0.7, 0.2]
];

symmetric(cheekOuter, mat(C.blue), 0.12, 0.16);

// Bright cyan cheek tips
const cheekCyan = [
    [-1.42, 0.2],
    [-1.72, 0.02],
    [-1.42, -0.08],
    [-1.2, -0.02]
];

symmetric(cheekCyan, mat(C.cyan), 0.3, 0.05);

// Dark cheek facet
const cheekDark = [
    [-1.25, 0.18],
    [-0.9, 0.48],
    [-0.72, 0.08],
    [-0.95, -0.28],
    [-1.2, -0.18]
];

symmetric(cheekDark, mat(C.navy), 0.32, 0.08);

// ==================================================
// 10. SILVER CHEEK PLATES
// ==================================================

const silverCheek = [
    [-0.72, 0.12],
    [-0.4, 0.35],
    [-0.2, 0.05],
    [-0.28, -0.38],
    [-0.48, -0.72],
    [-0.82, -0.45],
    [-0.98, -0.1]
];

symmetric(silverCheek, mat(C.silver), 0.5, 0.08);

// Light gray upper cheek facet
const silverFacet = [
    [-0.72, 0.12],
    [-0.4, 0.35],
    [-0.3, 0.08],
    [-0.52, -0.05]
];

symmetric(silverFacet, mat(C.silverLight), 0.6, 0.04);

// Dark lower cheek
const lowerCheek = [
    [-0.88, -0.42],
    [-0.48, -0.72],
    [-0.35, -1.1],
    [-0.75, -0.92],
    [-1.0, -0.65]
];

symmetric(lowerCheek, mat(C.grayDark), 0.42, 0.08);

// ==================================================
// 11. MUZZLE BRIDGE
// ==================================================

const muzzle = [
    [-0.3, 0.72],
    [0, 0.45],
    [0.3, 0.72],
    [0.23, -0.25],
    [0.15, -0.9],
    [0, -1.2],
    [-0.15, -0.9],
    [-0.23, -0.25]
];

polygon(muzzle, mat(C.blueBright), 0.62, 0.14);

// Cyan muzzle highlight
const muzzleHighlight = [
    [-0.13, 0.5],
    [0, 0.7],
    [0.13, 0.5],
    [0.08, -0.5],
    [0, -0.7],
    [-0.08, -0.5]
];

polygon(
    muzzleHighlight,
    mat(C.cyan),
    0.79,
    0.045
);

// ==================================================
// 12. MUZZLE SIDE PANELS
// ==================================================

const muzzleSide = [
    [-0.46, 0.1],
    [-0.2, -0.05],
    [-0.18, -0.8],
    [-0.4, -1.05],
    [-0.62, -0.65]
];

symmetric(muzzleSide, mat(C.silver), 0.75, 0.09);

// Gray muzzle facets
const muzzleGray = [
    [-0.5, -0.25],
    [-0.24, -0.4],
    [-0.25, -0.85],
    [-0.43, -0.9]
];

symmetric(muzzleGray, mat(C.gray), 0.85, 0.04);

// ==================================================
// 13. NOSE
// ==================================================

const nose = [
    [-0.25, -1.12],
    [0.25, -1.12],
    [0.3, -1.35],
    [0.14, -1.48],
    [-0.14, -1.48],
    [-0.3, -1.35]
];

polygon(nose, mat(C.black), 0.94, 0.12);

// Nose center facet
const noseCenter = [
    [-0.14, -1.18],
    [0, -1.13],
    [0.14, -1.18],
    [0, -1.3]
];

polygon(noseCenter, mat(C.grayDark), 1.08, 0.025);

// Nostrils
const nostril = [
    [-0.18, -1.28],
    [-0.07, -1.3],
    [-0.09, -1.35],
    [-0.18, -1.34]
];

symmetric(nostril, mat(C.blackBlue), 1.12, 0.02);

// ==================================================
// 14. MOUTH AND LOWER JAW
// ==================================================

const mouth = [
    [-0.2, -1.48],
    [0.2, -1.48],
    [0.14, -1.65],
    [0, -1.72],
    [-0.14, -1.65]
];

polygon(mouth, mat(C.black), 0.92, 0.06);

// Lower face silhouette
const lowerFace = [
    [-0.45, -1.12],
    [-0.3, -1.55],
    [0, -2.6],
    [0.3, -1.55],
    [0.45, -1.12],
    [0.55, -1.75],
    [0.35, -2.2],
    [0, -2.72],
    [-0.35, -2.2],
    [-0.55, -1.75]
];

polygon(lowerFace, mat(C.navy), 0.25, 0.2);

// Cyan lower jaw stripe
const jawStripe = [
    [-0.14, -1.8],
    [0, -2.52],
    [0.14, -1.8],
    [0, -2.05]
];

polygon(jawStripe, mat(C.cyan), 0.49, 0.05);

// ==================================================
// 15. RED SIDE ACCENTS
// ==================================================

const sideAccent = [
    [-1.1, 0.4],
    [-1.2, -0.05],
    [-1.05, -0.55],
    [-0.98, -0.48],
    [-1.08, -0.05]
];

symmetric(sideAccent, mat(C.red), 0.63, 0.035);

// Orange inner highlight
const sideOrange = [
    [-1.1, 0.25],
    [-1.12, -0.05],
    [-1.0, -0.4],
    [-1.0, -0.15]
];

symmetric(sideOrange, mat(C.orange), 0.68, 0.025);

// ==================================================
// 16. SMALL SOLID FACET PARTICLES
// ==================================================

// Fill selected regions with small solid triangles.
// They add a particle-like faceted surface without
// changing the reference's recognizable silhouette.

const triangleGeometry = new THREE.BufferGeometry();

triangleGeometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute([
        0, 0.09, 0,
        -0.075, -0.06, 0,
        0.075, -0.06, 0
    ], 3)
);

triangleGeometry.computeVertexNormals();

const triangleColors = [
    C.blue,
    C.navyLight,
    C.blueBright,
    C.cyan,
    C.gray,
    C.silver
];

const facetMaterial = new THREE.MeshStandardMaterial({
    color: "#ffffff",
    flatShading: true,
    roughness: 0.7,
    metalness: 0.15,
    side: THREE.DoubleSide
});

const facetGroup = new THREE.Group();
wolf.add(facetGroup);

function addTriangle(x, y, z, hex, scale = 1, rotation = 0) {
    const geometry = triangleGeometry.clone();

    geometry.scale(scale, scale, scale);

    const material = facetMaterial.clone();
    material.color.set(hex);

    const mesh = new THREE.Mesh(geometry, material);

    mesh.position.set(x, y, z);
    mesh.rotation.z = rotation;

    facetGroup.add(mesh);
}

// Scatter solid triangular facets on the blue head
for (let i = 0; i < 280; i++) {
    const x = THREE.MathUtils.randFloat(-1.05, 1.05);
    const y = THREE.MathUtils.randFloat(-0.8, 1.6);

    // Keep facets away from the eyes and central muzzle
    if (Math.abs(x) < 0.35 && y < 1.0) continue;

    const hex = triangleColors[
        Math.floor(Math.random() * triangleColors.length)
    ];

    addTriangle(
        x,
        y,
        0.17 + Math.random() * 0.08,
        hex,
        THREE.MathUtils.randFloat(0.45, 0.85),
        Math.random() * Math.PI
    );
}

// ==================================================
// 17. CONTROLS
// ==================================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enablePan = false;

controls.minDistance = 5;
controls.maxDistance = 16;

controls.minPolarAngle = 0.25;
controls.maxPolarAngle = Math.PI - 0.25;

controls.target.set(0, 0.05, 0);
controls.update();

// Reset button
const resetButton = document.getElementById("reset");

if (resetButton) {
    resetButton.addEventListener("click", () => {
        camera.position.set(0, 0, 11);
        controls.target.set(0, 0.05, 0);
        controls.update();
    });
}

// ==================================================
// 18. ANIMATION
// ==================================================

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

animate();

// ==================================================
// 19. RESIZE
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
