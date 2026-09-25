
import * as THREE from
    'https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js';

import { OrbitControls } from
    'https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/controls/OrbitControls.js';

// ================================
// SCENE SETUP
// ================================

const canvas = document.getElementById("viewer");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0b0d);

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 0, 9);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);

renderer.setPixelRatio(
    Math.min(window.devicePixelRatio, 2)
);

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// ================================
// MOUSE AND TOUCH CONTROLS
// ================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.05;

controls.enableZoom = true;
controls.enablePan = false;

controls.minDistance = 4;
controls.maxDistance = 15;

// ================================
// LIGHTING
// ================================

scene.add(
    new THREE.AmbientLight(0xffffff, 1.5)
);

const mainLight = new THREE.DirectionalLight(
    0xffffff,
    3
);

mainLight.position.set(5, 5, 8);
scene.add(mainLight);

const sideLight = new THREE.PointLight(
    0x6699ff,
    40
);

sideLight.position.set(-4, 2, -4);
scene.add(sideLight);

const rimLight = new THREE.PointLight(
    0xffffff,
    25
);

rimLight.position.set(3, -3, -2);
scene.add(rimLight);

// ================================
// ARTWORK GROUP
// ================================

const artwork = new THREE.Group();
scene.add(artwork);

const fragments = new THREE.Group();
artwork.add(fragments);

// Wolf materials

const wolfMaterial = new THREE.MeshStandardMaterial({
    color: 0xb5b5b5,
    metalness: 0.55,
    roughness: 0.3,
    flatShading: true
});

const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x454545,
    metalness: 0.6,
    roughness: 0.35,
    flatShading: true
});

const accentMaterial = new THREE.MeshStandardMaterial({
    color: 0x8a9ca8,
    metalness: 0.7,
    roughness: 0.25,
    flatShading: true
});

// ================================
// WOLF SILHOUETTE
// ================================

// This shape defines the front-facing wolf outline.
// The fragments are scattered within this shape.

const wolfShape = new THREE.Shape();

wolfShape.moveTo(-2.1, 0.2);

// Head and ears
wolfShape.lineTo(-2.4, 0.7);
wolfShape.lineTo(-2.3, 1.7);
wolfShape.lineTo(-1.7, 1.2);
wolfShape.lineTo(-1.1, 1.5);
wolfShape.lineTo(-0.6, 1.3);

// Back
wolfShape.lineTo(0.3, 0.9);
wolfShape.lineTo(1.1, 0.8);
wolfShape.lineTo(1.8, 1.2);

// Tail
wolfShape.lineTo(2.5, 1.5);
wolfShape.lineTo(2.3, 0.9);
wolfShape.lineTo(1.8, 0.4);

// Body
wolfShape.lineTo(2.1, -0.2);
wolfShape.lineTo(1.6, -0.6);
wolfShape.lineTo(1.1, -0.6);

// Front leg
wolfShape.lineTo(0.8, -1.5);
wolfShape.lineTo(0.3, -1.5);
wolfShape.lineTo(0.2, -0.5);

// Belly
wolfShape.lineTo(-0.8, -0.5);

// Back leg
wolfShape.lineTo(-1.1, -1.5);
wolfShape.lineTo(-1.6, -1.5);
wolfShape.lineTo(-1.5, -0.4);

// Neck and jaw
wolfShape.lineTo(-2.1, -0.2);
wolfShape.lineTo(-2.5, 0.1);

wolfShape.closePath();

// ================================
// FRAGMENT GENERATOR
// ================================

const shapePoints = wolfShape.getPoints(100);

function isInsideWolf(x, y) {
    return THREE.ShapeUtils.isPointInsidePolygon(
        new THREE.Vector2(x, y),
        shapePoints
    );
}

// Generate the main wolf fragments

for (let i = 0; i < 700; i++) {

    const x = THREE.MathUtils.randFloat(-2.5, 2.5);
    const y = THREE.MathUtils.randFloat(-1.5, 1.7);

    if (!isInsideWolf(x, y)) {
        continue;
    }

    const size = THREE.MathUtils.randFloat(
        0.05,
        0.16
    );

    const geometry = new THREE.TetrahedronGeometry(
        size,
        0
    );

    const materialChoice = Math.random();

    let material;

    if (materialChoice < 0.55) {
        material = wolfMaterial;
    } else if (materialChoice < 0.85) {
        material = darkMaterial;
    } else {
        material = accentMaterial;
    }

    const piece = new THREE.Mesh(
        geometry,
        material
    );

    // Position fragments within the wolf silhouette

    piece.position.set(
        x,
        y,
        THREE.MathUtils.randFloat(-0.35, 0.35)
    );

    // Give every piece a different orientation

    piece.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );

    fragments.add(piece);
}

// ================================
// FLOATING FRAGMENTS
// ================================

// Additional fragments around the main sculpture

for (let i = 0; i < 100; i++) {

    const size = THREE.MathUtils.randFloat(
        0.04,
        0.13
    );

    const geometry = new THREE.TetrahedronGeometry(
        size,
        0
    );

    const piece = new THREE.Mesh(
        geometry,
        Math.random() > 0.5
            ? wolfMaterial
            : darkMaterial
    );

    piece.position.set(
        THREE.MathUtils.randFloat(-3.5, 3.5),
        THREE.MathUtils.randFloat(-2.5, 2.5),
        THREE.MathUtils.randFloat(-1.5, 1.5)
    );

    piece.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );

    fragments.add(piece);
}

// ================================
// RESET VIEW BUTTON
// ================================

document.getElementById("reset").addEventListener(
    "click",
    () => {

        camera.position.set(0, 0, 9);

        controls.target.set(0, 0, 0);

        controls.update();
    }
);

// ================================
// WINDOW RESIZE
// ================================

window.addEventListener("resize", () => {

    camera.aspect =
        window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(
        window.innerWidth,
        window.innerHeight
    );

    renderer.setPixelRatio(
        Math.min(window.devicePixelRatio, 2)
    );
});

// ================================
// ANIMATION LOOP
// ================================

function animate() {

    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

animate();
