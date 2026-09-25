import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/controls/OrbitControls.js";

// =====================================
// SCENE SETUP
// =====================================

const canvas = document.getElementById("viewer");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#10141c");

const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 0.5, 9);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;

// =====================================
// LIGHTING
// =====================================

scene.add(new THREE.AmbientLight("#ffffff", 2));

const mainLight = new THREE.DirectionalLight("#ffffff", 4);
mainLight.position.set(3, 5, 8);
scene.add(mainLight);

const blueLight = new THREE.PointLight("#668cff", 30);
blueLight.position.set(-4, 1, 3);
scene.add(blueLight);

const rimLight = new THREE.PointLight("#a5c8ff", 35);
rimLight.position.set(2, 4, -3);
scene.add(rimLight);

// =====================================
// WOLF MATERIALS
// =====================================

const silver = new THREE.MeshStandardMaterial({
    color: "#C0C5CC",
    metalness: 0.75,
    roughness: 0.28
});

const darkSilver = new THREE.MeshStandardMaterial({
    color: "#555D68",
    metalness: 0.6,
    roughness: 0.35
});

const innerEarMaterial = new THREE.MeshStandardMaterial({
    color: "#303743",
    metalness: 0.35,
    roughness: 0.55
});

const blackMaterial = new THREE.MeshStandardMaterial({
    color: "#11151c",
    metalness: 0.25,
    roughness: 0.3
});

const eyeMaterial = new THREE.MeshStandardMaterial({
    color: "#ffb52e",
    emissive: "#ff7900",
    emissiveIntensity: 1.5,
    metalness: 0.25,
    roughness: 0.2
});

// =====================================
// WOLF HEAD GROUP
// =====================================

const wolf = new THREE.Group();
scene.add(wolf);

// Helper: create a scaled sphere
function makeSphere(
    parent,
    material,
    position,
    scale
) {
    const geometry = new THREE.SphereGeometry(
        1,
        32,
        24
    );

    const mesh = new THREE.Mesh(
        geometry,
        material
    );

    mesh.position.set(
        position[0],
        position[1],
        position[2]
    );

    mesh.scale.set(
        scale[0],
        scale[1],
        scale[2]
    );

    parent.add(mesh);
    return mesh;
}

// Helper: create a cone
function makeCone(
    parent,
    material,
    position,
    radius,
    height,
    rotation
) {
    const geometry = new THREE.ConeGeometry(
        radius,
        height,
        32
    );

    const mesh = new THREE.Mesh(
        geometry,
        material
    );

    mesh.position.set(
        position[0],
        position[1],
        position[2]
    );

    mesh.rotation.set(
        rotation[0],
        rotation[1],
        rotation[2]
    );

    parent.add(mesh);
    return mesh;
}

// =====================================
// HEAD AND FOREHEAD
// =====================================

// Main skull
makeSphere(
    wolf,
    silver,
    [0, 0.2, 0],
    [1.25, 1.5, 0.8]
);

// Forehead
makeSphere(
    wolf,
    silver,
    [0, 0.85, 0.42],
    [0.85, 0.85, 0.5]
);

// Brow ridges
makeSphere(
    wolf,
    darkSilver,
    [-0.48, 0.35, 0.68],
    [0.5, 0.22, 0.2]
);

makeSphere(
    wolf,
    darkSilver,
    [0.48, 0.35, 0.68],
    [0.5, 0.22, 0.2]
);

// =====================================
// POINTED WOLF EARS
// =====================================

// Left ear
makeCone(
    wolf,
    silver,
    [-0.78, 1.85, 0],
    0.48,
    1.65,
    [0, 0, 0.18]
);

// Right ear
makeCone(
    wolf,
    silver,
    [0.78, 1.85, 0],
    0.48,
    1.65,
    [0, 0, -0.18]
);

// Inner ears
makeCone(
    wolf,
    innerEarMaterial,
    [-0.78, 1.9, 0.34],
    0.25,
    1.05,
    [0, 0, 0.18]
);

makeCone(
    wolf,
    innerEarMaterial,
    [0.78, 1.9, 0.34],
    0.25,
    1.05,
    [0, 0, -0.18]
);

// =====================================
// CHEEKS AND FACE FUR
// =====================================

// Left cheek
makeSphere(
    wolf,
    darkSilver,
    [-0.8, -0.35, 0.35],
    [0.55, 0.7, 0.42]
);

// Right cheek
makeSphere(
    wolf,
    darkSilver,
    [0.8, -0.35, 0.35],
    [0.55, 0.7, 0.42]
);

// Silver cheek highlights
makeSphere(
    wolf,
    silver,
    [-0.65, -0.55, 0.64],
    [0.35, 0.55, 0.22]
);

makeSphere(
    wolf,
    silver,
    [0.65, -0.55, 0.64],
    [0.35, 0.55, 0.22]
);

// =====================================
// EYES
// =====================================

// Dark eye sockets
makeSphere(
    wolf,
    blackMaterial,
    [-0.47, 0.25, 0.78],
    [0.32, 0.22, 0.15]
);

makeSphere(
    wolf,
    blackMaterial,
    [0.47, 0.25, 0.78],
    [0.32, 0.22, 0.15]
);

// Glowing golden eyes
makeSphere(
    wolf,
    eyeMaterial,
    [-0.47, 0.25, 0.91],
    [0.19, 0.13, 0.09]
);

makeSphere(
    wolf,
    eyeMaterial,
    [0.47, 0.25, 0.91],
    [0.19, 0.13, 0.09]
);

// Pupils
makeSphere(
    wolf,
    blackMaterial,
    [-0.47, 0.25, 0.99],
    [0.045, 0.12, 0.035]
);

makeSphere(
    wolf,
    blackMaterial,
    [0.47, 0.25, 0.99],
    [0.045, 0.12, 0.035]
);

// =====================================
// LONG WOLF MUZZLE
// =====================================

// Upper muzzle
makeSphere(
    wolf,
    silver,
    [0, -0.35, 0.85],
    [0.43, 0.65, 0.55]
);

// Lower muzzle / jaw
makeSphere(
    wolf,
    darkSilver,
    [0, -0.95, 0.75],
    [0.48, 0.3, 0.5]
);

// Nose
makeSphere(
    wolf,
    blackMaterial,
    [0, -0.05, 1.3],
    [0.27, 0.19, 0.2]
);

// Nose highlight
makeSphere(
    wolf,
    silver,
    [-0.07, 0.02, 1.47],
    [0.07, 0.035, 0.025]
);

// Mouth line
makeSphere(
    wolf,
    blackMaterial,
    [0, -0.72, 1.13],
    [0.3, 0.045, 0.08]
);

// Chin
makeSphere(
    wolf,
    silver,
    [0, -1.12, 0.85],
    [0.3, 0.16, 0.3]
);

// =====================================
// EXTRA FUR SPIKES
// =====================================

// Small pointed fur pieces along the cheeks
for (let side of [-1, 1]) {
    for (let i = 0; i < 3; i++) {
        const fur = makeCone(
            wolf,
            silver,
            [
                side * (0.85 + i * 0.08),
                -0.55 - i * 0.23,
                0.35
            ],
            0.18,
            0.65,
            [0, 0, side * -0.8]
        );

        fur.rotation.x = Math.PI / 2;
    }
}

// =====================================
// CONTROLS
// =====================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.06;

controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 14;

controls.target.set(0, 0.4, 0);

// Start facing forward
controls.update();

// Reset button
const resetButton = document.getElementById("reset");

if (resetButton) {
    resetButton.addEventListener("click", () => {
        camera.position.set(0, 0.5, 9);
        controls.target.set(0, 0.4, 0);
        controls.update();
    });
}

// =====================================
// RESIZE
// =====================================

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

// =====================================
// ANIMATION
// =====================================

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

animate();
