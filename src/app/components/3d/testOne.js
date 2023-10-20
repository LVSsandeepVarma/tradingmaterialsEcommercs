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
  const touchPosition = { x: 0, y: 0 };

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
    camera.position.set(0, 0, 0);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height / 2);
    renderer.shadowMap.enabled = true;
    mount.current.appendChild(renderer.domElement);

    // Set the background color to transparent
    renderer.setClearColor(0xffffff, 1);

    const materials = [];

    // Load and map images to the cube faces
    for (let i = 0; i < 6; i++) {
      if (i === 0) {
        const texture = new THREE.TextureLoader().load(
          `/images/tm-man-cover-38.webp`
        );
        materials.push(
          new THREE.MeshBasicMaterial({
            map: texture,
            lightMap: texture,
            lightMapIntensity: 4.2,
            roughness: i === 4 ? 1000 : 1,
            metalness: i === 4 ? 1000 : 1,
            clipShadows: true,
          })
        );
      } else if (i === 1) {
        const texture = new THREE.TextureLoader().load(`/images/cod.webp`);
        materials.push(
          new THREE.MeshBasicMaterial({
            map: texture,
            lightMap: texture,
            lightMapIntensity: 4.2,
            opacity: 0.1,
            refractionRatio: 0,
            reflectivity: 0,
            fog: true,
            roughness: 1000,
            metalness: 1000,
            clipShadows: true,
            color: 0xffffff,
          })
        );
      } else if (i === 2) {
        const texture = new THREE.TextureLoader().load(`/images/cart.webp`);
        materials.push(
          new THREE.MeshBasicMaterial({
            map: texture,
            lightMap: texture,
            lightMapIntensity: 4.2,
            opacity: 0.1,
            refractionRatio: 0,
            reflectivity: 0,
            fog: true,
            roughness: 1000,
            metalness: 1000,
            clipShadows: true,
            color: 0xffffff,
          })
        );
      } else if (i === 5) {
        const texture = new THREE.TextureLoader().load(`/images/team.webp`);
        materials.push(
          new THREE.MeshBasicMaterial({
            map: texture,
            lightMap: texture,
            lightMapIntensity: 4.2,
            opacity: 0.1,
            refractionRatio: 0,
            reflectivity: 0,
            fog: true,
            roughness: 1000,
            metalness: 1000,
            clipShadows: true,
            color: 0xffffff,
          })
        );
      } else if (i === 3) {
        const texture = new THREE.TextureLoader().load(
          `/images/tradingComputer.webp`
        );
        materials.push(
          new THREE.MeshBasicMaterial({
            map: texture,
            lightMap: texture,
            lightMapIntensity: 4.2,
            opacity: 0.1,
            refractionRatio: 0,
            reflectivity: 0,
            fog: true,
            roughness: 1000,
            metalness: 1000,
            clipShadows: true,
            color: 0xffffff,
          })
        );
      } else if (i === 4) {
        const texture = new THREE.TextureLoader().load(`/images/stock.webp`);
        materials.push(
          new THREE.MeshBasicMaterial({
            map: texture,
            lightMap: texture,
            lightMapIntensity: 4.2,
            opacity: 0.1,
            refractionRatio: 0,
            reflectivity: 0,
            fog: true,
            roughness: 1000,
            metalness: 1000,
            clipShadows: true,
          })
        );
      }
    }

    const geometry = new THREE.BoxGeometry(1, 1, 1);
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
    const shadowGeometry = new THREE.BoxGeometry(1, 0.05, 1);
    const shadowMaterial = new THREE.MeshBasicMaterial({
      color: 0xe5e8e8,
      transparent: true,
      opacity: 0.5,
    });
    const shadow = new THREE.Mesh(shadowGeometry, shadowMaterial);
    shadow.position.copy(cube.position);
    shadow.position.setY(-0.85);
    shadow.receiveShadow = true;
    scene.add(shadow);
    cube.rotation.y = Math.PI / 4;
    cube.rotation.x = Math.PI / 7;
    camera.position.z = 2;

    const light = new THREE.DirectionalLight(0x000000, 1);
    light.position.set(1, 3, 5);
    light.castShadow = true;
    scene.add(light);

    const animate = () => {
      if (isRotating) {
        cube.rotation.y += rotationSpeed;
        wireframe.rotation.copy(cube.rotation);
        shadow.rotation.copy(cube.rotation);
        shadow.position.copy(cube.position);
        shadow.position.setY(-0.85);
      }

      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    const handleInputEvent = (event) => {
      const inputPosition = event.touches
        ? {
            x: (event.touches[0].clientX / width) * 2 - 1,
            y: -(event.touches[0].clientY / height) * 2 + 1,
          }
        : {
            x: (event.clientX / width) * 2 - 1,
            y: -(event.clientY / height) * 2 + 1,
          };

      if (event.touches || event.buttons === 1) {
        const deltaX = inputPosition.x - touchPosition.x;
        const deltaY = inputPosition.y - touchPosition.y;

        cube.rotation.y += deltaX * 2;
        cube.rotation.x += deltaY * 2;
        wireframe.rotation.copy(cube.rotation);
        shadow.rotation.copy(cube.rotation);
        shadow.position.copy(cube.position);
        shadow.position.setY(-0.85);
      }

      touchPosition.x = inputPosition.x;
      touchPosition.y = inputPosition.y;
    };

    mount.current.addEventListener("mousemove", handleInputEvent);
    mount.current.addEventListener("touchstart", handleInputEvent);
    mount.current.addEventListener("touchmove", handleInputEvent);

    const handleTouchEnd = () => {
      touchPosition.x = 0;
      touchPosition.y = 0;
    };

    mount.current.addEventListener("mouseup", handleTouchEnd);
    mount.current.addEventListener("touchend", handleTouchEnd);

    return () => {
      mount.current.removeEventListener("mousemove", handleInputEvent);
      mount.current.removeEventListener("touchstart", handleInputEvent);
      mount.current.removeEventListener("touchmove", handleInputEvent);
      mount.current.removeEventListener("mouseup", handleTouchEnd);
      mount.current.removeEventListener("touchend", handleTouchEnd);
      mount.current.removeChild(renderer.domElement);
    };
  }, [images, isRotating, rotationSpeed]);

  return <div ref={mount} />;
};

export default Box;
