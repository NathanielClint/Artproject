import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.169.0/examples/jsm/controls/OrbitControls.js";
// =====================================
// 1. SCENE SETUP
// =====================================

const canvas = document.getElementById("viewer");

if (!canvas) {
    throw new Error("Canvas #viewer was not found in index.html");
}

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0b0d);

const camera = new THREE.PerspectiveCamera(
    45,
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
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.3;

// =====================================
// 2. INTERACTIVE CONTROLS
// =====================================

const controls = new OrbitControls(camera, canvas);

controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.enableZoom = true;
controls.enablePan = false;

controls.minDistance = 4;
controls.maxDistance = 18;

// =====================================
// 3. LIGHTING
// =====================================

scene.add(
    new THREE.AmbientLight(0xffffff, 2)
);

const mainLight = new THREE.DirectionalLight(
    0xffffff,
    3
);

mainLight.position.set(5, 6, 8);
scene.add(mainLight);

const blueLight = new THREE.PointLight(
    0x6688ff,
    35
);

blueLight.position.set(-5, 2, -4);
scene.add(blueLight);

const rimLight = new THREE.PointLight(
    0xffffff,
    25
);

rimLight.position.set(3, -3, -3);
scene.add(rimLight);

// =====================================
// 4. ARTWORK GROUP
// =====================================

const artwork = new THREE.Group();
scene.add(artwork);

const fragments = new THREE.Group();
artwork.add(fragments);

// Materials

const silverMaterial = new THREE.MeshStandardMaterial({
    color: 0xc0c5cc,
    metalness: 0.65,
    roughness: 0.3,
    flatShading: true
});

const darkMaterial = new THREE.MeshStandardMaterial({
    color: 0x555d68,
    metalness: 0.7,
    roughness: 0.32,
    flatShading: true
});

const blueMaterial = new THREE.MeshStandardMaterial({
    color: 0x667f99,
    metalness: 0.75,
    roughness: 0.25,
    flatShading: true
});

// =====================================
// 5. WOLF SHAPE
// =====================================

// Coordinates describe a side-view wolf silhouette.
// The wolf faces left.

const wolfOutline = [
    [-2.7,  0.3],
    [-2.3,  0.55],
    [-2.2,  1.35],
    [-1.9,  1.75],
    [-1.6,  1.0],
    [-1.0,  0.95],
    [-0.5,  0.65],
    [ 0.5,  0.8],
    [ 1.4,  1.1],
    [ 2.0,  1.0],
    [ 2.6,  1.45],
    [ 2.4,  0.7],
    [ 1.9,  0.3],
    [ 1.8, -0.2],
    [ 1.2, -0.4],
    [ 1.0, -1.5],
    [ 0.6, -1.5],
    [ 0.4, -0.45],
    [-0.8, -0.45],
    [-1.1, -1.5],
    [-1.5, -1.5],
    [-1.5, -0.3],
    [-2.1, -0.1],
    [-2.7,  0.0]
];

// =====================================
// 6. POINT-IN-POLYGON FUNCTION
// =====================================

// Checks whether a point is inside the wolf outline.
// This avoids depending on ShapeUtils argument order.

function isInsideWolf(x, y) {
    let inside = false;

    for (
        let i = 0, j = wolfOutline.length - 1;
        i < wolfOutline.length;
        j = i++
    ) {
        const xi = wolfOutline[i][0];
        const yi = wolfOutline[i][1];

        const xj = wolfOutline[j][0];
        const yj = wolfOutline[j][1];

        const intersects =
            ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) /
                (yj - yi) + xi);

        if (intersects) {
            inside = !inside;
        }
    }

    return inside;
}

// =====================================
// 7. GENERATE WOLF FRAGMENTS
// =====================================

// Each fragment is placed inside the wolf silhouette.
// From the front, the pieces form a wolf-shaped image.

const fragmentGeometry = new THREE.TetrahedronGeometry(
    1,
    0
);

const materials = [
    silverMaterial,
    silverMaterial,
    silverMaterial,
    darkMaterial,
    blueMaterial
];

const fragmentCount = 1100;

for (let i = 0; i < fragmentCount; i++) {

    const x = THREE.MathUtils.randFloat(-2.8, 2.7);
    const y = THREE.MathUtils.randFloat(-1.6, 1.8);

    if (!isInsideWolf(x, y)) {
        continue;
    }

    const piece = new THREE.Mesh(
        fragmentGeometry,
        materials[
            Math.floor(Math.random() * materials.length)
        ]
    );

    const size = THREE.MathUtils.randFloat(0.035, 0.12);

    piece.scale.set(
        size * THREE.MathUtils.randFloat(0.7, 1.5),
        size * THREE.MathUtils.randFloat(0.7, 1.5),
        size * THREE.MathUtils.randFloat(0.7, 1.5)
    );

    piece.position.set(
        x,
        y,
        THREE.MathUtils.randFloat(-0.25, 0.25)
    );

    piece.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );

    fragments.add(piece);
}

// =====================================
// 8. FLOATING OUTER FRAGMENTS
// =====================================

// Scattered pieces surrounding the wolf.

for (let i = 0; i < 120; i++) {

    let x, y;

    do {
        x = THREE.MathUtils.randFloat(-3.6, 3.6);
        y = THREE.MathUtils.randFloat(-2.5, 2.5);
    } while (isInsideWolf(x, y));

    const piece = new THREE.Mesh(
        fragmentGeometry,
        Math.random() > 0.5
            ? silverMaterial
            : darkMaterial
    );

    const size = THREE.MathUtils.randFloat(0.04, 0.14);

    piece.scale.setScalar(size);

    piece.position.set(
        x,
        y,
        THREE.MathUtils.randFloat(-0.8, 0.8)
    );

    piece.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    );

    fragments.add(piece);
}

// =====================================
// 9. RESET BUTTON
// =====================================

const resetButton = document.getElementById("reset");

if (resetButton) {
    resetButton.addEventListener("click", () => {
        camera.position.set(0, 0, 10);

        controls.target.set(0, 0, 0);

        controls.update();
    });
}

// =====================================
// 10. RESPONSIVE RESIZE
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
// 11. ANIMATION
// =====================================

function animate() {
    requestAnimationFrame(animate);

    controls.update();

    renderer.render(scene, camera);
}

animate();

console.log("3D Wolf Art loaded successfully!");
