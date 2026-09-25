
        // 3D Broken Wolf Sculpture
        const artwork = new THREE.Group();
        scene.add(artwork);

        // Each point represents a part of the wolf's silhouette.
        // The pieces are scattered slightly in depth to create
        // a fragmented 3D sculpture.

        const wolfShape = new THREE.Shape();

        // Wolf head, ears, neck, and body silhouette
        wolfShape.moveTo(-1.7, 0.2);
        wolfShape.lineTo(-2.1, 0.8);
        wolfShape.lineTo(-2.0, 1.7);
        wolfShape.lineTo(-1.4, 1.2);
        wolfShape.lineTo(-0.9, 1.5);
        wolfShape.lineTo(-0.3, 1.3);
        wolfShape.lineTo(0.3, 0.9);
        wolfShape.lineTo(1.1, 0.8);
        wolfShape.lineTo(1.8, 1.2);
        wolfShape.lineTo(2.1, 0.9);
        wolfShape.lineTo(1.8, 0.4);
        wolfShape.lineTo(2.2, -0.2);
        wolfShape.lineTo(1.8, -0.7);
        wolfShape.lineTo(1.2, -0.6);
        wolfShape.lineTo(0.8, -1.4);
        wolfShape.lineTo(0.4, -1.4);
        wolfShape.lineTo(0.2, -0.5);
        wolfShape.lineTo(-0.8, -0.5);
        wolfShape.lineTo(-1.1, -1.4);
        wolfShape.lineTo(-1.5, -1.4);
        wolfShape.lineTo(-1.4, -0.4);
        wolfShape.lineTo(-2.0, -0.2);
        wolfShape.lineTo(-2.3, 0.1);
        wolfShape.closePath();

        // Create a hidden shape to determine the wolf's area
        const points = wolfShape.getPoints(100);

        // Wolf material
        const wolfMaterial = new THREE.MeshStandardMaterial({
            color: 0x9c9c9c,
            metalness: 0.45,
            roughness: 0.35,
            flatShading: true
        });

        const darkMaterial = new THREE.MeshStandardMaterial({
            color: 0x454545,
            metalness: 0.6,
            roughness: 0.3,
            flatShading: true
        });

        // Generate broken fragments
        const fragments = new THREE.Group();
        artwork.add(fragments);

        const fragmentCount = 180;

        for (let i = 0; i < fragmentCount; i++) {

            // Random position within the wolf silhouette
            const x = THREE.MathUtils.randFloat(-2.3, 2.2);
            const y = THREE.MathUtils.randFloat(-1.4, 1.7);

            // Check if the point is inside the wolf shape
            if (!THREE.ShapeUtils.isPointInsidePolygon(
                new THREE.Vector2(x, y),
                points
            )) {
                continue;
            }

            // Random size for broken pieces
            const size = THREE.MathUtils.randFloat(0.08, 0.22);

            // Create irregular fragments
            const geometry = new THREE.TetrahedronGeometry(
                size,
                0
            );

            const piece = new THREE.Mesh(
                geometry,
                Math.random() > 0.3
                    ? wolfMaterial
                    : darkMaterial
            );

            // Arrange pieces to form the wolf from the front
            piece.position.set(
                x,
                y,
                THREE.MathUtils.randFloat(-0.15, 0.15)
            );

            // Random rotation
            piece.rotation.set(
                Math.random() * Math.PI,
                Math.random() * Math.PI,
                Math.random() * Math.PI
            );

            fragments.add(piece);
        }

        // Floating broken pieces around the wolf
        for (let i = 0; i < 30; i++) {

            const size = THREE.MathUtils.randFloat(0.05, 0.16);

            const geometry = new THREE.TetrahedronGeometry(
                size,
                0
            );

            const piece = new THREE.Mesh(
                geometry,
                wolfMaterial
            );

            piece.position.set(
                THREE.MathUtils.randFloat(-3, 3),
                THREE.MathUtils.randFloat(-2, 2),
                THREE.MathUtils.randFloat(-0.8, 0.8)
            );

            fragments.add(piece);
        }

        // Center the sculpture
        artwork.position.set(0, 0, 0);
