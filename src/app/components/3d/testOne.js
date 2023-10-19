/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as THREE from "three";

const Box = () => {
  const mount = useRef(null);
  const products = useSelector((state) => state?.products?.value);
  const width = window.innerWidth;
  const height = window.innerHeight;

  const [images, setImages] = useState([]);
  const [isRotating, setIsRotating] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0.01);
  const previousMousePosition = { x: 0, y: 0 };

  useEffect(() => {
    const imgs = [];
    products?.products?.forEach((product) => {
      imgs.push(product?.img_1);
    });
    setImages(imgs);
  }, [products]);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 1200 / 900, 1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, 550);
    renderer.shadowMap.enabled = true; // Enable shadow mapping
    mount.current.appendChild(renderer.domElement);

    // Set the background color to transparent
    renderer.setClearColor(0xffffff, 0);

    const materials = [];

    // Load and map images to the cube faces
    for (let i = 0; i < 6; i++) {
      const texture = new THREE.TextureLoader().load(`/images/${i}.png`);
      materials.push(
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: i === 4,
          roughness: i === 4 ? 1000 : 1,
          metalness: i === 4 ? 1000 : 1,
          clipShadows: true,
        })
      );
    }

    const geometry = new THREE.BoxGeometry(1.2, 1.2, 1.2);
    const cube = new THREE.Mesh(geometry, materials);
    cube.castShadow = true;
    cube.receiveShadow = true;
    scene.add(cube);

    const wireframeGeometry = new THREE.EdgesGeometry(geometry);
    const wireframeMaterial = new THREE.LineBasicMaterial({ color: 0x000000 });
    const wireframe = new THREE.LineSegments(
      wireframeGeometry,
      wireframeMaterial
    );
    wireframe.position.copy(cube.position);
    scene.add(wireframe);

    // Create a shadow geometry
    const shadowGeometry = new THREE.BoxGeometry(1.2, 0.05, 1.2); // Cube-shaped shadow
    const shadowMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      transparent: true,
      opacity: 0.5,
    });
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.position.copy(cube.position);
    shadow.position.setY(-0.65); // Adjust the Y position of the shadow to position it below the cube
    shadow.receiveShadow = true;
    scene.add(shadow);

    camera.position.z = 2;

    const light = new THREE.DirectionalLight(0x000000, 1);
    light.position.set(0, 3, 5);
    light.castShadow = true;
    scene.add(light);

    const animate = () => {
      if (isRotating) {
        cube.rotation.y += rotationSpeed;
        wireframe.rotation.copy(cube.rotation);
        shadow.rotation.copy(cube.rotation); // Match the shadow's rotation with the cube's rotation
        shadow.position.copy(cube.position); // Update shadow's position with cube's position
        shadow.position.setY(-0.85); // Adjust the Y position of the shadow
      }

      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    mount.current.addEventListener("mousemove", (event) => {
      const mousePosition = {
        x: (event.clientX / width) * 2 - 1,
        y: -(event.clientY / height) * 2 + 1,
      };

      if (event.buttons === 1) {
        const deltaX = mousePosition.x - previousMousePosition.x;
        const deltaY = mousePosition.y - previousMousePosition.y;

        cube.rotation.y += deltaX * 2;
        cube.rotation.x += deltaY * 2;
        wireframe.rotation.copy(cube.rotation);
        shadow.rotation.copy(cube.rotation); // Match the shadow's rotation with the cube's rotation
        shadow.position.copy(cube.position); // Update shadow's position with cube's position
        shadow.position.setY(-1.85); // Adjust the Y position of the shadow
      }

      previousMousePosition.x = mousePosition.x;
      previousMousePosition.y = mousePosition.y;
    });

    return () => {
      mount.current.removeEventListener("mousemove", () => {});
      mount.current.removeChild(renderer.domElement);
    };
  }, [images, isRotating, rotationSpeed]);

  return <div ref={mount} />;
};

export default Box;
