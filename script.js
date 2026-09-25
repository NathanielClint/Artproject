import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// ==========================================
// SCENE
// ==========================================

const canvas = document.getElementById("viewer");

if (!canvas) {
    throw new Error("Canvas with id 'viewer' was not found.");
}

const scene = new THREE.Scene();
scene.background = new THREE.Color("#080e16");

const camera = new THREE.PerspectiveCamera(
    35,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

camera.position.set(0, 0.2, 11);

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

scene.add(new THREE.HemisphereLight("#dceaff", "#20212b", 2.5));

const frontLight = new THREE.DirectionalLight("#ffffff", 4);
frontLight.position.set(0, 4, 7);
scene.add(frontLight);

const leftLight = new THREE.PointLight("#68c8d8", 25);
leftLight.position.set(-4, 1, 3);
scene.add(leftLight);

const rightLight = new THREE.PointLight("#d68bff", 30);
rightLight.position.set(4, 1, 3);
scene.add(rightLight);

const backLight = new THREE.PointLight("#a5bfff", 40);
backLight.position.set(0, 3, -4);
scene.add(backLight);

// ==========================================
// MATERIALS
// ==========================================

function furMaterial(color, roughness = 0.9) {
    return new THREE.MeshStandardMaterial({
        color,
        roughness,
        metalness: 0.08,
        flatShading: true
    });
}

const fur = furMaterial("#777b80");
const furLight = furMaterial("#aeb2b7");
const furDark = furMaterial("#3d4249");
const furShadow = furMaterial("#252a32");
const earInside = furMaterial("#35313e");
const muzzleMat = furMaterial("#a2a4a7", 0.65);
const black = furMaterial("#101218", 0.3);

const eyeMat = new THREE.MeshStandardMaterial({
    color: "#f7bd54",
    emissive: "#e87918",
    emissiveIntensity: 0.7,
    roughness: 0.2
});

// ==========================================
// WOLF GROUP
// ==========================================

const wolf = new THREE.Group();
scene.add(wolf);

// All geometry is built relative to this group.
// Front of the wolf faces positive Z.

function sphere(parent, material, pos, scale, detail = 16) {
    const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(1, detail, detail),
        material
    );

    mesh.position.set(...pos);
    mesh.scale.set(...scale);
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    parent.add(mesh);
    return mesh;
}

function cone(parent, material, pos, radius, height, rotation = [0, 0, 0]) {
    const mesh = new THREE.Mesh(
        new THREE.ConeGeometry(radius, height, 7),
        material
    );

    mesh.position.set(...pos);
    mesh.rotation.set(...rotation);
    mesh.castShadow = true;

    parent.add(mesh);
    return mesh;
}

// ==========================================
// MAIN SKULL
// ==========================================

// Broad head
sphere(
    wolf, furDark,
    [0, 0.25, 0],
    [1.23, 1.48, 0.76],
    32
);

// Upper forehead
sphere(
    wolf, fur,
    [0, 0.75, 0.25],
    [0.91, 0.92, 0.62],
    24
);

// Central forehead ridge
sphere(
    wolf, furLight,
    [0, 0.95, 0.72],
    [0.18, 0.65, 0.14],
    12
);

// ==========================================
// POINTED EARS
// ==========================================

for (const side of [-1, 1]) {
    // Outer ear
    const ear = cone(
        wolf, furDark,
        [side * 0.82, 1.75, -0.02],
        0.49, 1.65,
        [0, 0, side * -0.15]
    );

    ear.scale.set(1, 1, 0.62);

    // Inner ear
    const inner = cone(
        wolf, earInside,
        [side * 0.82, 1.78, 0.28],
        0.31, 1.15,
        [0, 0, side * -0.15]
    );

    inner.scale.set(1, 1, 0.5);

    // Fur around ear edges
    for (let i = 0; i < 7; i++) {
        const y = 1.35 + i * 0.13;

        cone(
            wolf,
            i % 2 === 0 ? furLight : fur,
            [
                side * (0.57 + i * 0.035),
                y,
                0.32
            ],
            0.1,
            0.4,
            [0, 0, side * -0.4]
        );
    }
}

// ==========================================
// CHEEK STRUCTURE
// ==========================================

for (const side of [-1, 1]) {
    sphere(
        wolf, furDark,
        [side * 0.72, -0.22, 0.28],
        [0.57, 0.76, 0.48],
        20
    );

    sphere(
        wolf, fur,
        [side * 0.68, -0.42, 0.56],
        [0.42, 0.56, 0.3],
        16
    );

    // Cheekbone
    sphere(
        wolf, furLight,
        [side * 0.48, -0.12, 0.69],
        [0.3, 0.38, 0.19],
        16
    );
}

// ==========================================
// EYES AND EYEBROWS
// ==========================================

for (const side of [-1, 1]) {
    // Dark eye socket
    sphere(
        wolf, black,
        [side * 0.44, 0.37, 0.76],
        [0.34, 0.25, 0.18],
        20
    );

    // Amber eye
    sphere(
        wolf, eyeMat,
        [side * 0.44, 0.37, 0.91],
        [0.2, 0.115, 0.09],
        20
    );

    // Vertical pupil
    sphere(
        wolf, black,
        [side * 0.44, 0.37, 0.99],
        [0.045, 0.105, 0.035],
        12
    );

    // Brow ridge
    const brow = sphere(
        wolf, furDark,
        [side * 0.44, 0.63, 0.75],
        [0.4, 0.15, 0.2],
        16
    );

    brow.rotation.z = side * -0.15;

    // Highlight above eye
    sphere(
        wolf, furLight,
        [side * 0.44, 0.55, 0.85],
        [0.3, 0.06, 0.07],
        12
    );
}

// ==========================================
// LONG WOLF MUZZLE
// ==========================================

// Bridge of the nose
sphere(
    wolf, muzzleMat,
    [0, 0.02, 0.7],
    [0.34, 0.64, 0.48],
    24
);

// Left and right muzzle pads
for (const side of [-1, 1]) {
    sphere(
        wolf, furLight,
        [side * 0.21, -0.38, 1.02],
        [0.3, 0.32, 0.36],
        20
    );

    // Dark whisker pad
    sphere(
        wolf, furDark,
        [side * 0.23, -0.52, 1.13],
        [0.24, 0.2, 0.2],
        16
    );

    // Whisker spots
    for (let i = 0; i < 8; i++) {
        sphere(
            wolf, black,
            [
                side * (0.12 + (i % 3) * 0.11),
                -0.42 - Math.floor(i / 3) * 0.08,
                1.3
            ],
            [0.025, 0.025, 0.018],
            8
        );
    }
}

// Nose
sphere(
    wolf, black,
    [0, -0.08, 1.42],
    [0.25, 0.17, 0.18],
    20
);

// Nose highlight
sphere(
    wolf, furLight,
    [-0.07, -0.02, 1.57],
    [0.08, 0.025, 0.02],
    8
);

// Jaw
sphere(
    wolf, furDark,
    [0, -0.83, 0.75],
    [0.46, 0.32, 0.42],
    20
);

// Lower lip
sphere(
    wolf, black,
    [0, -0.77, 1.02],
    [0.28, 0.045, 0.08],
    12
);

// Chin
sphere(
    wolf, furLight,
    [0, -1.02, 0.86],
    [0.31, 0.17, 0.3],
    16
);

// ==========================================
// LAYERED FUR
// ==========================================

function addFur(x, y, z, length, angle, material, width = 0.11) {
    const strand = new THREE.Mesh(
        new THREE.ConeGeometry(width, length, 5),
        material
    );

    strand.position.set(x, y, z);
    strand.rotation.z = angle;
    strand.rotation.x = -0.3;

    strand.castShadow = true;
    wolf.add(strand);

    return strand;
}

// Forehead fur layers
for (let i = 0; i < 30; i++) {
    const x = THREE.MathUtils.randFloat(-0.72, 0.72);
    const y = THREE.MathUtils.randFloat(0.65, 1.4);

    addFur(
        x, y, THREE.MathUtils.randFloat(0.55, 0.75),
        THREE.MathUtils.randFloat(0.15, 0.45),
        THREE.MathUtils.randFloat(-0.5, 0.5),
        Math.random() > 0.5 ? furLight : fur,
        THREE.MathUtils.randFloat(0.04, 0.1)
    );
}

// Cheek fur tufts
for (const side of [-1, 1]) {
    for (let i = 0; i < 40; i++) {
        const x = side * THREE.MathUtils.randFloat(0.55, 1.05);
        const y = THREE.MathUtils.randFloat(-0.9, 0.2);
        const z = THREE.MathUtils.randFloat(0.35, 0.65);

        addFur(
            x, y, z,
            THREE.MathUtils.randFloat(0.2, 0.55),
            side * THREE.MathUtils.randFloat(0.3, 1.1),
            Math.random() > 0.65 ? furLight : furDark,
            THREE.MathUtils.randFloat(0.05, 0.13)
        );
    }
}

// ==========================================
// THICK NECK AND MANE
// ==========================================

sphere(
    wolf, furDark,
    [0, -1.45, -0.05],
    [1.03, 0.95, 0.62],
    24
);

// Layered neck fur
for (let i = 0; i < 110; i++) {
    const x = THREE.MathUtils.randFloat(-0.9, 0.9);
    const y = THREE.MathUtils.randFloat(-2.15, -0.85);
    const z = THREE.MathUtils.randFloat(-0.25, 0.45);

    const sideAngle = x * 0.7;

    addFur(
        x, y, z,
        THREE.MathUtils.randFloat(0.25, 0.65),
        sideAngle,
        Math.random() > 0.6 ? fur : furDark,
        THREE.MathUtils.randFloat(0.055, 0.13)
    );
}

// Central chest fur
for (let i = 0; i < 18; i++) {
    addFur(
        THREE.MathUtils.randFloat(-0.4, 0.4),
        -1.55 - i * 0.025,
        0.38,
        THREE.MathUtils.randFloat(0.25, 0.55),
        THREE.MathUtils.randFloat(-0.25, 0.25),
        i % 2 === 0 ? furLight : furDark,
        0.09
    );
}

// ==========================================
// INTERACTIVE CONTROLS
// ==========================================

const controls = new OrbitControls(
    camera,
    renderer.domElement
);

controls.enableDamping = true;
controls.dampingFactor = 0.06;

controls.enablePan = false;

controls.minDistance = 5;
controls.maxDistance = 16;

controls.minPolarAngle = 0.3;
controls.maxPolarAngle = Math.PI - 0.3;

controls.target.set(0, 0, 0);
controls.update();

// Reset button
const reset = document.getElementById("reset");

if (reset) {
    reset.addEventListener("click", () => {
        camera.position.set(0, 0.2, 11);
        controls.target.set(0, 0, 0);
        controls.update();
    });
}

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

// ==========================================
// ANIMATION
// ==========================================

function animate() {
    requestAnimationFrame(animate);

    controls.update();
    renderer.render(scene, camera);
}

animate();
