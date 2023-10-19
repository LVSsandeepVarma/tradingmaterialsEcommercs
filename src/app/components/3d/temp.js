/* eslint-disable react/no-unknown-property */
import React from "react"
import { Canvas } from "react-three-fiber";
import Cube from "./testOne";
import { Html } from "@react-three/drei";

export default function Box() {
    return (
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Cube />
        <Html position={[0, 2, 0]}>
          <div style={{ color: "white" }}>
            <h2>Rotating Cube</h2>
          </div>
        </Html>
      </Canvas>
    );
}